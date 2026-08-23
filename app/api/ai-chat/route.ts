import { NextRequest, NextResponse } from "next/server";
import { villaDataRaw, formatHarga, ADMIN_WHATSAPP_NUMBER } from "@/lib/data";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
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

export async function POST(req: NextRequest) {
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

    // Intent detectors
    const isBookingFlow = /cara (booking|pesan)|how to book|comment réserver|如何预订|予約方法|예약 방법/i.test(query);
    const isPayment = /bayar|payment|paiement|支付|付款|支払い|결제|transfer|rekening/i.test(query);
    const isCancel = /batal|cancel|annul|退订|取消|キャンセル|환불/i.test(query);
    const isOwner = /daftar villa|list villa|host|pemilik|daftar properti|房东|掲載/i.test(query);
    const isContactAdmin = /admin|cs|customer service|kontak|hubungi|contact/i.test(query);

    // 5. Strict Villa Matching Engine
    let candidateVillas = [...villaDataRaw];

    // Location filter
    if (parsedLocation) {
      candidateVillas = candidateVillas.filter((v) =>
        v.lokasi.id.toLowerCase().includes(parsedLocation)
      );
    }

    // Capacity filter: villa must accommodate at least parsedGuests
    if (parsedGuests) {
      candidateVillas = candidateVillas.filter(
        (v) => v.kapasitas_tamu >= parsedGuests
      );
    }

    // Budget filter: villa price must be <= parsedBudget
    if (parsedBudget) {
      candidateVillas = candidateVillas.filter(
        (v) => v.harga_per_malam <= parsedBudget
      );
    }

    // Sort matching villas by relevance / price ascending
    candidateVillas.sort((a, b) => a.harga_per_malam - b.harga_per_malam);

    // Find the cheapest overall villa in our entire catalog for graceful fallback
    const allSortedByPrice = [...villaDataRaw].sort(
      (a, b) => a.harga_per_malam - b.harga_per_malam
    );
    const cheapestVilla = allSortedByPrice[0]; // Studio Anggrek Rp 1.200.000

    let reply = "";
    let recommendedVillaIds: string[] = [];
    let quickReplies: string[] = [];

    // --- CASE A: Informational Intent (Booking Flow, Payment, Cancel, Owner, Contact) ---
    if (isBookingFlow) {
      if (detectedLang === "id") {
        reply = `**Alur Pemesanan di StayVilla sangat mudah & transparan:**\n\n1. 🏡 **Pilih Villa**: Jelajahi katalog dan pilih villa favorit Anda.\n2. 📅 **Tentukan Tanggal**: Masukkan tanggal check-in, check-out, dan jumlah tamu.\n3. 💬 **Klik 'Booking via WhatsApp'**: Sistem otomatis menyusun rincian pesanan dan membuka chat WhatsApp dengan pemilik resmi villa.\n4. 🤝 **Konfirmasi & Bayar**: Negosiasi ketersediaan & pembayaran diatur langsung antara tamu dan pemilik villa (tanpa biaya markup platform).`;
        quickReplies = ["Lihat Villa di Ubud", "Villa untuk Keluarga", "Apakah pembayaran aman?"];
      } else if (detectedLang === "fr") {
        reply = `**Comment réserver une villa sur StayVilla :**\n\n1. 🏡 **Choisissez une villa** parmi notre sélection à Bali.\n2. 📅 **Sélectionnez vos dates** d'arrivée, de départ et le nombre d'invités.\n3. 💬 **Cliquez sur 'Réserver via WhatsApp'** pour contacter directement le propriétaire vérifié.\n4. 🤝 **Confirmation & Paiement direct** sans frais d'intermédiaire.`;
        quickReplies = ["Villas à Ubud", "Villas familiales", "Le paiement est-il sécurisé ?"];
      } else if (detectedLang === "zh") {
        reply = `**StayVilla 预订流程极其简单透明：**\n\n1. 🏡 **挑选心仪别墅**：浏览巴厘岛精选独栋泳池别墅。\n2. 📅 **选择入住日期**：填写入住、退房日期及入住人数。\n3. 💬 **点击“通过 WhatsApp 预订”**：系统将自动生成预订详情并直连房东。\n4. 🤝 **直接确认与支付**：与房东直接协商并完成付款，免收平台中介加价。`;
        quickReplies = ["乌布泳池别墅", "家庭亲子别墅", "关于支付安全"];
      } else if (detectedLang === "ja") {
        reply = `**StayVilla の予約手順：**\n\n1. 🏡 **ヴィラを選択**：バリ島の厳選プライベートヴィラをお選びください。\n2. 📅 **日程と人数を指定**：チェックイン・アウト日と宿泊人数を入力。\n3. 💬 **「WhatsAppで予約」をクリック**：オーナー様へ直接詳細メッセージが送信されます。\n4. 🤝 **直接確認・決済**：仲介手数料なしでオーナー様と直接やり取りしていただけます。`;
        quickReplies = ["ウブドのヴィラ", "ファミリー向けヴィラ", "支払いは安全ですか？"];
      } else if (detectedLang === "ko") {
        reply = `**StayVilla 예약 진행 방법:**\n\n1. 🏡 **빌라 선택**: 발리 최고급 프라이빗 풀빌라 목록을 둘러보세요.\n2. 📅 **일정 및 인원 선택**: 체크인, 체크아웃 날짜와 투숙 인원을 입력합니다.\n3. 💬 **'WhatsApp으로 예약하기' 클릭**: 예약 내역이 자동으로 정리되어 호스트와의 채팅창이 열립니다.\n4. 🤝 **직접 확인 및 결제**: 중개 수수료 없이 호스트와 안전하게 직거래로 진행됩니다.`;
        quickReplies = ["우붓 풀빌라 보기", "패밀리 풀빌라", "결제는 안전한가요?"];
      } else {
        reply = `**How to Book on StayVilla:**\n\n1. 🏡 **Choose Your Villa**: Browse our curated private villas in Bali.\n2. 📅 **Select Dates & Guests**: Set your check-in, check-out, and guest count.\n3. 💬 **Click 'Book via WhatsApp'**: A pre-formatted inquiry opens directly in WhatsApp with the verified host.\n4. 🤝 **Confirm & Pay Direct**: All confirmations and payments happen directly with the owner without platform markup.`;
        quickReplies = ["Villas in Ubud", "Family Villas in Canggu", "Is payment safe?"];
      }
    } else if (isPayment) {
      if (detectedLang === "id") {
        reply = `**Informasi Pembayaran:**\n\n• 🚫 **Tidak Ada Pembayaran di Website**: StayVilla adalah marketplace penghubung dan tidak memotong pembayaran di website.\n• 💳 **Transfer Langsung ke Pemilik**: Uang muka (DP) dan pelunasan ditransfer langsung ke rekening bank resmi pemilik villa via WhatsApp.\n• 🇮🇩 **Mata Uang Resmi**: Seluruh transaksi resmi ditagih dalam **Rupiah (IDR)**. Konversi mata uang asing di website hanya bersifat estimasi acuan.`;
        quickReplies = ["Bagaimana cara booking?", "Rekomendasi Villa Mewah", "Kebijakan pembatalan"];
      } else {
        reply = `**Payment Details:**\n\n• 🚫 **No On-Site Platform Charges**: StayVilla connects you directly with verified hosts.\n• 💳 **Direct Host Bank Transfer**: Deposits and balances are paid directly to the owner's official account agreed on WhatsApp.\n• 🇮🇩 **Official Currency**: Official billing is in **Indonesian Rupiah (IDR)**. Foreign currency displays are real-time estimates for your reference.`;
        quickReplies = ["How to book?", "Luxury Villas in Bali", "Cancellation Policy"];
      }
    } else if (isCancel) {
      if (detectedLang === "id") {
        reply = `**Kebijakan Pembatalan & Refund:**\n\nKebijakan pembatalan dan pengembalian uang muka ditentukan oleh masing-masing pemilik villa. Kami menyarankan Anda menyepakati syarat pembatalan secara tertulis via WhatsApp sebelum mentransfer pembayaran.`;
        quickReplies = ["Bagaimana cara booking?", "Lihat Koleksi Villa", "Chat Admin"];
      } else {
        reply = `**Cancellation Policy:**\n\nCancellation and refund terms are set individually by each villa owner. We recommend confirming cancellation terms in writing via WhatsApp before sending deposit payments.`;
        quickReplies = ["How to book?", "Browse All Villas", "Contact Admin"];
      }
    } else if (isOwner) {
      if (detectedLang === "id") {
        reply = `**Pendaftaran Pemilik Villa:**\n\nAnda dapat mendaftarkan properti villa Anda di Bali melalui menu **/untuk-pemilik**. Dapatkan tamu domestik dan internasional langsung ke WhatsApp Anda dengan komisi lebih hemat!`;
        quickReplies = ["Buka Halaman Untuk Pemilik", "Lihat Koleksi Villa", "Chat Admin"];
      } else {
        reply = `**List Your Villa on StayVilla:**\n\nYou can register your villa property in Bali at **/untuk-pemilik**. Receive direct booking inquiries straight to your WhatsApp with lower commissions!`;
        quickReplies = ["Host Registration", "View All Villas", "Contact Support"];
      }
    }
    // --- CASE B: Budget Given, but No Villa Found (Strict Budget Fallback) ---
    else if (parsedBudget && candidateVillas.length === 0) {
      const formattedBudget = formatHarga(parsedBudget);
      const cheapestPrice = formatHarga(cheapestVilla.harga_per_malam);
      const locText = cheapestVilla.lokasi[detectedLang as keyof typeof cheapestVilla.lokasi] || cheapestVilla.lokasi.id;

      if (detectedLang === "id") {
        reply = `Maaf, saat ini belum ada villa dengan harga di bawah **${formattedBudget}**. Villa kami yang paling terjangkau mulai dari **${cheapestPrice}** per malam, yaitu **${cheapestVilla.nama}** di ${locText}.\n\nBerikut rekomendasi villa dengan tarif paling bersahabat di Bali:`;
        quickReplies = ["Lihat Studio Anggrek", "Cari villa di Sanur", "Bagaimana cara booking?"];
      } else if (detectedLang === "fr") {
        reply = `Désolé, nous n'avons pas encore de villa privée en dessous de **${formattedBudget}**. Notre villa la plus abordable commence à partir de **${cheapestPrice}** par nuit (**${cheapestVilla.nama}** à ${locText}).\n\nVoici nos villas les plus abordables à Bali :`;
        quickReplies = ["Voir Studio Anggrek", "Comment réserver ?", "Villas à Sanur"];
      } else if (detectedLang === "zh") {
        reply = `抱歉，目前暂无预算低于 **${formattedBudget}** 的独栋别墅。我们最实惠的精选别墅从每晚 **${cheapestPrice}** 起（${locText}的 **${cheapestVilla.nama}**）。\n\n为您推荐以下高性价比精选别墅：`;
        quickReplies = ["查看 Studio Anggrek", "如何预订", "萨努尔区域别墅"];
      } else if (detectedLang === "ja") {
        reply = `申し訳ありません、現在ご予算 **${formattedBudget}** 以下のヴィラは掲載がございません。最もお手頃なヴィラは1泊 **${cheapestPrice}** からの「**${cheapestVilla.nama}**（${locText}）」となります。\n\nおすすめのリーズナブルなヴィラをご案内いたします：`;
        quickReplies = ["Studio Anggrekを見る", "予約方法について", "サヌールのヴィラ"];
      } else if (detectedLang === "ko") {
        reply = `죄송합니다. 현재 **${formattedBudget}** 미만의 풀빌라는 등록되어 있지 않습니다. 가장 실속 있는 풀빌라는 1박 **${cheapestPrice}**부터 시작하는 ${locText}의 '**${cheapestVilla.nama}**'입니다.\n\n가장 합리적인 가격의 추천 빌라를 안내해 드립니다:`;
        quickReplies = ["Studio Anggrek 보기", "예약 진행 방법", "사누르 풀빌라"];
      } else {
        reply = `Sorry, we currently do not have private villas under **${formattedBudget}**. Our most affordable villa starts from **${cheapestPrice}**/night (**${cheapestVilla.nama}** in ${locText}).\n\nHere are our best value private villas in Bali:`;
        quickReplies = ["View Studio Anggrek", "How to book?", "Villas in Sanur"];
      }

      // Recommend the 2 cheapest villas as helpful suggestions
      recommendedVillaIds = allSortedByPrice.slice(0, 2).map((v) => v.id);
    }
    // --- CASE C: Matching Villas Found (Strict Filters Met) ---
    else if (candidateVillas.length > 0) {
      const topVillas = candidateVillas.slice(0, 3);
      recommendedVillaIds = topVillas.map((v) => v.id);

      const villaBullets = topVillas
        .map((v) => {
          const loc = v.lokasi[detectedLang as keyof typeof v.lokasi] || v.lokasi.id;
          return `• **${v.nama}** (${loc}) — ${formatHarga(v.harga_per_malam)}/malam (${v.jumlah_kamar} kamar, maks ${v.kapasitas_tamu} tamu)`;
        })
        .join("\n");

      if (detectedLang === "id") {
        let filterSummary = "";
        if (parsedLocation && parsedBudget) {
          filterSummary = ` di **${parsedLocation.toUpperCase()}** dengan budget di bawah **${formatHarga(parsedBudget)}**`;
        } else if (parsedLocation) {
          filterSummary = ` di kawasan **${parsedLocation.toUpperCase()}**`;
        } else if (parsedBudget) {
          filterSummary = ` dengan budget di bawah **${formatHarga(parsedBudget)}**`;
        } else if (parsedGuests) {
          filterSummary = ` untuk kapasitas **${parsedGuests} tamu**`;
        }

        reply = `Saya menemukan ${topVillas.length} villa terbaik di Bali${filterSummary} yang sesuai dengan kriteria Anda:\n\n${villaBullets}\n\nSilakan klik kartu villa di bawah untuk melihat galeri foto lengkap, fasilitas, peta lokasi, dan langsung terhubung dengan pemilik via WhatsApp!`;
        quickReplies = ["Bandingkan villa ini", "Cari wilayah lain", "Bagaimana cara booking?"];
      } else if (detectedLang === "fr") {
        reply = `Voici les meilleures villas privées correspondant à vos critères à Bali :\n\n${villaBullets}\n\nCliquez sur une carte ci-dessous pour voir les détails et réserver directement sur WhatsApp !`;
        quickReplies = ["Comparer ces villas", "Comment réserver ?", "Villas à Ubud"];
      } else if (detectedLang === "zh") {
        reply = `为您找到以下符合条件的巴厘岛精选别墅：\n\n${villaBullets}\n\n点击下方卡片即可查看完整照片、设施、地图，并直接在 WhatsApp 上联系房东预订！`;
        quickReplies = ["对比这些别墅", "如何通过WhatsApp预订", "查看其他区域"];
      } else if (detectedLang === "ja") {
        reply = `ご希望の条件に合うバリ島のおすすめヴィラが見つかりました：\n\n${villaBullets}\n\n下のカードをクリックすると詳細写真や地図を確認し、WhatsAppでオーナー様に直接問い合わせできます！`;
        quickReplies = ["ヴィラを比較する", "予約方法について", "他のエリアを探す"];
      } else if (detectedLang === "ko") {
        reply = `고객님의 조건에 딱 맞는 발리 추천 풀빌라 목록입니다:\n\n${villaBullets}\n\n아래 빌라 카드를 클릭하시면 사진, 편의시설, 지도 확인 및 호스트와의 WhatsApp 직거래 예약이 가능합니다!`;
        quickReplies = ["빌라 비교하기", "예약 방법 문의", "다른 지역 찾기"];
      } else {
        reply = `Here are the top private villas in Bali matching your criteria:\n\n${villaBullets}\n\nClick any card below to explore photos, amenities, location map, and chat directly with the verified host on WhatsApp!`;
        quickReplies = ["Compare these villas", "How to book?", "Explore other areas"];
      }
    }
    // --- CASE D: General Inquiry Greeting ---
    else {
      if (detectedLang === "id") {
        reply = `Halo! Saya adalah **StayVilla AI Concierge**. Saya siap membantu Anda menemukan villa impian di Bali, mengecek fasilitas, estimasi harga, rute lokasi, dan menghubungkan Anda langsung dengan pemilik villa via WhatsApp.\n\nAda yang bisa saya bantu untuk liburan Anda?`;
        quickReplies = ["Villa mewah di Ubud", "Villa keluarga di Canggu", "Studio romantis di Seminyak", "Cara booking villa"];
      } else if (detectedLang === "fr") {
        reply = `Bonjour ! Je suis votre **Concierge IA StayVilla**. Je vous aide à trouver les plus belles villas privées à Bali, à vérifier les disponibilités et à contacter directement les propriétaires sur WhatsApp sans frais d'intermédiaire.\n\nQuel type de séjour recherchez-vous ?`;
        quickReplies = ["Villas à Ubud", "Villas à Canggu", "Comment réserver ?", "Villas de Luxe"];
      } else if (detectedLang === "zh") {
        reply = `您好！我是 **StayVilla 智能管家 AI**。我可以帮您挑选巴厘岛优质独栋泳池别墅、查询价格与设施、并在 WhatsApp 上直接与房东直连沟通，免去中介佣金！\n\n请问您希望寻找哪个区域以及多少人入住呢？`;
        quickReplies = ["乌布无边泳池别墅", "苍古亲子家庭别墅", "如何通过WhatsApp预订", "查看全部精选"];
      } else if (detectedLang === "ja") {
        reply = `こんにちは！**StayVilla AI コンシェルジュ**です。バリ島の厳選プライベートプールヴィラのご案内、料金や施設のご案内、オーナー様とのWhatsApp直接予約をサポートいたします。\n\nウブド、スミニャック、チャングーなど、ご希望のエリアをお聞かせください！`;
        quickReplies = ["ウブドの高級ヴィラ", "ファミリー向けヴィラ", "予約方法について", "全ヴィラ一覧を見る"];
      } else if (detectedLang === "ko") {
        reply = `안녕하세요! **StayVilla AI 컨시어지**입니다. 발리 최고급 프라이빗 풀빌라 추천, 1박 요금 및 편의시설 안내, 호스트와의 WhatsApp 직거래 예약을 친절히 도와드립니다.\n\n우붓, 스미냑, 짱구 등 선호하시는 지역이나 인원을 알려주세요!`;
        quickReplies = ["우붓 인피니티풀 빌라", "짱구 패밀리 풀빌라", "예약 진행 방법", "전체 풀빌라 목록"];
      } else {
        reply = `Hello! I am your **StayVilla AI Concierge**. I can help you discover luxury private pool villas in Bali, check prices & amenities, view locations, and connect directly with verified villa hosts via WhatsApp.\n\nWhat kind of holiday stay are you looking for?`;
        quickReplies = ["Luxury Pool Villa in Ubud", "Family Villa in Canggu", "Beachfront in Seminyak", "How to book?"];
      }
      recommendedVillaIds = ["villa-teratai", "villa-cendana", "villa-melati"];
    }

    return NextResponse.json({
      reply,
      recommendedVillaIds,
      quickReplies,
      detectedLang,
      parsedParams: {
        budget: parsedBudget,
        guests: parsedGuests,
        location: parsedLocation,
      },
    });
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
