import { NextRequest, NextResponse } from "next/server";
import { formatHarga, ADMIN_WHATSAPP_NUMBER } from "@/lib/data";
import { getSupabaseRawVillas } from "@/lib/supabase/villas";
import { getTodayString } from "@/lib/date-utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const RATE_LIMIT_MAX_REQUESTS = 15;
const RATE_LIMIT_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const recentRequests = (requestLog.get(ip) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  const allowed = recentRequests.length < RATE_LIMIT_MAX_REQUESTS;

  if (allowed) recentRequests.push(now);
  requestLog.set(ip, recentRequests);

  // Keep the in-memory map bounded on long-lived server instances.
  if (requestLog.size > 10_000) {
    for (const [key, timestamps] of requestLog) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        requestLog.delete(key);
      }
    }
  }

  const retryAfter = allowed
    ? 0
    : Math.max(1, Math.ceil((recentRequests[0] + RATE_LIMIT_WINDOW_MS - now) / 1000));

  return { allowed, remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - recentRequests.length), retryAfter };
}

// 1. Smart Language Detector with Slang & Fallback
function detectLanguage(text: string, fallbackLocale = "id"): string {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // If text is short numbers or symbols, use client fallback locale directly
  if (/^[\d\s.,kKjJtTmMRpPdDsS$€¥+-]+$/.test(clean) || clean.length <= 3) {
    return fallbackLocale || "id";
  }

  // Korean
  if (/[\uac00-\ud7af\u1100-\u11ff]/.test(clean)) return "ko";
  // Japanese (Hiragana/Katakana)
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(clean)) return "ja";
  // Chinese
  if (/[\u4e00-\u9fa5]/.test(clean)) return "zh";
  // French
  if (
    /\b(bonjour|salut|merci|combien|chambre|piscine|réservation|comment|prix|s'il vous plaît|bonsoir|avec|pour|personnes|nuit|budget|recommande)\b/i.test(
      lower
    )
  )
    return "fr";
  // English
  if (
    /\b(hello|hi|hey|how much|book|booking|villa|price|cost|bedroom|pool|cancel|payment|stay|night|owner|whatsapp|recommend|budget|under|for|guests|people|couple|family|cheap|luxury)\b/i.test(
      lower
    )
  )
    return "en";
  // Indonesian (including Indonesian slang: "jt", "kalo", "gmn", "brp", "dong", "aja", "bisa", "buat", "dua", "orang")
  if (
    /\b(halo|hai|berapa|harga|kamar|kolam|renang|pesan|bayar|pemilik|batal|fasilitas|lokasi|malam|rekomendasi|gimana|cara|jt|juta|buat|untuk|orang|berdua|keluarga|murah|mewah|ada|bisa|rekomen|nginep|daerah)\b/i.test(
      lower
    )
  )
    return "id";

  return fallbackLocale || "id";
}

// 2. Budget Parser & Normalizer to IDR
function parseBudget(text: string): number | null {
  const lower = text.toLowerCase();

  // Millions notation: e.g. "2jt", "2.5 jt", "2,5 juta", "2 million", "2m", "2mio"
  const millionMatch = lower.match(
    /(?:di\s*bawah|under|max|budget|kurang\s*dari|moin\s*de|<=|<|\$|rp|idr)?\s*(\d+(?:[.,]\d+)?)\s*(?:jt|juta|mio|million|m\b)/i
  );
  if (millionMatch) {
    const val = parseFloat(millionMatch[1].replace(",", "."));
    if (!isNaN(val) && val > 0) return Math.round(val * 1_000_000);
  }

  // Thousands notation: e.g. "2000k", "1500k", "1200 k"
  const thousandMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*k\b/i);
  if (thousandMatch) {
    const val = parseFloat(thousandMatch[1].replace(",", "."));
    if (!isNaN(val) && val > 0) return Math.round(val * 1_000);
  }

  // USD / Foreign Currency notation: e.g. "$150", "150 usd", "100 dollar"
  const usdMatch = lower.match(/(?:\$|usd)\s*(\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?)\s*(?:usd|\$|dollar)/i);
  if (usdMatch) {
    const val = parseFloat((usdMatch[1] || usdMatch[2]).replace(",", "."));
    if (!isNaN(val) && val > 0) return Math.round(val * 16_000);
  }

  // Explicit IDR number: e.g. "Rp 2.000.000", "2000000", "Rp1.500.000"
  const idrMatch = lower.match(/(?:rp|idr)\.?\s*(\d{1,3}(?:[.,]\d{3})+|\d{6,8})/i);
  if (idrMatch) {
    const cleanNum = idrMatch[1].replace(/[.,]/g, "");
    const val = parseInt(cleanNum, 10);
    if (!isNaN(val) && val > 0) return val;
  }

  // Plain large number like 1500000 or 2000000
  const plainMatch = lower.match(/\b(\d{7,8})\b/);
  if (plainMatch) {
    const val = parseInt(plainMatch[1], 10);
    if (!isNaN(val) && val >= 500_000) return val;
  }

  return null;
}

// 3. Guest Capacity Parser
function parseGuestCount(text: string): number | null {
  const lower = text.toLowerCase();

  if (/\b(berdua|couple|pasangan|2 orang|2 tamu|2 pax|2 guests|2 people|2 persons|pour 2|2人|2名|2명)\b/i.test(lower)) {
    return 2;
  }
  if (/\b(sendiri|solo|1 orang|1 tamu|1 pax|1 guest|1 person|pour 1|1人|1名|1명)\b/i.test(lower)) {
    return 1;
  }

  const numMatch = lower.match(/(\d+)\s*(?:orang|tamu|pax|guests|people|persons|pers|人|名|명)/i);
  if (numMatch) {
    const count = parseInt(numMatch[1], 10);
    if (!isNaN(count) && count > 0) return count;
  }

  if (/\b(keluarga besar|rombongan|group|family of \d+|ramai)\b/i.test(lower)) {
    return 6;
  }

  if (/\b(keluarga|family|famille|家庭|家族|가족)\b/i.test(lower)) {
    return 4;
  }

  return null;
}

// 4. Location Parser
function parseLocation(text: string): string | null {
  const lower = text.toLowerCase();
  const regions = [
    "ubud",
    "seminyak",
    "canggu",
    "uluwatu",
    "nusa dua",
    "sanur",
    "jimbaran",
    "tabanan",
  ];
  for (const r of regions) {
    if (lower.includes(r)) return r;
  }
  return null;
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseRequestedDateRange(text: string): { from: string; to: string } {
  const today = new Date();
  const lower = text.toLowerCase();
  if (lower.includes("besok") || lower.includes("tomorrow")) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { from: formatDate(tomorrow), to: formatDate(tomorrow) };
  }

  const isoDates = text.match(/\b\d{4}-\d{2}-\d{2}\b/g) || [];
  if (isoDates.length > 0) {
    const firstIso = isoDates[0]!;
    return { from: firstIso, to: isoDates[1] || firstIso };
  }

  const slashDate = text.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/);
  if (slashDate) {
    const date = `${slashDate[3]}-${slashDate[2].padStart(2, "0")}-${slashDate[1].padStart(2, "0")}`;
    return { from: date, to: date };
  }

  const months: Record<string, number> = {
    januari: 0, january: 0, februari: 1, february: 1, maret: 2, march: 2,
    april: 3, mei: 4, may: 4, juni: 5, june: 5, juli: 6, july: 6,
    agustus: 7, august: 7, september: 8, oktober: 9, october: 9,
    november: 10, desember: 11, december: 11,
  };
  const namedDate = lower.match(/\b(\d{1,2})\s+([a-z]+)(?:\s+(\d{4}))?\b/);
  if (namedDate && months[namedDate[2]] !== undefined) {
    const date = new Date(
      Number(namedDate[3] || today.getFullYear()),
      months[namedDate[2]],
      Number(namedDate[1])
    );
    return { from: formatDate(date), to: formatDate(date) };
  }

  return { from: getTodayString(), to: getTodayString() };
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(getClientIp(req));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Silakan coba lagi sebentar." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter),
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { messages, locale = "id", currency = "IDR" } = body as {
      messages: ChatMessage[];
      locale?: string;
      currency?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const detectedLang = detectLanguage(lastUserMessage, locale);
    const query = lastUserMessage.toLowerCase();

    // Parse parameters
    const parsedBudget = parseBudget(lastUserMessage);
    const parsedGuests = parseGuestCount(lastUserMessage);
    const parsedLocation = parseLocation(lastUserMessage);
    const requestedDates = parseRequestedDateRange(lastUserMessage);

    // Intent detectors
    const isBookingFlow = /cara (booking|pesan)|how to book|comment réserver|如何预订|予約方法|예약 방법/i.test(query);
    const isPayment = /bayar|payment|paiement|支付|付款|支払い|결제|transfer|rekening/i.test(query);
    const isCancel = /batal|cancel|annul|退订|取消|キャンセル|환불/i.test(query);
    const isOwner = /daftar villa|list villa|host|pemilik|daftar properti|房东|掲載/i.test(query);
    const isContactAdmin = /admin|cs|customer service|kontak|hubungi|contact/i.test(query);
    const isSafety = /aman|safety|secure|security|bahaya|penipuan|scam/i.test(query);
    const isHighestPrice = /paling mahal|termahal|paling tinggi|highest price|most expensive|max price/i.test(query);
    const isLowestPrice = /paling murah|termurah|paling rendah|lowest price|cheapest|min price/i.test(query);
    const isGreeting = /^(halo|hai|hi|hello|hey|pagi|siang|sore|malam|bonjour|salut|你好|こんにちは|안녕하세요)[\s!?]*$/i.test(query);
    const isRecommendation = /rekomendasi|rekomen|cari|butuh|ingin|mau|pesan|sewa|booking|villa|penginapan|recommend|looking for|find/i.test(query);

    // 5. Strict Villa Matching Engine
    const villaDataRaw = await getSupabaseRawVillas();
    let candidateVillas = [...villaDataRaw];

    const availabilityClient = await createSupabaseServerClient();
    if (availabilityClient && villaDataRaw.length > 0) {
      const { data: unavailableRows, error: availabilityError } =
        await availabilityClient
          .from("villa_availability")
          .select("villa_id")
          .gte("date", requestedDates.from)
          .lte("date", requestedDates.to)
          .eq("is_available", false)
          .in("villa_id", villaDataRaw.map((villa) => villa.id));
      if (availabilityError) throw availabilityError;
      const unavailableIds = new Set(
        (unavailableRows || []).map((row) => row.villa_id)
      );
      candidateVillas = candidateVillas.filter(
        (villa) => !unavailableIds.has(villa.id)
      );
    }

    // Location filter
    if (parsedLocation) {
      candidateVillas = candidateVillas.filter((v) =>
        v.lokasi.id.toLowerCase().includes(parsedLocation)
      );
    }

    // Capacity filter
    if (parsedGuests) {
      candidateVillas = candidateVillas.filter(
        (v) => v.kapasitas_tamu >= parsedGuests
      );
    }

    // Budget filter
    if (parsedBudget) {
      candidateVillas = candidateVillas.filter(
        (v) => v.harga_per_malam <= parsedBudget
      );
    }

    // Sort matching villas by price ascending initially
    candidateVillas.sort((a, b) => a.harga_per_malam - b.harga_per_malam);

    // Helpers
    const allSortedByPrice = [...candidateVillas].sort(
      (a, b) => a.harga_per_malam - b.harga_per_malam
    );
    if (allSortedByPrice.length === 0) {
      return NextResponse.json({
        reply: "Maaf, saat ini tidak ada villa aktif yang tersedia hari ini.",
        recommendedVillaIds: [],
        quickReplies: ["Coba tanggal lain", "Hubungi Admin"],
        detectedLang,
        parsedParams: {
          budget: parsedBudget,
          guests: parsedGuests,
          location: parsedLocation,
          from: requestedDates.from,
          to: requestedDates.to,
        },
      });
    }
    const cheapestVilla = allSortedByPrice[0]; 
    const mostExpensiveVilla = allSortedByPrice[allSortedByPrice.length - 1];

    let reply = "";
    let recommendedVillaIds: string[] = [];
    let quickReplies: string[] = [];

    // --- CASE A: Safety Intent ---
    if (isSafety) {
      if (detectedLang === "id") {
        reply = `**Keamanan Terjamin!**\n\nSeluruh villa yang terdaftar di StayVilla berlokasi di area yang aman dan ramah wisatawan di Bali. Transaksi juga sangat transparan karena Anda akan terhubung **langsung dengan pemilik resmi villa** via WhatsApp tanpa perantara. Jika ada keraguan, Anda selalu dapat meminta *video call* dengan pemilik sebelum mentransfer dana.`;
        quickReplies = ["Bagaimana cara booking?", "Rekomendasi Villa", "Kebijakan pembatalan"];
      } else {
        reply = `**Your Safety is Guaranteed!**\n\nAll villas listed on StayVilla are located in safe, tourist-friendly neighborhoods in Bali. Transactions are fully transparent as you deal **directly with the verified owner** via WhatsApp. If you have any doubts, you can always request a video call with the host before making any payments.`;
        quickReplies = ["How to book?", "Villa Recommendations", "Cancellation Policy"];
      }
    }
    // --- CASE B: Highest / Lowest Price Intent ---
    else if (isHighestPrice) {
      recommendedVillaIds = [mostExpensiveVilla.id];
      if (detectedLang === "id") {
        reply = `Villa dengan harga tertinggi dan termewah di katalog kami saat ini adalah **${mostExpensiveVilla.nama}** di ${mostExpensiveVilla.lokasi.id}, dengan tarif **${formatHarga(mostExpensiveVilla.harga_per_malam)}/malam**.\n\nVilla ini sangat cocok untuk pengalaman menginap eksklusif Anda!`;
        quickReplies = ["Lihat villa termurah", "Cari villa di Seminyak"];
      } else {
        reply = `The most luxurious and highest-priced villa in our catalog is **${mostExpensiveVilla.nama}** in ${mostExpensiveVilla.lokasi.id}, priced at **${formatHarga(mostExpensiveVilla.harga_per_malam)}/night**.\n\nPerfect for your exclusive getaway!`;
        quickReplies = ["See cheapest villa", "Villas in Seminyak"];
      }
    }
    else if (isLowestPrice) {
      recommendedVillaIds = [cheapestVilla.id];
      if (detectedLang === "id") {
        reply = `Villa dengan harga paling terjangkau di katalog kami adalah **${cheapestVilla.nama}** di ${cheapestVilla.lokasi.id}, dengan tarif hanya **${formatHarga(cheapestVilla.harga_per_malam)}/malam**.\n\nSangat nyaman untuk liburan hemat Anda!`;
        quickReplies = ["Lihat villa termahal", "Cari villa di Ubud"];
      } else {
        reply = `Our most affordable private villa is **${cheapestVilla.nama}** in ${cheapestVilla.lokasi.id}, starting at just **${formatHarga(cheapestVilla.harga_per_malam)}/night**.\n\nPerfect for a budget-friendly vacation!`;
        quickReplies = ["See most expensive villa", "Villas in Ubud"];
      }
    }
    // --- CASE C: Informational Intent ---
    else if (isBookingFlow) {
      if (detectedLang === "id") {
        reply = `**Alur Pemesanan di StayVilla sangat mudah:**\n\n1. 🏡 **Pilih Villa**\n2. 📅 **Tentukan Tanggal**\n3. 💬 **Klik 'Booking via WhatsApp'**\n4. 🤝 **Konfirmasi & Bayar** langsung ke pemilik villa tanpa markup.`;
        quickReplies = ["Lihat Villa di Ubud", "Apakah pembayaran aman?"];
      } else {
        reply = `**How to Book on StayVilla:**\n\n1. 🏡 **Choose Your Villa**\n2. 📅 **Select Dates**\n3. 💬 **Click 'Book via WhatsApp'**\n4. 🤝 **Confirm & Pay Direct** to the owner with no markup.`;
        quickReplies = ["Villas in Ubud", "Is payment safe?"];
      }
    } else if (isPayment) {
      if (detectedLang === "id") {
        reply = `**Informasi Pembayaran:**\n\nTransfer deposit dan pelunasan dilakukan **langsung ke rekening pemilik villa** via WhatsApp. StayVilla tidak memotong biaya apapun di website.`;
        quickReplies = ["Bagaimana cara booking?", "Rekomendasi Villa Mewah"];
      } else {
        reply = `**Payment Details:**\n\nDeposits and balances are paid **directly to the owner's bank account** via WhatsApp. StayVilla does not charge any fees on this website.`;
        quickReplies = ["How to book?", "Luxury Villas in Bali"];
      }
    } else if (isCancel) {
      if (detectedLang === "id") {
        reply = `**Kebijakan Pembatalan:** Ditentukan oleh masing-masing pemilik villa. Harap sepakati via WhatsApp sebelum membayar DP.`;
        quickReplies = ["Bagaimana cara booking?", "Chat Admin"];
      } else {
        reply = `**Cancellation Policy:** Set individually by each villa owner. Please confirm via WhatsApp before sending your deposit.`;
        quickReplies = ["How to book?", "Contact Admin"];
      }
    }
    // --- CASE D: Budget Given, but No Villa Found (Strict Budget Fallback) ---
    else if (parsedBudget && candidateVillas.length === 0) {
      const formattedBudget = formatHarga(parsedBudget);
      const cheapestPrice = formatHarga(cheapestVilla.harga_per_malam);
      
      if (detectedLang === "id") {
        reply = `Maaf, saat ini belum ada villa di bawah **${formattedBudget}**. Villa kami yang paling terjangkau mulai dari **${cheapestPrice}** per malam, yaitu **${cheapestVilla.nama}**.\n\nBerikut rekomendasi villa terbaik kami:`;
        quickReplies = ["Lihat Studio Anggrek", "Cari villa di Sanur"];
      } else {
        reply = `Sorry, we have no villas under **${formattedBudget}**. Our most affordable starts from **${cheapestPrice}**/night (**${cheapestVilla.nama}**).\n\nHere are some recommendations:`;
        quickReplies = ["View Studio Anggrek", "Villas in Sanur"];
      }
      recommendedVillaIds = allSortedByPrice.slice(0, 2).map((v) => v.id);
    }
    // --- CASE E: Valid Search Query Resulting in Matching Villas ---
    else if ((parsedLocation || parsedGuests || parsedBudget || isRecommendation) && candidateVillas.length > 0) {
      const topVillas = candidateVillas.slice(0, 3);
      recommendedVillaIds = topVillas.map((v) => v.id);

      const villaBullets = topVillas
        .map((v) => `• **${v.nama}** — ${formatHarga(v.harga_per_malam)}/malam`)
        .join("\n");

      if (detectedLang === "id") {
        reply = `Saya menemukan ${topVillas.length} villa di Bali yang sesuai kriteria Anda:\n\n${villaBullets}\n\nSilakan klik kartu di bawah untuk detail!`;
        quickReplies = ["Bandingkan villa ini", "Cari wilayah lain"];
      } else {
        reply = `Here are ${topVillas.length} private villas in Bali matching your criteria:\n\n${villaBullets}\n\nClick any card below for details!`;
        quickReplies = ["Compare these villas", "Explore other areas"];
      }
    }
    // --- CASE F: General Inquiry Greeting / Unmatched Intent ---
    else {
      if (isGreeting) {
        if (detectedLang === "id") {
          reply = `Halo! Selamat datang di StayVilla AI Concierge. Ada yang bisa saya bantu terkait informasi villa, ketersediaan, atau cara booking?`;
          quickReplies = ["Rekomendasi Villa", "Cara booking", "Villa paling murah"];
        } else {
          reply = `Hello! Welcome to StayVilla AI Concierge. How can I help you today with villa recommendations or booking information?`;
          quickReplies = ["Villa recommendations", "How to book", "Cheapest villa"];
        }
      } else {
        // Fallback for completely unrecognized text that has no params
        if (detectedLang === "id") {
          reply = `Maaf, saya kurang mengerti pertanyaan Anda terkait "${lastUserMessage}".\n\nSaya bisa membantu mencarikan villa berdasarkan **lokasi**, **budget**, **kapasitas tamu**, atau menjawab pertanyaan seputar keamanan dan pembayaran. Apa yang Anda butuhkan?`;
          quickReplies = ["Villa di Ubud", "Villa budget 2 juta", "Apakah disini aman?"];
        } else {
          reply = `I'm sorry, I didn't quite catch that. \n\nI can help you find villas based on **location**, **budget**, **number of guests**, or answer questions about safety and booking. What are you looking for?`;
          quickReplies = ["Villas in Ubud", "Villas under $150", "Is it safe here?"];
        }
      }
    }

    return NextResponse.json(
      {
        reply,
        recommendedVillaIds,
        quickReplies,
        detectedLang,
        parsedParams: {
          budget: parsedBudget,
          guests: parsedGuests,
          location: parsedLocation,
          from: requestedDates.from,
          to: requestedDates.to,
        },
      },
      {
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error: any) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      {
        reply: "Mohon maaf, sistem AI sedang memproses permintaan. Silakan tanyakan kembali seputar villa atau hubungi WhatsApp Admin StayVilla.",
        recommendedVillaIds: ["villa-teratai", "villa-cendana"],
        quickReplies: ["Lihat Villa di Bali", "Cara Booking", "Hubungi Admin"],
      },
      { status: 200 }
    );
  }
}
