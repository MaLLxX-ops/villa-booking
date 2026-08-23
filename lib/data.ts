export interface Villa {
  id: string;
  nama: string;
  lokasi: string;
  harga_per_malam: number;
  jumlah_kamar: number;
  jumlah_kamar_mandi: number;
  kapasitas_tamu: number;
  deskripsi: string;
  fasilitas: string[];
  galeri_foto: string[];
  koordinat: { lat: number; lng: number };
  kategori: string;
}

export const villaData: Villa[] = [
  {
    id: "villa-teratai",
    nama: "Villa Teratai",
    lokasi: "Ubud, Bali",
    harga_per_malam: 3_500_000,
    jumlah_kamar: 4,
    jumlah_kamar_mandi: 3,
    kapasitas_tamu: 8,
    deskripsi:
      "Tersembunyi di antara pepohonan tropis Ubud, Villa Teratai menawarkan pengalaman menginap mewah yang menyatu dengan alam. Dikelilingi sawah bertingkat dan hutan hijau, villa ini memiliki infinity pool pribadi yang menghadap lembah, paviliun yoga terbuka, serta interior bergaya Bali modern dengan sentuhan kayu jati dan batu alam. Ideal untuk keluarga atau rombongan yang menginginkan ketenangan tanpa mengorbankan kenyamanan.",
    fasilitas: [
      "Kolam Renang Infinity",
      "WiFi Kecepatan Tinggi",
      "Dapur Lengkap",
      "AC",
      "Parkir Pribadi",
      "Taman Tropis",
      "Paviliun Yoga",
      "Layanan Concierge",
    ],
    galeri_foto: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.5069, lng: 115.2624 },
    kategori: "Villa Mewah",
  },
  {
    id: "villa-cendana",
    nama: "Villa Cendana",
    lokasi: "Seminyak, Bali",
    harga_per_malam: 5_200_000,
    jumlah_kamar: 5,
    jumlah_kamar_mandi: 5,
    kapasitas_tamu: 10,
    deskripsi:
      "Villa Cendana adalah definisi kemewahan tropis di jantung Seminyak. Hanya beberapa langkah dari pantai dan kehidupan malam terbaik Bali, villa ini menggabungkan arsitektur kontemporer dengan elemen tradisional Bali. Setiap kamar tidur memiliki kamar mandi en-suite, dan area living outdoor yang luas dilengkapi dengan bar kolam renang dan gazebo untuk bersantap di bawah bintang.",
    fasilitas: [
      "Kolam Renang Pribadi",
      "WiFi Kecepatan Tinggi",
      "Dapur Lengkap",
      "AC",
      "Bar Kolam Renang",
      "Gazebo",
      "Smart TV",
      "Layanan Butler",
      "Gym Pribadi",
    ],
    galeri_foto: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.6906, lng: 115.1685 },
    kategori: "Villa Mewah",
  },
  {
    id: "villa-melati",
    nama: "Villa Melati",
    lokasi: "Canggu, Bali",
    harga_per_malam: 2_800_000,
    jumlah_kamar: 3,
    jumlah_kamar_mandi: 2,
    kapasitas_tamu: 6,
    deskripsi:
      "Terletak di kawasan Canggu yang trendi, Villa Melati adalah perpaduan sempurna antara gaya hidup pantai dan kenyamanan rumah. Dengan desain bohemian-modern, rooftop lounge untuk menikmati sunset, dan akses mudah ke pantai serta kafe-kafe terbaik, villa ini sangat cocok untuk keluarga muda atau rombongan teman yang mencari pengalaman Bali yang autentik dan stylish.",
    fasilitas: [
      "Kolam Renang",
      "WiFi Kecepatan Tinggi",
      "Dapur Lengkap",
      "AC",
      "Rooftop Lounge",
      "Sepeda Gratis",
      "BBQ Area",
      "Smart TV",
    ],
    galeri_foto: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.6478, lng: 115.1385 },
    kategori: "Villa Keluarga",
  },
  {
    id: "studio-anggrek",
    nama: "Studio Anggrek",
    lokasi: "Sanur, Bali",
    harga_per_malam: 1_200_000,
    jumlah_kamar: 1,
    jumlah_kamar_mandi: 1,
    kapasitas_tamu: 2,
    deskripsi:
      "Studio Anggrek adalah retreat minimalis yang elegan di tepi pantai Sanur. Dirancang untuk pasangan atau pelancong solo, studio ini memadukan kesederhanaan Jepang dengan kehangatan tropis Bali. Dengan jendela kaca besar yang menghadap taman, tempat tidur platform dari kayu jati, dan akses langsung ke pantai, ini adalah tempat sempurna untuk menikmati ketenangan.",
    fasilitas: [
      "WiFi Kecepatan Tinggi",
      "AC",
      "Dapur Kecil (Kitchenette)",
      "Smart TV",
      "Akses Pantai",
      "Teras Pribadi",
    ],
    galeri_foto: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.6783, lng: 115.2636 },
    kategori: "Studio Minimalis",
  },
  {
    id: "villa-kamboja",
    nama: "Villa Kamboja",
    lokasi: "Jimbaran, Bali",
    harga_per_malam: 4_100_000,
    jumlah_kamar: 4,
    jumlah_kamar_mandi: 4,
    kapasitas_tamu: 8,
    deskripsi:
      "Bertengger di atas tebing Jimbaran dengan pemandangan Samudra Hindia yang memukau, Villa Kamboja menghadirkan kemewahan pantai dalam setiap detailnya. Desain arsitektur tropis-modern dengan batu kapur dan kayu ironwood, dilengkapi infinity pool yang seolah menyatu dengan laut. Nikmati sunset spektakuler dari sundeck pribadi sambil menikmati cocktail dari bar villa.",
    fasilitas: [
      "Infinity Pool",
      "WiFi Kecepatan Tinggi",
      "Dapur Lengkap",
      "AC",
      "Pemandangan Laut",
      "Sundeck",
      "Home Theater",
      "Layanan Chef Pribadi",
      "Jacuzzi",
    ],
    galeri_foto: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.7904, lng: 115.1619 },
    kategori: "Villa Mewah",
  },
  {
    id: "villa-flamboyan",
    nama: "Villa Flamboyan",
    lokasi: "Tabanan, Bali",
    harga_per_malam: 2_200_000,
    jumlah_kamar: 3,
    jumlah_kamar_mandi: 2,
    kapasitas_tamu: 6,
    deskripsi:
      "Di tengah hamparan sawah Tabanan yang hijau, Villa Flamboyan menawarkan pengalaman hidup pedesaan Bali yang otentik dengan sentuhan modern. Bangunan tradisional dengan atap alang-alang telah direnovasi dengan fasilitas kontemporer. Wake up dengan suara burung dan pemandangan Gunung Batukaru, lalu habiskan hari dengan bersepeda melintasi desa-desa sekitar.",
    fasilitas: [
      "Kolam Renang",
      "WiFi",
      "Dapur Lengkap",
      "Kipas Angin & AC",
      "Pemandangan Sawah",
      "Sepeda Gratis",
      "Ruang Meditasi",
      "Sarapan Lokal Inklusif",
    ],
    galeri_foto: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.5412, lng: 115.1021 },
    kategori: "Villa Keluarga",
  },
  {
    id: "studio-kenanga",
    nama: "Studio Kenanga",
    lokasi: "Uluwatu, Bali",
    harga_per_malam: 1_500_000,
    jumlah_kamar: 1,
    jumlah_kamar_mandi: 1,
    kapasitas_tamu: 2,
    deskripsi:
      "Perched on the dramatic cliffs of Uluwatu, Studio Kenanga adalah studio bergaya industrial-tropis yang dirancang untuk pasangan petualang. Dengan dinding beton ekspos yang dipadukan tanaman rambat hijau, lantai teraso, dan balkon menghadap lautan, studio ini memancarkan suasana cool dan edgy. Dekat dengan spot surfing terbaik dan Pura Uluwatu yang ikonis.",
    fasilitas: [
      "WiFi Kecepatan Tinggi",
      "AC",
      "Kitchenette",
      "Smart TV",
      "Balkon Laut",
      "Outdoor Shower",
      "Peralatan Snorkeling",
    ],
    galeri_foto: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.8291, lng: 115.0849 },
    kategori: "Studio Minimalis",
  },
  {
    id: "villa-dahlia",
    nama: "Villa Dahlia",
    lokasi: "Nusa Dua, Bali",
    harga_per_malam: 6_800_000,
    jumlah_kamar: 6,
    jumlah_kamar_mandi: 6,
    kapasitas_tamu: 14,
    deskripsi:
      "Villa Dahlia adalah crown jewel dari koleksi kami — sebuah estate mewah di kawasan eksklusif Nusa Dua. Dengan enam kamar tidur suite, masing-masing bertema budaya Nusantara yang berbeda, villa ini dirancang untuk acara keluarga besar atau retreat perusahaan. Fasilitas kelas dunia termasuk kolam renang 25 meter, spa lengkap, lapangan tenis, dan taman tropis seluas satu hektar.",
    fasilitas: [
      "Kolam Renang 25m",
      "WiFi Kecepatan Tinggi",
      "Dapur Professional",
      "AC Sentral",
      "Spa & Sauna",
      "Lapangan Tenis",
      "Gym",
      "Taman 1 Hektar",
      "Layanan Butler 24 Jam",
      "Helipad",
      "Ruang Meeting",
    ],
    galeri_foto: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.8028, lng: 115.2318 },
    kategori: "Villa Mewah",
  },
];

export function getVillaById(id: string): Villa | undefined {
  return villaData.find((villa) => villa.id === id);
}

export function formatHarga(harga: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(harga);
}

export function getKategoriList(): string[] {
  return [...new Set(villaData.map((v) => v.kategori))];
}

export function getLokasiList(): string[] {
  return [...new Set(villaData.map((v) => v.lokasi))];
}
