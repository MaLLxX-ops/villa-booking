import { NextRequest, NextResponse } from "next/server";
import { villaDataRaw, formatHarga, ADMIN_WHATSAPP_NUMBER } from "@/lib/data";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Simple language detector for incoming user text
function detectLanguage(text: string, fallbackLocale = "id"): string {
  const lower = text.toLowerCase();

  // Korean
  if (/[\uac00-\ud7af\u1100-\u11ff]/.test(text)) return "ko";
  // Japanese (Hiragana/Katakana/Kanji with specific particles)
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return "ja";
  // Chinese (Simplified / Traditional)
  if (/[\u4e00-\u9fa5]/.test(text)) return "zh";
  // French
  if (
    /\b(bonjour|merci|combien|chambre|piscine|réservation|comment|prix|s'il vous plaît|bonsoir)\b/i.test(
      lower
    )
  )
    return "fr";
  // English
  if (
    /\b(hello|hi|how much|book|booking|villa|price|cost|bedroom|pool|cancel|payment|stay|night|owner|whatsapp|recommend)\b/i.test(
      lower
    )
  )
    return "en";
  // Indonesian
  if (
    /\b(halo|hai|berapa|harga|kamar|kolam|renang|pesan|bayar|pemilik|batal|fasilitas|lokasi|malam|rekomendasi|gimana|cara)\b/i.test(
      lower
    )
  )
    return "id";

  return fallbackLocale;
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

    // 1. Match villas by query (locations, features, categories, capacity)
    const matchingVillas: typeof villaDataRaw = [];
    const keywords = query.split(/\s+/);

    villaDataRaw.forEach((villa) => {
      let score = 0;
      const vName = villa.nama.toLowerCase();
      const vLoc = (villa.lokasi[detectedLang as keyof typeof villa.lokasi] || villa.lokasi.id).toLowerCase();
      const vDesc = (villa.deskripsi[detectedLang as keyof typeof villa.deskripsi] || villa.deskripsi.id).toLowerCase();
      const vCat = villa.kategori_key;

      if (query.includes("ubud") && vLoc.includes("ubud")) score += 5;
      if (query.includes("seminyak") && vLoc.includes("seminyak")) score += 5;
      if (query.includes("canggu") && vLoc.includes("canggu")) score += 5;
      if (query.includes("uluwatu") && vLoc.includes("uluwatu")) score += 5;
      if (query.includes("nusa dua") && vLoc.includes("nusa dua")) score += 5;
      if (query.includes("sanur") && vLoc.includes("sanur")) score += 5;
      if (query.includes("jimbaran") && vLoc.includes("jimbaran")) score += 5;
      if (query.includes("tabanan") && vLoc.includes("tabanan")) score += 5;

      if ((query.includes("mewah") || query.includes("luxury")) && vCat === "luxury") score += 3;
      if ((query.includes("keluarga") || query.includes("family")) && vCat === "family") score += 3;
      if ((query.includes("studio") || query.includes("murah") || query.includes("couple") || query.includes("hemat") || query.includes("cheap")) && (vCat === "studio" || villa.harga_per_malam <= 2500000)) score += 3;

      if (query.includes("kolam") || query.includes("pool") || query.includes("infinity")) score += 1;
      if (query.includes("kamar") || query.includes("bedroom")) score += 1;

      if (score > 0 || keywords.some((k) => k.length > 2 && (vName.includes(k) || vLoc.includes(k) || vDesc.includes(k)))) {
        matchingVillas.push(villa);
      }
    });

    const recommendedVillas = (matchingVillas.length > 0 ? matchingVillas : villaDataRaw.slice(0, 3)).slice(0, 3);

    // 2. Generate Intelligent Localized Responses
    let reply = "";
    let quickReplies: string[] = [];

    // Check intents
    const isBookingFlow = /cara (booking|pesan)|how to book|comment réserver|如何预订|予約方法|예약 방법/i.test(query);
    const isPayment = /bayar|payment|paiement|支付|付款|支払い|결제|transfer|rekening/i.test(query);
    const isCancel = /batal|cancel|annul|退订|取消|キャンセル|환불/i.test(query);
    const isOwner = /daftar villa|list villa|host|pemilik|daftar properti|房东|掲載/i.test(query);
    const isPrice = /harga|price|tarif|tarif|价格|料金|가격/i.test(query);

    if (detectedLang === "id") {
      if (isBookingFlow) {
        reply = `**Alur Pemesanan di StayVilla sangat mudah & transparan:**\n\n1. 🏡 **Pilih Villa**: Jelajahi katalog dan pilih villa favorit Anda.\n2. 📅 **Tentukan Tanggal**: Masukkan tanggal check-in, check-out, dan jumlah tamu.\n3. 💬 **Klik 'Booking via WhatsApp'**: Sistem langsung menyusun pesan detail dan membuka WhatsApp pemilik villa.\n4. 🤝 **Konfirmasi & Bayar**: Negosiasi ketersediaan & pembayaran dilakukan langsung dengan pemilik resmi (tanpa biaya perantara platform).`;
        quickReplies = ["Lihat Villa di Ubud", "Villa untuk Keluarga", "Apakah pembayaran aman?"];
      } else if (isPayment) {
        reply = `**Tentang Sistem Pembayaran:**\n\n- 🚫 **Tidak Ada Pembayaran di Website**: StayVilla adalah direktori penghubung kurasi dan tidak memotong biaya transaksi di website.\n- 💳 **Langsung ke Rekening Pemilik**: Pembayaran DP & pelunasan ditransfer langsung ke rekening resmi pemilik villa sesuai kesepakatan di WhatsApp.\n- 🇮🇩 **Mata Uang Resmi**: Seluruh tagihan resmi dalam **Rupiah (IDR)**. Konversi mata uang asing di web hanya estimasi acuan.`;
        quickReplies = ["Bagaimana cara booking?", "Rekomendasi Villa Mewah", "Kebijakan pembatalan"];
      } else if (isCancel) {
        reply = `**Kebijakan Pembatalan & Refund:**\n\nKebijakan pembatalan dan pengembalian dana ditentukan oleh masing-masing pemilik villa. Kami menyarankan Anda menyepakati syarat pembatalan secara tertulis via WhatsApp sebelum mentransfer uang muka (DP).`;
        quickReplies = ["Bagaimana cara booking?", "Lihat Koleksi Villa", "Chat Admin"];
      } else if (isOwner) {
        reply = `**Ingin Mendaftarkan Villa Anda di Bali?**\n\nAnda dapat mendaftarkan properti Anda melalui halaman **/untuk-pemilik** dengan mengisi formulir registrasi dalam 3 menit. Nikmati komisi lebih hemat dan booking langsung yang masuk ke WhatsApp Anda!`;
        quickReplies = ["Buka Halaman Untuk Pemilik", "Lihat Contoh Villa", "Hubungi Admin"];
      } else if (matchingVillas.length > 0) {
        const villaNames = recommendedVillas.map((v) => `• **${v.nama}** (${v.lokasi.id}) — ${formatHarga(v.harga_per_malam)}/malam (${v.jumlah_kamar} kamar, maks ${v.kapasitas_tamu} tamu)`).join("\n");
        reply = `Saya menemukan beberapa villa terbaik di Bali yang sesuai dengan pencarian Anda:\n\n${villaNames}\n\nSilakan klik card villa di bawah untuk melihat foto lengkap, fasilitas, peta lokasi, dan langsung menghubungi pemiliknya via WhatsApp!`;
        quickReplies = ["Bandingkan villa ini", "Cari wilayah lain", "Bagaimana cara booking?"];
      } else {
        reply = `Halo! Saya adalah **StayVilla AI Concierge**. Saya siap membantu Anda menemukan villa impian di Bali, mengecek fasilitas, estimasi harga, rute lokasi, dan menghubungkan Anda langsung dengan pemilik villa via WhatsApp.\n\nAda yang bisa saya bantu untuk liburan Anda?`;
        quickReplies = ["Villa mewah di Ubud", "Villa keluarga di Canggu", "Studio romantis di Seminyak", "Cara booking villa"];
      }
    } else if (detectedLang === "en") {
      if (isBookingFlow) {
        reply = `**How to Book a Villa on StayVilla:**\n\n1. 🏡 **Choose a Villa**: Browse our handpicked collection in Bali.\n2. 📅 **Select Dates & Guests**: Pick your check-in, check-out, and guest count.\n3. 💬 **Click 'Book via WhatsApp'**: A formatted inquiry opens directly in WhatsApp with the verified owner.\n4. 🤝 **Confirm & Pay Direct**: All confirmations and payments happen directly with the owner without platform markup fees.`;
        quickReplies = ["Villas in Ubud", "Family Villas in Canggu", "Is payment safe?"];
      } else if (isPayment) {
        reply = `**Payment Information:**\n\n- 🚫 **No On-Site Platform Charges**: StayVilla connects you directly to villa hosts.\n- 💳 **Direct Host Transfer**: Deposits and balances are paid directly to the owner's official bank account agreed on WhatsApp.\n- 🇮🇩 **Official Currency**: All official billing is in **Indonesian Rupiah (IDR)**. Foreign currency displays on the website are real-time estimates for your budget convenience.`;
        quickReplies = ["How does booking work?", "Luxury Villas in Bali", "Cancellation policy"];
      } else if (isCancel) {
        reply = `**Cancellation & Refund Policy:**\n\nCancellation and refund rules are set individually by each villa owner. We recommend confirming cancellation terms in writing via WhatsApp with the host before making deposit payments.`;
        quickReplies = ["How to book?", "Browse All Villas", "Contact Support"];
      } else if (isOwner) {
        reply = `**List Your Villa on StayVilla:**\n\nIf you own or manage a villa in Bali, submit your property at **/untuk-pemilik**. Enjoy lower commissions and receive direct inquiries straight to your WhatsApp!`;
        quickReplies = ["Go to Host Registration", "View Villa Catalog", "Contact Admin"];
      } else if (matchingVillas.length > 0) {
        const villaNames = recommendedVillas.map((v) => `• **${v.nama}** (${v.lokasi.en}) — ${formatHarga(v.harga_per_malam)}/night (${v.jumlah_kamar} BR, up to ${v.kapasitas_tamu} guests)`).join("\n");
        reply = `Here are top recommended private villas in Bali matching your preferences:\n\n${villaNames}\n\nClick any villa card below to view details, photos, interactive map, and contact the host directly on WhatsApp!`;
        quickReplies = ["Compare these villas", "Search another area", "How to book?"];
      } else {
        reply = `Hello! I am your **StayVilla AI Concierge**. I can help you discover luxury private pool villas in Bali, check prices & amenities, view locations, and connect directly with verified villa hosts via WhatsApp.\n\nWhat kind of holiday stay are you looking for?`;
        quickReplies = ["Luxury Pool Villa in Ubud", "Family Villa in Canggu", "Beachfront in Seminyak", "How to book?"];
      }
    } else if (detectedLang === "fr") {
      reply = `Bonjour ! Je suis votre **Concierge IA StayVilla**. Je vous aide à trouver les plus belles villas privées à Bali, à vérifier les disponibilités et à contacter directement les propriétaires sur WhatsApp sans frais d'intermédiaire.\n\nRecherchez-vous une villa avec piscine à débordement à Ubud, à Seminyak ou à Canggu ?`;
      quickReplies = ["Villas à Ubud", "Villas à Canggu", "Comment réserver ?", "Villas de Luxe"];
    } else if (detectedLang === "zh") {
      reply = `您好！我是 **StayVilla 智能管家 AI**。我可以帮您挑选巴厘岛优质独栋泳池别墅、查询价格与设施、并在 WhatsApp 上直接与房东直连沟通，免去中介佣金！\n\n请问您希望寻找哪个区域（乌布、水明漾、苍古、乌鲁瓦图等）以及多少人入住呢？`;
      quickReplies = ["乌布无边泳池别墅", "苍古亲子家庭别墅", "如何通过WhatsApp预订", "查看全部精选"];
    } else if (detectedLang === "ja") {
      reply = `こんにちは！**StayVilla AI コンシェルジュ**です。バリ島の厳選プライベートプールヴィラのご案内、料金や施設のご案内、オーナー様とのWhatsApp直接予約をサポートいたします。\n\nウブド、スミニャック、チャングーなど、ご希望のエリアや滞在スタイルをお聞かせください！`;
      quickReplies = ["ウブドの高級ヴィラ", "ファミリー向けヴィラ", "予約方法について", "全ヴィラ一覧を見る"];
    } else if (detectedLang === "ko") {
      reply = `안녕하세요! **StayVilla AI 컨시어지**입니다. 발리 최고급 프라이빗 풀빌라 추천, 1박 요금 및 편의시설 안내, 호스트와의 WhatsApp 직거래 예약을 친절히 도와드립니다.\n\n우붓, 스미냑, 짱구 등 선호하시는 지역이나 인원을 알려주시면 딱 맞는 빌라를 찾아드릴게요!`;
      quickReplies = ["우붓 인피니티풀 빌라", "짱구 패밀리 풀빌라", "예약 진행 방법", "전체 풀빌라 목록"];
    }

    return NextResponse.json({
      reply,
      recommendedVillaIds: recommendedVillas.map((v) => v.id),
      quickReplies,
      detectedLang,
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
