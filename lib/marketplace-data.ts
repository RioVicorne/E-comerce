export type ProductPlatform =
  | "Steam"
  | "Windows"
  | "PlayStation"
  | "Xbox"
  | "Mobile"
  | "GiftCard";

export type Product = {
  id: string;
  title: string;
  image: string; // public path
  platform: ProductPlatform;
  salePrice: number;
  originalPrice?: number;
  rating: number; // 0..5
  sold: number;
  tags: Array<"best" | "recommended" | "deal" | "high_rating">;
};

export type Promotion = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  gradient: string;
};

export const promotions: Promotion[] = [
  {
    id: "promo-1",
    title: "Tuần lễ Ưu đãi Neon",
    subtitle: "Giảm đến 70% cho game key & mã ví. Hơn 25 sản phẩm đang sale!",
    cta: "Khám phá ưu đãi",
    gradient: "from-violet-500/30 via-fuchsia-500/20 to-cyan-400/20",
  },
  {
    id: "promo-2",
    title: "Nạp tiền siêu tốc",
    subtitle: "Nạp nhanh cho game mobile & dịch vụ. Giao mã trong 30 giây.",
    cta: "Nạp ngay",
    gradient: "from-cyan-400/25 via-blue-500/20 to-violet-500/25",
  },
  {
    id: "promo-3",
    title: "Bản quyền đáng tin cậy",
    subtitle: "Key phần mềm chính hãng. Giao hàng tức thì. Hỗ trợ 24/7.",
    cta: "Xem phần mềm",
    gradient: "from-fuchsia-500/20 via-violet-500/20 to-blue-500/20",
  },
  {
    id: "promo-4",
    title: "Flash Sale Cuối Tuần",
    subtitle: "Giảm sốc đến 80%! Chỉ trong hôm nay. Nhanh tay kẻo hết!",
    cta: "Mua ngay",
    gradient: "from-red-500/25 via-orange-500/20 to-yellow-500/20",
  },
  {
    id: "promo-5",
    title: "Combo Siêu Tiết Kiệm",
    subtitle: "Mua combo 3 sản phẩm giảm thêm 15%. Áp dụng cho tất cả sản phẩm.",
    cta: "Xem combo",
    gradient: "from-green-500/20 via-emerald-500/15 to-teal-500/20",
  },
] as const;

export const bentoCategories = [
  {
    id: "cat-1",
    title: "Ứng dụng Học tập",
    subtitle: "Nâng cao kỹ năng, luôn sắc bén",
    tone: "from-violet-500/25 via-fuchsia-500/15 to-cyan-400/15",
    icon: "sparkles",
  },
  {
    id: "cat-2",
    title: "Ứng dụng Thiết kế",
    subtitle: "Công cụ chuyên nghiệp & gói đăng ký",
    tone: "from-cyan-400/20 via-blue-500/15 to-violet-500/20",
    icon: "pen",
  },
  {
    id: "cat-3",
    title: "Ví Steam",
    subtitle: "Mã tức thì, tỷ giá tốt nhất",
    tone: "from-blue-500/20 via-violet-500/15 to-fuchsia-500/20",
    icon: "wallet",
  },
  {
    id: "cat-4",
    title: "Netflix",
    subtitle: "Gói cao cấp & chia sẻ",
    tone: "from-fuchsia-500/20 via-red-500/10 to-violet-500/20",
    icon: "play",
  },
] as const;

export const quickAccess = [
  { id: "qa-1", label: "PUBG PC", icon: "crosshair" },
  { id: "qa-2", label: "Game Mobile", icon: "smartphone" },
  { id: "qa-3", label: "Thẻ quà tặng", icon: "gift" },
  { id: "qa-4", label: "Công cụ", icon: "wrench" },
  { id: "qa-5", label: "Nạp tiền", icon: "zap" },
  { id: "qa-6", label: "Steam Wallet", icon: "wallet" },
  { id: "qa-7", label: "Windows Key", icon: "monitor" },
  { id: "qa-8", label: "Netflix", icon: "play" },
] as const;

export const products: Product[] = [
  // Best Sellers & High Rating
  {
    id: "p-1",
    title: "Ví Steam 100.000₫ (VN) — Giao mã tức thì",
    image: "/file.svg",
    platform: "Steam",
    salePrice: 95000,
    originalPrice: 100000,
    rating: 4.8,
    sold: 12412,
    tags: ["best", "deal", "high_rating"],
  },
  {
    id: "p-2",
    title: "Key bản quyền Windows 11 Pro (Trọn đời) — Giao hàng số",
    image: "/window.svg",
    platform: "Windows",
    salePrice: 189000,
    originalPrice: 399000,
    rating: 4.6,
    sold: 5310,
    tags: ["best", "recommended"],
  },
  {
    id: "p-6",
    title: "Thẻ quà tặng PlayStation 20$ (US) — Mã đổi tức thì",
    image: "/file.svg",
    platform: "PlayStation",
    salePrice: 499000,
    originalPrice: 539000,
    rating: 4.9,
    sold: 1540,
    tags: ["best", "high_rating"],
  },
  {
    id: "p-7",
    title: "Ví Steam 200.000₫ (VN) — Giao mã tức thì",
    image: "/file.svg",
    platform: "Steam",
    salePrice: 195000,
    originalPrice: 200000,
    rating: 4.9,
    sold: 8920,
    tags: ["best", "high_rating", "recommended"],
  },
  {
    id: "p-8",
    title: "Microsoft Office 2021 Home & Student (Trọn đời) — Key số",
    image: "/window.svg",
    platform: "Windows",
    salePrice: 299000,
    originalPrice: 599000,
    rating: 4.7,
    sold: 3420,
    tags: ["best", "recommended"],
  },
  {
    id: "p-9",
    title: "Ví Steam 500.000₫ (VN) — Giao mã tức thì",
    image: "/file.svg",
    platform: "Steam",
    salePrice: 495000,
    originalPrice: 500000,
    rating: 4.8,
    sold: 2150,
    tags: ["best", "high_rating"],
  },
  // Deals < 100k
  {
    id: "p-3",
    title: "Netflix Premium 1 Tháng (Slot chia sẻ) — 4K UHD",
    image: "/globe.svg",
    platform: "GiftCard",
    salePrice: 79000,
    originalPrice: 99000,
    rating: 4.5,
    sold: 2208,
    tags: ["recommended", "deal"],
  },
  {
    id: "p-4",
    title: "PUBG PC — Nạp UC 660 + Bonus (Nhanh)",
    image: "/next.svg",
    platform: "Steam",
    salePrice: 99000,
    originalPrice: 120000,
    rating: 4.7,
    sold: 812,
    tags: ["deal", "high_rating"],
  },
  {
    id: "p-10",
    title: "Ví Steam 50.000₫ (VN) — Giao mã tức thì",
    image: "/file.svg",
    platform: "Steam",
    salePrice: 49000,
    originalPrice: 50000,
    rating: 4.6,
    sold: 1850,
    tags: ["deal"],
  },
  {
    id: "p-11",
    title: "Spotify Premium 1 Tháng (Gia đình) — Key số",
    image: "/globe.svg",
    platform: "GiftCard",
    salePrice: 89000,
    originalPrice: 109000,
    rating: 4.4,
    sold: 920,
    tags: ["deal", "recommended"],
  },
  {
    id: "p-12",
    title: "Free Fire — Nạp kim cương 1000 + Bonus",
    image: "/next.svg",
    platform: "Mobile",
    salePrice: 85000,
    originalPrice: 100000,
    rating: 4.5,
    sold: 1520,
    tags: ["deal"],
  },
  {
    id: "p-13",
    title: "Ví Steam 20.000₫ (VN) — Giao mã tức thì",
    image: "/file.svg",
    platform: "Steam",
    salePrice: 19000,
    originalPrice: 20000,
    rating: 4.3,
    sold: 3420,
    tags: ["deal"],
  },
  // Recommended
  {
    id: "p-5",
    title: "Adobe Creative Cloud 1 Tháng — Gói Sinh viên (Mã)",
    image: "/vercel.svg",
    platform: "Windows",
    salePrice: 129000,
    originalPrice: 199000,
    rating: 4.4,
    sold: 610,
    tags: ["recommended"],
  },
  {
    id: "p-14",
    title: "Xbox Game Pass Ultimate 1 Tháng — Key số",
    image: "/file.svg",
    platform: "Xbox",
    salePrice: 149000,
    originalPrice: 199000,
    rating: 4.6,
    sold: 1120,
    tags: ["recommended", "high_rating"],
  },
  {
    id: "p-15",
    title: "Adobe Photoshop 2024 (Trọn đời) — Key bản quyền",
    image: "/vercel.svg",
    platform: "Windows",
    salePrice: 249000,
    originalPrice: 499000,
    rating: 4.5,
    sold: 890,
    tags: ["recommended"],
  },
  {
    id: "p-16",
    title: "Thẻ quà tặng Xbox 10$ (US) — Mã đổi tức thì",
    image: "/file.svg",
    platform: "Xbox",
    salePrice: 249000,
    originalPrice: 269000,
    rating: 4.7,
    sold: 680,
    tags: ["recommended", "high_rating"],
  },
  {
    id: "p-17",
    title: "Disney+ Premium 1 Tháng — Key số",
    image: "/globe.svg",
    platform: "GiftCard",
    salePrice: 99000,
    originalPrice: 119000,
    rating: 4.4,
    sold: 450,
    tags: ["recommended"],
  },
  // High Rating
  {
    id: "p-18",
    title: "Ví Steam 1.000.000₫ (VN) — Giao mã tức thì",
    image: "/file.svg",
    platform: "Steam",
    salePrice: 995000,
    originalPrice: 1000000,
    rating: 5.0,
    sold: 320,
    tags: ["high_rating"],
  },
  {
    id: "p-19",
    title: "Thẻ quà tặng PlayStation 50$ (US) — Mã đổi tức thì",
    image: "/file.svg",
    platform: "PlayStation",
    salePrice: 1249000,
    originalPrice: 1299000,
    rating: 4.9,
    sold: 210,
    tags: ["high_rating"],
  },
  {
    id: "p-20",
    title: "Windows 10 Pro License Key (Trọn đời) — Giao hàng số",
    image: "/window.svg",
    platform: "Windows",
    salePrice: 159000,
    originalPrice: 299000,
    rating: 4.8,
    sold: 1890,
    tags: ["high_rating", "recommended"],
  },
  {
    id: "p-21",
    title: "Ví Steam 300.000₫ (VN) — Giao mã tức thì",
    image: "/file.svg",
    platform: "Steam",
    salePrice: 295000,
    originalPrice: 300000,
    rating: 4.9,
    sold: 1250,
    tags: ["high_rating", "best"],
  },
  {
    id: "p-22",
    title: "Thẻ quà tặng Nintendo eShop 20$ (US) — Mã đổi",
    image: "/file.svg",
    platform: "GiftCard",
    salePrice: 499000,
    originalPrice: 519000,
    rating: 4.8,
    sold: 380,
    tags: ["high_rating"],
  },
  // More variety
  {
    id: "p-23",
    title: "Genshin Impact — Nạp Genesis Crystal 1980 + Bonus",
    image: "/next.svg",
    platform: "Mobile",
    salePrice: 199000,
    originalPrice: 249000,
    rating: 4.6,
    sold: 1560,
    tags: ["recommended"],
  },
  {
    id: "p-24",
    title: "Ví Steam 30.000₫ (VN) — Giao mã tức thì",
    image: "/file.svg",
    platform: "Steam",
    salePrice: 29000,
    originalPrice: 30000,
    rating: 4.4,
    sold: 2890,
    tags: ["deal"],
  },
  {
    id: "p-25",
    title: "AutoCAD 2024 (Trọn đời) — Key bản quyền",
    image: "/window.svg",
    platform: "Windows",
    salePrice: 899000,
    originalPrice: 1999000,
    rating: 4.7,
    sold: 120,
    tags: ["recommended", "high_rating"],
  },
];

