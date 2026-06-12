export type MarketplaceLinks = {
  wildberries?: string;
  ozon?: string;
  apteka?: string;
  goldapple?: string;
  letu?: string;
  zdravcity?: string;
  official?: string;
};

export type BannerAspect = "auto" | "square" | "wide" | "photo" | "compact";

export type BannerImageFit = "contain" | "cover";

export type BannerMobileTextMode = "full" | "title" | "hidden";

export type HomeBlockSourceType = "custom" | "product" | "post" | "brand" | "category";

export type HomeBanner = {
  id: string;
  sourceType: HomeBlockSourceType;
  sourceSlug?: string;
  title: string;
  description: string;
  image: string;
  href: string;
  enabled: boolean;
  width: number;
  aspect: BannerAspect;
  imageFit: BannerImageFit;
  mobileAspect: BannerAspect;
  mobileImageFit: BannerImageFit;
  mobileTextMode: BannerMobileTextMode;
  order: number;
};

export type HomeFact = {
  value: string;
  label: string;
};

export type HomeDirection = {
  title: string;
  text: string;
};

export type HomePageSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroDescription: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroProductSlugs: string[];
  facts: HomeFact[];
  directions: HomeDirection[];
  brandsEyebrow: string;
  brandsTitle: string;
  brandsDescription: string;
  productsEyebrow: string;
  productsTitle: string;
  productsDescription: string;
  productsLimit: number;
  postsEyebrow: string;
  postsTitle: string;
  postsDescription: string;
  postsLimit: number;
  whyEyebrow: string;
  whyTitle: string;
  whyItems: string[];
  showHero: boolean;
  showFacts: boolean;
  showBlocks: boolean;
  showDirections: boolean;
  showBrands: boolean;
  showProducts: boolean;
  showWhy: boolean;
  showPosts: boolean;
};

export type SeoSettings = {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robotsIndex: boolean;
  productTitleTemplate: string;
  productDescriptionTemplate: string;
  categoryTitleTemplate: string;
  brandTitleTemplate: string;
  marketplaceGoalText: string;
  yandexMetrikaId: string;
  googleAnalyticsId: string;
};

export type Brand = {
  slug: string;
  title: string;
  latin?: string;
  short: string;
  description: string;
  origin: string;
  focus: string[];
  image: string;
  logoText?: string;
  logoSubtext?: string;
  accent: string;
  featured?: boolean;
};

export type Category = {
  slug: string;
  title: string;
  description: string;
};

export type Product = {
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  brand: string;
  categories: string[];
  image: string;
  imageAlt: string;
  ingredients: string[];
  tags: string[];
  badge?: string;
  isNew?: boolean;
  isPopular?: boolean;
  marketplaces: MarketplaceLinks;
  body: string;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: "news" | "promo" | "article";
  image: string;
  imageAlt: string;
  tags: string[];
  body: string;
};

export type ReferenceDocument = {
  title: string;
  description: string;
  size: string;
  href: string;
  image: string;
};

export type ParsedFrontmatter<T> = T & {
  body: string;
};
