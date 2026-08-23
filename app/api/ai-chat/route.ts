import { NextRequest, NextResponse } from "next/server";
import { formatHarga } from "@/lib/data";
import { getSupabaseRawVillas } from "@/lib/supabase/villas";
import { getTodayString } from "@/lib/date-utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const RATE_LIMIT_MAX_REQUESTS = 25;
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

  return {
    allowed,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - recentRequests.length),
    retryAfter,
  };
}

// 1. Adaptive Multi-Language Detector
function detectLanguage(text: string, fallbackLocale = "id"): string {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // Short queries / pure numbers -> fallback to user's active UI locale
  if (/^[\d\s.,kKjJtTmMRpPdDsS$€¥+-]+$/.test(clean) || clean.length <= 2) {
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
    /\b(bonjour|salut|merci|combien|chambre|piscine|réservation|comment|prix|s'il vous plaît|bonsoir|avec|pour|personnes|nuit|budget|recommande|vacances)\b/i.test(
      lower
    )
  ) {
    return "fr";
  }
  // English
  if (
    /\b(hello|hi|hey|how much|book|booking|villa|price|cost|bedroom|pool|cancel|payment|stay|night|owner|whatsapp|recommend|budget|under|for|guests|people|couple|family|cheap|luxury|vacation)\b/i.test(
      lower
    )
  ) {
    return "en";
  }
  // Indonesian (including popular slang: "jt", "kalo", "gmn", "brp", "dong", "aja", "bisa", "buat", "nginep", "rekomen")
  if (
    /\b(halo|hai|berapa|harga|kamar|kolam|renang|pesan|bayar|pemilik|batal|fasilitas|lokasi|malam|rekomendasi|gimana|cara|jt|juta|buat|untuk|orang|berdua|keluarga|murah|mewah|ada|bisa|rekomen|nginep|daerah|kak|gan|min)\b/i.test(
      lower
    )
  ) {
    return "id";
  }

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
  const usdMatch = lower.match(
    /(?:\$|usd)\s*(\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?)\s*(?:usd|\$|dollar)/i
  );
  if (usdMatch) {
    const val = parseFloat((usdMatch[1] || usdMatch[2]).replace(",", "."));
    if (!isNaN(val) && val > 0) return Math.round(val * 16_000);
  }

  // Explicit IDR number: e.g. "Rp 2.000.000", "2000000", "Rp1.500.000"
  const idrMatch = lower.match(
    /(?:rp|idr)\.?\s*(\d{1,3}(?:[.,]\d{3})+|\d{6,8})/i
  );
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

  if (
    /\b(berdua|couple|pasangan|2 orang|2 tamu|2 pax|2 guests|2 people|2 persons|pour 2|2人|2名|2명)\b/i.test(
      lower
    )
  ) {
    return 2;
  }
  if (
    /\b(sendiri|solo|1 orang|1 tamu|1 pax|1 guest|1 person|pour 1|1人|1名|1명)\b/i.test(
      lower
    )
  ) {
    return 1;
  }

  const numMatch = lower.match(
    /(\d+)\s*(?:orang|tamu|pax|guests|people|persons|pers|人|名|명)/i
  );
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
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
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
    januari: 0,
    january: 0,
    februari: 1,
    february: 1,
    maret: 2,
    march: 2,
    april: 3,
    mei: 4,
    may: 4,
    juni: 5,
    june: 5,
    juli: 6,
    july: 6,
    agustus: 7,
    august: 7,
    september: 8,
    oktober: 9,
    october: 9,
    november: 10,
    desember: 11,
    december: 11,
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
    const { messages, locale = "id" } = body as {
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
    const isBookingFlow =
      /cara (booking|pesan)|how to book|comment réserver|如何预订|予約方法|예약 방법/i.test(
        query
      );
    const isPayment =
      /bayar|payment|paiement|支付|付款|支払い|결제|transfer|rekening/i.test(
        query
      );
    const isCancel =
      /batal|cancel|annul|退订|取消|キャンセル|환불/i.test(query);
    const isSafety =
      /aman|safety|secure|security|bahaya|penipuan|scam/i.test(query);
    const isHighestPrice =
      /paling mahal|termahal|paling tinggi|highest price|most expensive|max price|最贵|最高/i.test(
        query
      );
    const isLowestPrice =
      /paling murah|termurah|paling rendah|lowest price|cheapest|min price|最便宜|格安/i.test(
        query
      );
    const isGreeting =
      /^(halo|hai|hi|hello|hey|pagi|siang|sore|malam|bonjour|salut|你好|こんにちは|안녕하세요)[\s!?]*$/i.test(
        query
      );
    const isRecommendation =
      /rekomendasi|rekomen|cari|butuh|ingin|mau|pesan|sewa|booking|villa|penginapan|recommend|looking for|find|chercher|推荐|おすすめ|추천/i.test(
        query
      );

    // 5. Strict Villa Matching Engine
    const villaDataRaw = await getSupabaseRawVillas();
    let candidateVillas = [...villaDataRaw];

    const availabilityClient = await createSupabaseServerClient();
    if (availabilityClient && villaDataRaw.length > 0) {
      const { data: unavailableRows } = await availabilityClient
        .from("villa_availability")
        .select("villa_id")
        .gte("date", requestedDates.from)
        .lte("date", requestedDates.to)
        .eq("is_available", false)
        .in("villa_id", villaDataRaw.map((villa) => villa.id));

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

    const allSortedByPrice = [...villaDataRaw].sort(
      (a, b) => a.harga_per_malam - b.harga_per_malam
    );

    const cheapestVilla = allSortedByPrice[0] || villaDataRaw[0];
    const mostExpensiveVilla =
      allSortedByPrice[allSortedByPrice.length - 1] || villaDataRaw[0];

    let reply = "";
    let recommendedVillaIds: string[] = [];
    let quickReplies: string[] = [];

    // Localized responses dictionary
    if (isSafety) {
      if (detectedLang === "id") {
        reply = `**Keamanan Terjamin!**\n\nSeluruh villa yang terdaftar di StayVilla berlokasi di kawasan aman dan terverifikasi di Bali. Anda bertransaksi **langsung dengan pemilik resmi villa** via WhatsApp tanpa markup perantara.`;
        quickReplies = ["Bagaimana cara booking?", "Rekomendasi Villa", "Kebijakan pembatalan"];
      } else if (detectedLang === "fr") {
        reply = `**Sécurité Garantie !**\n\nToutes les villas répertoriées sur StayVilla sont situées dans des quartiers sûrs et vérifiés à Bali. Vous traitez **directement avec le propriétaire vérifié** via WhatsApp sans intermédiaire.`;
        quickReplies = ["Comment réserver ?", "Recommandations", "Politique d'annulation"];
      } else if (detectedLang === "zh") {
        reply = `**安全保障！**\n\nStayVilla平台收录的所有巴厘岛别墅均位于安全区域并经实地验证。您可通过WhatsApp**直接与官方房东沟通与确认**，无任何中介加价。`;
        quickReplies = ["如何预订别墅？", "推荐特色别墅", "退订政策说明"];
      } else if (detectedLang === "ja") {
        reply = `**安心のセキュリティ！**\n\nStayVillaに掲載されているすべてのヴィラは、バリ島の安全なエリアに位置し、認証済みです。仲介手数料なしで、WhatsAppを通じて**オーナーと直接取引**いただけます。`;
        quickReplies = ["予約方法について", "おすすめヴィラ", "キャンセルポリシー"];
      } else if (detectedLang === "ko") {
        reply = `**안전성 보장!**\n\nStayVilla의 모든 빌라는 발리의 안전한 지역에 위치하며 사전 검증을 완료했습니다. 중개 수수료 없이 WhatsApp을 통해 **인증된 빌라 호스트와 직접 예약**할 수 있습니다.`;
        quickReplies = ["예약 방법 안내", "추천 풀빌라", "취소 정책 안내"];
      } else {
        reply = `**Your Safety is Guaranteed!**\n\nAll villas listed on StayVilla are located in safe, tourist-friendly neighborhoods in Bali. You deal **directly with the verified owner** via WhatsApp with full transparency and no markup.`;
        quickReplies = ["How to book?", "Villa Recommendations", "Cancellation Policy"];
      }
    } else if (isHighestPrice) {
      recommendedVillaIds = [mostExpensiveVilla.id];
      if (detectedLang === "id") {
        reply = `Villa paling mewah dan eksklusif di katalog kami adalah **${mostExpensiveVilla.nama}** (${mostExpensiveVilla.lokasi.id}) seharga **${formatHarga(mostExpensiveVilla.harga_per_malam)}/malam**.\n\nSangat cocok untuk liburan mewah nan istimewa!`;
        quickReplies = ["Lihat villa termurah", "Cari villa di Seminyak"];
      } else if (detectedLang === "zh") {
        reply = `我们目录中最奢华顶级的别墅是 **${mostExpensiveVilla.nama}** (${mostExpensiveVilla.lokasi.id})，价格为 **${formatHarga(mostExpensiveVilla.harga_per_malam)}/晚**。专为尊贵海岛假期打造！`;
        quickReplies = ["查看最优惠别墅", "搜索水明漾别墅"];
      } else if (detectedLang === "ja") {
        reply = `当コレクションで最も高級なヴィラは **${mostExpensiveVilla.nama}** (${mostExpensiveVilla.lokasi.id})、料金は1泊 **${formatHarga(mostExpensiveVilla.harga_per_malam)}** です。極上のバリ島ステイをお楽しみください！`;
        quickReplies = ["最もお得なヴィラ", "スミニャックのヴィラ"];
      } else if (detectedLang === "ko") {
        reply = `저희 컬렉션에서 가장 럭셔리한 최고급 빌라는 **${mostExpensiveVilla.nama}** (${mostExpensiveVilla.lokasi.id})이며, 1박 요금은 **${formatHarga(mostExpensiveVilla.harga_per_malam)}**입니다.`;
        quickReplies = ["가장 가성비 좋은 빌라", "스미냑 지역 빌라 검색"];
      } else {
        reply = `The most luxurious and highest-tier villa in our catalog is **${mostExpensiveVilla.nama}** (${mostExpensiveVilla.lokasi.id}), priced at **${formatHarga(mostExpensiveVilla.harga_per_malam)}/night**.\n\nPerfect for an ultra-premium getaway!`;
        quickReplies = ["See cheapest villa", "Villas in Seminyak"];
      }
    } else if (isLowestPrice) {
      recommendedVillaIds = [cheapestVilla.id];
      if (detectedLang === "id") {
        reply = `Villa dengan harga paling hemat & nyaman adalah **${cheapestVilla.nama}** (${cheapestVilla.lokasi.id}) dengan tarif mulai dari **${formatHarga(cheapestVilla.harga_per_malam)}/malam**.`;
        quickReplies = ["Lihat villa termahal", "Cari villa di Ubud"];
      } else if (detectedLang === "zh") {
        reply = `最具性价比的舒适度假别墅是 **${cheapestVilla.nama}** (${cheapestVilla.lokasi.id})，价格仅从 **${formatHarga(cheapestVilla.harga_per_malam)}/晚** 起。`;
        quickReplies = ["查看顶级奢华别墅", "搜索乌布别墅"];
      } else if (detectedLang === "ja") {
        reply = `最もリーズナブルでお得なヴィラは **${cheapestVilla.nama}** (${cheapestVilla.lokasi.id})、1泊 **${formatHarga(cheapestVilla.harga_per_malam)}〜** です。`;
        quickReplies = ["最高級ヴィラを見る", "ウブドのヴィラ"];
      } else if (detectedLang === "ko") {
        reply = `가장 가성비가 뛰어난 안락한 풀빌라는 **${cheapestVilla.nama}** (${cheapestVilla.lokasi.id})이며, 1박 **${formatHarga(cheapestVilla.harga_per_malam)}~**부터 시작합니다.`;
        quickReplies = ["최고급 럭셔리 빌라", "우붓 지역 빌라 검색"];
      } else {
        reply = `Our most affordable private villa is **${cheapestVilla.nama}** (${cheapestVilla.lokasi.id}), starting at just **${formatHarga(cheapestVilla.harga_per_malam)}/night**.`;
        quickReplies = ["See most luxurious", "Villas in Ubud"];
      }
    } else if (isBookingFlow) {
      if (detectedLang === "id") {
        reply = `**Alur Pemesanan di StayVilla Sangat Mudah:**\n\n1. 🏡 **Pilih Villa** yang Anda sukai\n2. 📅 **Pilih Tanggal** Check-in & Check-out\n3. 💬 **Klik 'Booking via WhatsApp'** untuk terhubung dengan pemilik\n4. 🤝 **Konfirmasi & Bayar** langsung ke pemilik tanpa biaya admin.`;
        quickReplies = ["Lihat Villa di Ubud", "Apakah pembayaran aman?"];
      } else if (detectedLang === "zh") {
        reply = `**在StayVilla预订非常简单：**\n\n1. 🏡 **挑选心仪的别墅**\n2. 📅 **选择入住和退房日期**\n3. 💬 **点击“通过WhatsApp预订”** 直接联系房东\n4. 🤝 **确认细节并直接向房东付款**，无任何中介手续费。`;
        quickReplies = ["查看乌布别墅", "付款是否安全？"];
      } else if (detectedLang === "ja") {
        reply = `**StayVillaでのご予約手順：**\n\n1. 🏡 **お好みのヴィラを選択**\n2. 📅 **宿泊日程を選択**\n3. 💬 **「WhatsAppで予約」をクリック**してオーナーに直接連絡\n4. 🤝 **日程確認とお支払い**を直接完了（仲介手数料なし）。`;
        quickReplies = ["ウブドのヴィラ", "支払いは安全ですか？"];
      } else if (detectedLang === "ko") {
        reply = `**StayVilla 예약 안내:**\n\n1. 🏡 **원하는 빌라 선택**\n2. 📅 **체크인/체크아웃 날짜 지정**\n3. 💬 **'WhatsApp으로 예약' 클릭**하여 호스트와 직접 대화\n4. 🤝 수수료 없이 **호스트에게 직접 예약 및 결제 확인**.`;
        quickReplies = ["우붓 풀빌라 보기", "결제는 안전한가요?"];
      } else {
        reply = `**How to Book on StayVilla:**\n\n1. 🏡 **Choose Your Villa**\n2. 📅 **Select Dates**\n3. 💬 **Click 'Book via WhatsApp'**\n4. 🤝 **Confirm & Pay Direct** to the owner with 0% extra fees.`;
        quickReplies = ["Villas in Ubud", "Is payment safe?"];
      }
    } else if (parsedBudget && candidateVillas.length === 0) {
      const formattedBudget = formatHarga(parsedBudget);
      const cheapestPrice = formatHarga(cheapestVilla.harga_per_malam);

      if (detectedLang === "id") {
        reply = `Maaf, saat ini belum ada villa di bawah **${formattedBudget}**. Villa kami yang paling terjangkau mulai dari **${cheapestPrice}**/malam (**${cheapestVilla.nama}**).\n\nBerikut rekomendasi villa terdekat dengan budget Anda:`;
        quickReplies = ["Lihat Studio Anggrek", "Cari villa di Sanur"];
      } else if (detectedLang === "zh") {
        reply = `抱歉，目前暂无预算低于 **${formattedBudget}** 的空房。最优惠别墅为 **${cheapestVilla.nama}**（**${cheapestPrice}**/晚起）。为您推荐最接近的精选别墅：`;
        quickReplies = ["查看兰花单间别墅", "搜索萨努尔别墅"];
      } else if (detectedLang === "ja") {
        reply = `申し訳ございません。現在 **${formattedBudget}** 以下のヴィラはございません。最もお得なヴィラは **${cheapestVilla.nama}**（1泊 **${cheapestPrice}〜**）です。おすすめはこちらです：`;
        quickReplies = ["スタジオ・アングレック", "サヌールのヴィラ"];
      } else if (detectedLang === "ko") {
        reply = `죄송합니다. 현재 **${formattedBudget}** 이하의 빌라가 없습니다. 가장 저렴한 빌라는 **${cheapestVilla.nama}**(1박 **${cheapestPrice}~**)부터 시작합니다. 추천 빌라를 확인해보세요:`;
        quickReplies = ["스튜디오 앙그렉 보기", "사누르 지역 빌라 검색"];
      } else {
        reply = `Sorry, we currently have no villas under **${formattedBudget}**. Our most affordable is **${cheapestVilla.nama}** starting at **${cheapestPrice}**/night.\n\nHere are the closest recommendations:`;
        quickReplies = ["View Studio Anggrek", "Villas in Sanur"];
      }
      recommendedVillaIds = allSortedByPrice.slice(0, 2).map((v) => v.id);
    } else if (
      (parsedLocation || parsedGuests || parsedBudget || isRecommendation) &&
      candidateVillas.length > 0
    ) {
      const topVillas = candidateVillas.slice(0, 3);
      recommendedVillaIds = topVillas.map((v) => v.id);

      const villaBullets = topVillas
        .map(
          (v) =>
            `• **${v.nama}** (${v.lokasi.id}) — ${formatHarga(
              v.harga_per_malam
            )}/malam · ${v.jumlah_kamar} Kamar (${v.kapasitas_tamu} Tamu)`
        )
        .join("\n");

      if (detectedLang === "id") {
        reply = `Saya menemukan ${topVillas.length} villa pilihan yang sesuai untuk Anda:\n\n${villaBullets}\n\nSilakan klik kartu villa di bawah untuk melihat foto lengkap & fasilitas!`;
        quickReplies = ["Bandingkan villa ini", "Cari wilayah lain", "Cara booking"];
      } else if (detectedLang === "zh") {
        reply = `为您找到 ${topVillas.length} 套符合要求的精选巴厘岛度假别墅：\n\n${villaBullets}\n\n请点击下方卡片查看完整照片与详细设施！`;
        quickReplies = ["对比这些别墅", "查看其他区域", "如何预订"];
      } else if (detectedLang === "ja") {
        reply = `ご希望条件にぴったりのヴィラが ${topVillas.length} 件見つかりました：\n\n${villaBullets}\n\n詳細や写真は下のカードをタップしてご確認ください！`;
        quickReplies = ["ヴィラを比較する", "他のエリアを探す", "予約手順"];
      } else if (detectedLang === "ko") {
        reply = `조건에 맞는 발리 프라이빗 빌라 ${topVillas.length}곳을 찾았습니다:\n\n${villaBullets}\n\n아래 카드를 클릭하여 사진과 상세 시설을 확인해보세요!`;
        quickReplies = ["빌라 비교하기", "다른 지역 찾기", "예약 방법"];
      } else {
        reply = `I found ${topVillas.length} private villas in Bali that match your criteria:\n\n${villaBullets}\n\nClick on any card below to explore photos & amenities!`;
        quickReplies = ["Compare these villas", "Explore other areas", "How to book"];
      }
    } else if (isGreeting) {
      if (detectedLang === "id") {
        reply = `Halo! Selamat datang di StayVilla AI Concierge. Ada yang bisa saya bantu terkait rekomendasi villa, ketersediaan, atau cara booking di Bali?`;
        quickReplies = ["Rekomendasi Villa Mewah", "Villa Termurah", "Cara booking"];
      } else if (detectedLang === "zh") {
        reply = `您好！欢迎使用 StayVilla 智能管家服务。请问有什么可以为您效劳？无论是巴厘岛别墅推荐、价格咨询还是预订指南，我都能随时协助您！`;
        quickReplies = ["推荐海景奢华别墅", "高性价比别墅", "预订流程"];
      } else if (detectedLang === "ja") {
        reply = `こんにちは！StayVilla AIコンシェルジュへようこそ。バリ島のヴィラ探し、料金、予約方法など、何でもお気軽にご相談ください！`;
        quickReplies = ["高級リゾートヴィラ", "お得なヴィラ", "予約方法"];
      } else if (detectedLang === "ko") {
        reply = `안녕하세요! StayVilla AI 컨시어지입니다. 발리 풀빌라 추천, 요금 문의, 예약 방법 등 무엇이든 편하게 물어보세요!`;
        quickReplies = ["럭셔리 풀빌라 추천", "가성비 빌라 찾기", "예약 방법"];
      } else {
        reply = `Hello! Welcome to StayVilla AI Concierge. How can I assist you with villa recommendations, prices, or booking in Bali today?`;
        quickReplies = ["Luxury Villas", "Cheapest Villa", "How to book"];
      }
    } else {
      if (detectedLang === "id") {
        reply = `Saya dapat membantu Anda menemukan villa terbaik di Bali berdasarkan **lokasi (Ubud, Canggu, Seminyak, Uluwatu)**, **budget**, atau **jumlah tamu**.\n\nContoh: *"Cari villa keluarga 3 kamar di Seminyak budget 3 juta"*`;
        quickReplies = ["Villa di Ubud", "Villa budget 2 juta", "Villa keluarga di Canggu"];
      } else if (detectedLang === "zh") {
        reply = `我可以根据您的**目的地（乌布、水明漾、苍古、乌鲁瓦图）**、**预算**或**入住人数**为您匹配最佳别墅。\n\n例如：*"在水明漾找3间卧室的家庭别墅，预算300万印尼盾"*`;
        quickReplies = ["乌布别墅", "预算200万印尼盾别墅", "苍古家庭别墅"];
      } else if (detectedLang === "ja") {
        reply = `ご希望の**エリア（ウブド、スミニャック、チャングー、ウルワツ）**、**ご予算**、**宿泊人数**に合わせて最適なヴィラをご案内します。\n\n例：*"スミニャックで3ベッドルームの家族向けヴィラ"*`;
        quickReplies = ["ウブドのヴィラ", "1泊200万ルピアのヴィラ", "チャングーの家族向け"];
      } else if (detectedLang === "ko") {
        reply = `**지역(우붓, 스미냑, 짱구, 울루와투)**, **예산**, **인원수**에 맞는 최적의 풀빌라를 추천해 드립니다.\n\n예: *"스미냑 3베드룸 가족 빌라 찾아줘"*`;
        quickReplies = ["우붓 빌라", "200만 루피아 예산 빌라", "짱구 가족 풀빌라"];
      } else {
        reply = `I can help you discover the perfect Bali villa based on **location (Ubud, Canggu, Seminyak, Uluwatu)**, **budget**, or **guest count**.\n\nExample: *"Find 3-bedroom family villa in Seminyak under $200"*`;
        quickReplies = ["Villas in Ubud", "Villas under $150", "Family villa in Canggu"];
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
        reply:
          "Mohon maaf, sistem AI sedang memproses permintaan. Silakan tanyakan kembali seputar villa atau hubungi WhatsApp Admin StayVilla.",
        recommendedVillaIds: ["villa-teratai", "villa-cendana"],
        quickReplies: ["Lihat Villa di Bali", "Cara Booking", "Hubungi Admin"],
      },
      { status: 200 }
    );
  }
}
