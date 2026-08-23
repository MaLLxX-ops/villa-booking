export type Locale = "id" | "en" | "fr" | "zh";

export const ADMIN_WHATSAPP_NUMBER = "6282163240141";

export interface LocalizedString {
  id: string;
  en: string;
  fr: string;
  zh: string;
}

export interface LocalizedArray {
  id: string[];
  en: string[];
  fr: string[];
  zh: string[];
}

export interface VillaRaw {
  id: string;
  nama: string;
  nomor_whatsapp_pemilik: string;
  lokasi: LocalizedString;
  harga_per_malam: number;
  jumlah_kamar: number;
  jumlah_kamar_mandi: number;
  kapasitas_tamu: number;
  deskripsi: LocalizedString;
  fasilitas: LocalizedArray;
  galeri_foto: string[];
  koordinat: { lat: number; lng: number };
  kategori: LocalizedString;
}

export interface Villa {
  id: string;
  nama: string;
  nomor_whatsapp_pemilik: string;
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
  kategori_key: "luxury" | "family" | "studio";
}

export const villaDataRaw: (VillaRaw & {
  kategori_key: "luxury" | "family" | "studio";
})[] = [
  {
    id: "villa-teratai",
    nama: "Villa Teratai",
    nomor_whatsapp_pemilik: "6281234567801",
    kategori_key: "luxury",
    lokasi: {
      id: "Ubud, Bali",
      en: "Ubud, Bali",
      fr: "Ubud, Bali",
      zh: "乌布, 巴厘岛",
    },
    harga_per_malam: 3_500_000,
    jumlah_kamar: 4,
    jumlah_kamar_mandi: 3,
    kapasitas_tamu: 8,
    deskripsi: {
      id: "Tersembunyi di antara pepohonan tropis Ubud, Villa Teratai menawarkan pengalaman menginap mewah yang menyatu dengan alam. Dikelilingi sawah bertingkat dan hutan hijau, villa ini memiliki infinity pool pribadi yang menghadap lembah, paviliun yoga terbuka, serta interior bergaya Bali modern dengan sentuhan kayu jati dan batu alam. Ideal untuk keluarga atau rombongan yang menginginkan ketenangan tanpa mengorbankan kenyamanan.",
      en: "Hidden amidst the lush tropical canopy of Ubud, Villa Teratai offers a luxury sanctuary harmoniously integrated with nature. Surrounded by terraced rice fields and verdant ravines, this estate features a private infinity pool overlooking the valley, an open-air yoga pavilion, and contemporary Balinese interiors crafted with rich teakwood and natural stone.",
      fr: "Nichée au cœur de la canopée tropicale d'Ubud, la Villa Teratai offre un sanctuaire luxueux en harmonie avec la nature. Entourée de rizières en terrasses et d'une forêt luxuriante, cette propriété dispose d'une piscine à débordement privée avec vue sur la vallée, d'un pavillon de yoga en plein air et d'intérieurs balinais contemporains.",
      zh: "隐匿于乌布郁郁葱葱的热带树冠之中，莲花别墅（Villa Teratai）为您提供与自然完美融合的奢华居所。别墅周围环绕着层层梯田与青翠山谷，拥有俯瞰壮丽山谷的私人无边泳池、露天瑜伽亭，以及采用名贵柚木与天然石材打造的当代巴厘岛风情内饰。",
    },
    fasilitas: {
      id: [
        "Kolam Renang Infinity",
        "WiFi Kecepatan Tinggi",
        "Dapur Lengkap",
        "AC",
        "Parkir Pribadi",
        "Taman Tropis",
        "Paviliun Yoga",
        "Layanan Concierge",
      ],
      en: [
        "Infinity Pool",
        "High-Speed WiFi",
        "Fully Equipped Kitchen",
        "Air Conditioning",
        "Private Parking",
        "Tropical Garden",
        "Yoga Pavilion",
        "Concierge Service",
      ],
      fr: [
        "Piscine à Débordement",
        "WiFi Haut Débit",
        "Cuisine Entièrement Équipée",
        "Climatisation",
        "Parking Privé",
        "Jardin Tropical",
        "Pavillon de Yoga",
        "Service de Conciergerie",
      ],
      zh: [
        "无边际泳池",
        "高速无线网络",
        "全套配备厨房",
        "空调设施",
        "专属私人停车位",
        "热带园林景观",
        "露天瑜伽亭",
        "礼宾管家服务",
      ],
    },
    galeri_foto: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.5069, lng: 115.2624 },
    kategori: {
      id: "Villa Mewah",
      en: "Luxury Villa",
      fr: "Villa de Luxe",
      zh: "奢华别墅",
    },
  },
  {
    id: "villa-cendana",
    nama: "Villa Cendana",
    nomor_whatsapp_pemilik: "6281234567802",
    kategori_key: "luxury",
    lokasi: {
      id: "Seminyak, Bali",
      en: "Seminyak, Bali",
      fr: "Seminyak, Bali",
      zh: "水明漾, 巴厘岛",
    },
    harga_per_malam: 5_200_000,
    jumlah_kamar: 5,
    jumlah_kamar_mandi: 5,
    kapasitas_tamu: 10,
    deskripsi: {
      id: "Villa Cendana adalah definisi kemewahan tropis di jantung Seminyak. Hanya beberapa langkah dari pantai dan kehidupan malam terbaik Bali, villa ini menggabungkan arsitektur kontemporer dengan elemen tradisional Bali. Setiap kamar tidur memiliki kamar mandi en-suite, dan area living outdoor yang luas dilengkapi dengan bar kolam renang dan gazebo untuk bersantap di bawah bintang.",
      en: "Villa Cendana epitomizes tropical luxury in the vibrant heart of Seminyak. Just steps from pristine beaches and world-class dining, this villa masterfully combines sleek contemporary architecture with authentic Balinese elements. Features en-suite bathrooms in all suites, an outdoor sunken pool bar, and an open gazebo for starry dining.",
      fr: "La Villa Cendana incarne le luxe tropical au cœur de Seminyak. À quelques pas des plages et des meilleurs restaurants de Bali, elle allie architecture contemporaine et artisanat balinais traditionnel. Chaque suite dispose d'une salle de bain attenante, d'un bar de piscine et d'un gazebo pour des dîners sous les étoiles.",
      zh: "檀香别墅（Villa Cendana）是水明漾核心区域热带奢华的典范。毗邻著名海滩与顶尖餐厅酒吧，别墅将时尚的现代建筑与地道巴厘传统工艺精妙结合。所有套房均配备独立卫浴，设有户外下沉式泳池酒吧与星空用餐凉亭。",
    },
    fasilitas: {
      id: [
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
      en: [
        "Private Pool",
        "High-Speed WiFi",
        "Gourmet Kitchen",
        "Air Conditioning",
        "Poolside Bar",
        "Gazebo Pavilion",
        "Smart TV",
        "Butler Service",
        "Private Gym",
      ],
      fr: [
        "Piscine Privée",
        "WiFi Haut Débit",
        "Cuisine Gourmet",
        "Climatisation",
        "Bar de Piscine",
        "Gazébo",
        "Smart TV",
        "Service de Majordome",
        "Salle de Sport Privée",
      ],
      zh: [
        "私人泳池",
        "高速无线网络",
        "美食厨房",
        "全屋空调",
        "池畔酒吧",
        "观景凉亭",
        "智能电视",
        "专属管家服务",
        "私人健身房",
      ],
    },
    galeri_foto: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.6906, lng: 115.1685 },
    kategori: {
      id: "Villa Mewah",
      en: "Luxury Villa",
      fr: "Villa de Luxe",
      zh: "奢华别墅",
    },
  },
  {
    id: "villa-melati",
    nama: "Villa Melati",
    nomor_whatsapp_pemilik: "6281234567803",
    kategori_key: "family",
    lokasi: {
      id: "Canggu, Bali",
      en: "Canggu, Bali",
      fr: "Canggu, Bali",
      zh: "仓古, 巴厘岛",
    },
    harga_per_malam: 2_800_000,
    jumlah_kamar: 3,
    jumlah_kamar_mandi: 2,
    kapasitas_tamu: 6,
    deskripsi: {
      id: "Terletak di kawasan Canggu yang trendi, Villa Melati adalah perpaduan sempurna antara gaya hidup pantai dan kenyamanan rumah. Dengan desain bohemian-modern, rooftop lounge untuk menikmati sunset, dan akses mudah ke pantai serta kafe-kafe terbaik, villa ini sangat cocok untuk keluarga muda atau rombongan teman yang mencari pengalaman Bali yang autentik dan stylish.",
      en: "Located in vibrant Canggu, Villa Melati offers the perfect blend of coastal living and chic residential comfort. Featuring bohemian-modern design, a rooftop sunset lounge, and immediate access to top surf breaks and trendy cafes. Perfect for families or friend getaways.",
      fr: "Située dans le quartier prisé de Canggu, la Villa Melati marie à la perfection style balnéaire bohème et grand confort. Dotée d'un lounge rooftop pour admirer le coucher de soleil et d'un accès rapide aux plages de surf et cafés branchés.",
      zh: "茉莉别墅（Villa Melati）坐落于潮流聚集地仓古，将悠闲的海滨生活与时尚的居家舒适感完美融合。采用波西米亚现代风格设计，配备日落屋顶酒廊，便捷直达冲浪胜地与人气咖啡馆。",
    },
    fasilitas: {
      id: [
        "Kolam Renang",
        "WiFi Kecepatan Tinggi",
        "Dapur Lengkap",
        "AC",
        "Rooftop Lounge",
        "Sepeda Gratis",
        "BBQ Area",
        "Smart TV",
      ],
      en: [
        "Swimming Pool",
        "High-Speed WiFi",
        "Full Kitchen",
        "Air Conditioning",
        "Rooftop Lounge",
        "Complimentary Bicycles",
        "BBQ Grill Area",
        "Smart TV",
      ],
      fr: [
        "Piscine",
        "WiFi Haut Débit",
        "Cuisine Complète",
        "Climatisation",
        "Lounge Rooftop",
        "Vélos Gratuits",
        "Espace Barbecue",
        "Smart TV",
      ],
      zh: [
        "游泳池",
        "高速无线网络",
        "全功能厨房",
        "空调设备",
        "天台日落酒廊",
        "免费自行车",
        "烧烤专用区",
        "智能电视",
      ],
    },
    galeri_foto: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.6478, lng: 115.1385 },
    kategori: {
      id: "Villa Keluarga",
      en: "Family Villa",
      fr: "Villa Familiale",
      zh: "家庭度假别墅",
    },
  },
  {
    id: "studio-anggrek",
    nama: "Studio Anggrek",
    nomor_whatsapp_pemilik: "6281234567804",
    kategori_key: "studio",
    lokasi: {
      id: "Sanur, Bali",
      en: "Sanur, Bali",
      fr: "Sanur, Bali",
      zh: "沙努尔, 巴厘岛",
    },
    harga_per_malam: 1_200_000,
    jumlah_kamar: 1,
    jumlah_kamar_mandi: 1,
    kapasitas_tamu: 2,
    deskripsi: {
      id: "Studio Anggrek adalah retreat minimalis yang elegan di tepi pantai Sanur. Dirancang untuk pasangan atau pelancong solo, studio ini memadukan kesederhanaan Jepang dengan kehangatan tropis Bali. Dengan jendela kaca besar yang menghadap taman, tempat tidur platform dari kayu jati, dan akses langsung ke pantai, ini adalah tempat sempurna untuk menikmati ketenangan.",
      en: "Studio Anggrek is a refined minimalist sanctuary along the tranquil shores of Sanur. Tailored for couples and solo adventurers, it pairs Japanese wabi-sabi aesthetics with Balinese tropical warmth. Features floor-to-ceiling garden windows and direct boardwalk beach access.",
      fr: "Le Studio Anggrek est une retraite minimaliste et élégante sur la côte paisible de Sanur. Conçu pour les couples et voyageurs solo, il associe la sérénité japonaise à la chaleur tropicale balinaise, avec de grandes baies vitrées donnant sur le jardin.",
      zh: "兰花雅筑（Studio Anggrek）是坐落于沙努尔宁静海岸线的精致极简度假公寓。专为情侣或独行探索者打造，巧妙融合日式侘寂美学与巴厘热带温润风情，设有通透的落地景观窗与私享花园露台。",
    },
    fasilitas: {
      id: [
        "WiFi Kecepatan Tinggi",
        "AC",
        "Dapur Kecil (Kitchenette)",
        "Smart TV",
        "Akses Pantai",
        "Teras Pribadi",
      ],
      en: [
        "High-Speed WiFi",
        "Air Conditioning",
        "Kitchenette",
        "Smart TV",
        "Direct Beach Access",
        "Private Terrace",
      ],
      fr: [
        "WiFi Haut Débit",
        "Climatisation",
        "Kitchenette",
        "Smart TV",
        "Accès Direct à la Plage",
        "Terrasse Privée",
      ],
      zh: [
        "高速无线网络",
        "空调设施",
        "精致简易厨房",
        "智能电视",
        "直达海滩通道",
        "私人观景露台",
      ],
    },
    galeri_foto: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.6783, lng: 115.2636 },
    kategori: {
      id: "Studio Minimalis",
      en: "Minimalist Studio",
      fr: "Studio Minimaliste",
      zh: "极简公寓",
    },
  },
  {
    id: "villa-kamboja",
    nama: "Villa Kamboja",
    nomor_whatsapp_pemilik: "6281234567805",
    kategori_key: "luxury",
    lokasi: {
      id: "Jimbaran, Bali",
      en: "Jimbaran, Bali",
      fr: "Jimbaran, Bali",
      zh: "金巴兰, 巴厘岛",
    },
    harga_per_malam: 4_100_000,
    jumlah_kamar: 4,
    jumlah_kamar_mandi: 4,
    kapasitas_tamu: 8,
    deskripsi: {
      id: "Bertengger di atas tebing Jimbaran dengan pemandangan Samudra Hindia yang memukau, Villa Kamboja menghadirkan kemewahan pantai dalam setiap detailnya. Desain arsitektur tropis-modern dengan batu kapur dan kayu ironwood, dilengkapi infinity pool yang seolah menyatu dengan laut. Nikmati sunset spektakuler dari sundeck pribadi sambil menikmati cocktail dari bar villa.",
      en: "Perched atop the dramatic cliffs of Jimbaran with panoramic views across the Indian Ocean, Villa Kamboja presents sheer coastal grandeur. Built with native limestone and ironwood, boasting an infinity pool merging seamlessly with the azure horizon and a private cliffside sunset deck.",
      fr: "Perchée sur les falaises majestueuses de Jimbaran avec vue imprenable sur l'océan Indien, la Villa Kamboja offre un luxe côtier spectaculaire. Construite en pierre calcaire et bois de fer, avec une piscine à débordement fusionnant avec l'horizon.",
      zh: "鸡蛋花别墅（Villa Kamboja）屹立于金巴兰雄伟的悬崖之巅，饱览印度洋无垠全景。别墅采用当地石灰岩与珍贵铁木精工构筑，无边泳池与碧海蓝天无缝相接，配有私人悬崖日落观景露台。",
    },
    fasilitas: {
      id: [
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
      en: [
        "Infinity Pool",
        "High-Speed WiFi",
        "Full Gourmet Kitchen",
        "Air Conditioning",
        "Ocean View",
        "Sunset Sundeck",
        "Home Theater",
        "Private Chef Service",
        "Jacuzzi Spa",
      ],
      fr: [
        "Piscine à Débordement",
        "WiFi Haut Débit",
        "Cuisine Équipée",
        "Climatisation",
        "Vue sur l'Océan",
        "Terrasse Solarium",
        "Home Cinéma",
        "Chef Privé sur Demande",
        "Jacuzzi Spa",
      ],
      zh: [
        "悬崖无边泳池",
        "高速无线网络",
        "全套美食厨房",
        "全屋空调",
        "全景印度洋海景",
        "日落日光甲板",
        "家庭影院系统",
        "私人主厨服务",
        "按摩浴缸水疗",
      ],
    },
    galeri_foto: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.7904, lng: 115.1619 },
    kategori: {
      id: "Villa Mewah",
      en: "Luxury Villa",
      fr: "Villa de Luxe",
      zh: "奢华别墅",
    },
  },
  {
    id: "villa-flamboyan",
    nama: "Villa Flamboyan",
    nomor_whatsapp_pemilik: "6281234567806",
    kategori_key: "family",
    lokasi: {
      id: "Tabanan, Bali",
      en: "Tabanan, Bali",
      fr: "Tabanan, Bali",
      zh: "塔巴南, 巴厘岛",
    },
    harga_per_malam: 2_200_000,
    jumlah_kamar: 3,
    jumlah_kamar_mandi: 2,
    kapasitas_tamu: 6,
    deskripsi: {
      id: "Di tengah hamparan sawah Tabanan yang hijau, Villa Flamboyan menawarkan pengalaman hidup pedesaan Bali yang otentik dengan sentuhan modern. Bangunan tradisional dengan atap alang-alang telah direnovasi dengan fasilitas kontemporer. Nikmati pagi dengan suara burung dan pemandangan Gunung Batukaru, lalu habiskan hari bersepeda melintasi desa sekitar.",
      en: "Set amidst the emerald rice terraces of Tabanan, Villa Flamboyan offers an authentic Balinese countryside experience refined with modern luxury. Traditional alang-alang thatched architecture meets contemporary comforts, offering awe-inspiring views of Mount Batukaru.",
      fr: "Au milieu des rizières d'émeraude de Tabanan, la Villa Flamboyan offre une expérience balinaise rurale authentique et raffinée. Toits de chaume traditionnels et confort moderne avec vue grandiose sur le mont Batukaru.",
      zh: "凤凰木庄园（Villa Flamboyan）坐落在塔巴南碧绿的梯田怀抱中，为您带来融入现代雅致的纯正巴厘田园体验。传统茅草屋顶建筑搭配现代设施，晨起可远眺巴图卡鲁圣山的壮丽景致。",
    },
    fasilitas: {
      id: [
        "Kolam Renang",
        "WiFi",
        "Dapur Lengkap",
        "Kipas Angin & AC",
        "Pemandangan Sawah",
        "Sepeda Gratis",
        "Ruang Meditasi",
        "Sarapan Lokal Inklusif",
      ],
      en: [
        "Swimming Pool",
        "WiFi",
        "Full Kitchen",
        "AC & Fans",
        "Rice Field View",
        "Free Bicycles",
        "Meditation Shala",
        "Inclusive Local Breakfast",
      ],
      fr: [
        "Piscine",
        "WiFi",
        "Cuisine Complète",
        "Climatisation & Ventilateurs",
        "Vue sur les Rizières",
        "Vélos Gratuits",
        "Espace de Méditation",
        "Petit-Déjeuner Local Inclus",
      ],
      zh: [
        "花园泳池",
        "无线网络",
        "全套厨房",
        "空调与静音吊扇",
        "无遮挡梯田风光",
        "免费骑行单车",
        "静修冥想空间",
        "含地道巴厘早餐",
      ],
    },
    galeri_foto: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.5412, lng: 115.1021 },
    kategori: {
      id: "Villa Keluarga",
      en: "Family Villa",
      fr: "Villa Familiale",
      zh: "家庭度假别墅",
    },
  },
  {
    id: "studio-kenanga",
    nama: "Studio Kenanga",
    nomor_whatsapp_pemilik: "6281234567807",
    kategori_key: "studio",
    lokasi: {
      id: "Uluwatu, Bali",
      en: "Uluwatu, Bali",
      fr: "Uluwatu, Bali",
      zh: "乌鲁瓦图, 巴厘岛",
    },
    harga_per_malam: 1_500_000,
    jumlah_kamar: 1,
    jumlah_kamar_mandi: 1,
    kapasitas_tamu: 2,
    deskripsi: {
      id: "Bertengger di tebing eksotis Uluwatu, Studio Kenanga adalah studio bergaya industrial-tropis yang dirancang untuk petualang dan pasangan. Dengan dinding semen ekspos dipadu tanaman rambat hijau, lantai teraso, dan balkon menghadap lautan lepas. Dekat dengan spot surfing legendaris dan Pura Uluwatu yang ikonis.",
      en: "Perched above the legendary surf breaks of Uluwatu, Studio Kenanga showcases an industrial-tropical aesthetic. Polished concrete meets cascading flora, terrazzo flooring, and an open ocean-facing balcony. Minutes from world-class waves and iconic sunset temples.",
      fr: "Surplombant les falaises d'Uluwatu, le Studio Kenanga allie style industriel et végétation tropicale. Béton ciré, terrazzo et balcon privé face aux vagues de l'océan Indien. Proche des meilleurs spots de surf et du temple emblématique.",
      zh: "依兰寓所（Studio Kenanga）高悬于乌鲁瓦图传奇冲浪胜地之上，展现工业风与热带植被的酷炫碰撞。清水混凝土墙面、水磨石地面与面海开阔阳台，距著名冲浪浪点与乌鲁瓦图情人崖神庙仅数分钟之遥。",
    },
    fasilitas: {
      id: [
        "WiFi Kecepatan Tinggi",
        "AC",
        "Kitchenette",
        "Smart TV",
        "Balkon Laut",
        "Outdoor Shower",
        "Peralatan Snorkeling",
      ],
      en: [
        "High-Speed WiFi",
        "Air Conditioning",
        "Kitchenette",
        "Smart TV",
        "Ocean Balcony",
        "Outdoor Rain Shower",
        "Snorkeling Gear",
      ],
      fr: [
        "WiFi Haut Débit",
        "Climatisation",
        "Kitchenette",
        "Smart TV",
        "Balcon Vue Mer",
        "Douche Tropicale Extérieure",
        "Équipement de Snorkeling",
      ],
      zh: [
        "高速无线网络",
        "空调设施",
        "简易料理台",
        "智能电视",
        "全海景私人阳台",
        "露天雨淋花洒",
        "浮潜装备提供",
      ],
    },
    galeri_foto: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.8291, lng: 115.0849 },
    kategori: {
      id: "Studio Minimalis",
      en: "Minimalist Studio",
      fr: "Studio Minimaliste",
      zh: "极简公寓",
    },
  },
  {
    id: "villa-dahlia",
    nama: "Villa Dahlia",
    nomor_whatsapp_pemilik: "6281234567808",
    kategori_key: "luxury",
    lokasi: {
      id: "Nusa Dua, Bali",
      en: "Nusa Dua, Bali",
      fr: "Nusa Dua, Bali",
      zh: "努沙杜瓦, 巴厘岛",
    },
    harga_per_malam: 6_800_000,
    jumlah_kamar: 6,
    jumlah_kamar_mandi: 6,
    kapasitas_tamu: 14,
    deskripsi: {
      id: "Villa Dahlia adalah crown jewel dari koleksi kami — sebuah estate mewah di kawasan eksklusif Nusa Dua. Dengan enam kamar tidur suite berstandar bintang lima, villa ini dirancang untuk acara keluarga besar atau retreat eksklusif. Fasilitas kelas dunia meliputi kolam renang 25 meter, spa lengkap, lapangan tenis, dan taman tropis seluas satu hektar.",
      en: "Villa Dahlia stands as the crown jewel of our collection — an imperial private estate in the exclusive enclaves of Nusa Dua. Boasting six master suites, a 25-meter Olympic-style pool, full-service spa, private tennis court, and one hectare of manicured gardens with 24-hour butler service.",
      fr: "La Villa Dahlia est le fleuron de notre collection : un domaine d'exception à Nusa Dua. Comprenant six suites de maître, une piscine de 25 mètres, un spa privé, un court de tennis et un hectare de jardins luxuriants avec majordome 24h/24.",
      zh: "大丽花庄园（Villa Dahlia）是我们至臻奢华系列的传世之作——坐落于努沙杜瓦尊贵区域的私密皇家庄园。拥有6间五星级豪华套房、25米半奥林匹克泳池、私人水疗中心、网球场与一公顷私家热带花园，配备24小时全天候管家服务。",
    },
    fasilitas: {
      id: [
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
      en: [
        "25m Lap Pool",
        "High-Speed WiFi",
        "Professional Kitchen",
        "Central AC",
        "Spa & Sauna",
        "Tennis Court",
        "Gym",
        "1-Hectare Garden",
        "24/7 Butler Service",
        "Helipad Access",
        "Meeting Room",
      ],
      fr: [
        "Piscine de 25m",
        "WiFi Haut Débit",
        "Cuisine Professionnelle",
        "Climatisation Centrale",
        "Spa & Sauna",
        "Court de Tennis",
        "Salle de Sport",
        "Jardin d'1 Hectare",
        "Majordome 24h/24",
        "Accès Héliport",
        "Salle de Réunion",
      ],
      zh: [
        "25米竞速泳池",
        "超高速WiFi",
        "专业商用厨房",
        "中央空调",
        "私享水疗桑拿",
        "私人网球场",
        "豪华健身房",
        "一公顷热带庄园",
        "24小时管家服务",
        "直升机停机坪",
        "商务会议室",
      ],
    },
    galeri_foto: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
    ],
    koordinat: { lat: -8.8028, lng: 115.2318 },
    kategori: {
      id: "Villa Mewah",
      en: "Luxury Villa",
      fr: "Villa de Luxe",
      zh: "奢华别墅",
    },
  },
];

export function getLocalizedVilla(
  villaRaw: (typeof villaDataRaw)[number],
  locale: Locale = "id"
): Villa {
  const safeLocale: Locale = ["id", "en", "fr", "zh"].includes(locale)
    ? locale
    : "id";

  return {
    id: villaRaw.id,
    nama: villaRaw.nama,
    nomor_whatsapp_pemilik: villaRaw.nomor_whatsapp_pemilik,
    lokasi: villaRaw.lokasi[safeLocale] || villaRaw.lokasi.id,
    harga_per_malam: villaRaw.harga_per_malam,
    jumlah_kamar: villaRaw.jumlah_kamar,
    jumlah_kamar_mandi: villaRaw.jumlah_kamar_mandi,
    kapasitas_tamu: villaRaw.kapasitas_tamu,
    deskripsi: villaRaw.deskripsi[safeLocale] || villaRaw.deskripsi.id,
    fasilitas: villaRaw.fasilitas[safeLocale] || villaRaw.fasilitas.id,
    galeri_foto: villaRaw.galeri_foto,
    koordinat: villaRaw.koordinat,
    kategori: villaRaw.kategori[safeLocale] || villaRaw.kategori.id,
    kategori_key: villaRaw.kategori_key,
  };
}

export function getLocalizedVillas(locale: Locale = "id"): Villa[] {
  return villaDataRaw.map((v) => getLocalizedVilla(v, locale));
}

export function getVillaById(
  id: string,
  locale: Locale = "id"
): Villa | undefined {
  const raw = villaDataRaw.find((v) => v.id === id);
  if (!raw) return undefined;
  return getLocalizedVilla(raw, locale);
}

// Backward compatibility default
export const villaData: Villa[] = getLocalizedVillas("id");

export function formatHarga(harga: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(harga);
}

export function getKategoriList(locale: Locale = "id"): string[] {
  const list = getLocalizedVillas(locale);
  return [...new Set(list.map((v) => v.kategori))];
}

export function getLokasiList(locale: Locale = "id"): string[] {
  const list = getLocalizedVillas(locale);
  return [...new Set(list.map((v) => v.lokasi))];
}
