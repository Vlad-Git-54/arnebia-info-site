import { createHmac, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { homeBanners, referenceDocuments } from "@/content/site";
import { brands as defaultBrands, categories as defaultCategories } from "@/content/taxonomy";
import { staticPosts, staticProducts } from "@/lib/static-content";
import type {
  BannerAspect,
  BannerImageFit,
  BannerMobileTextMode,
  Brand,
  Category,
  HomeBanner,
  HomeBlockSourceType,
  HomeDirection,
  HomeFact,
  HomePageSettings,
  MarketplaceLinks,
  Post,
  Product,
  ReferenceDocument,
  SeoSettings,
} from "@/types/content";

export type AdminContent = {
  version: 1;
  updatedAt: string | null;
  home: HomePageSettings;
  seo: SeoSettings;
  banners: HomeBanner[];
  brands: Brand[];
  categories: Category[];
  products: Product[];
  posts: Post[];
  references: ReferenceDocument[];
};

const SESSION_COOKIE = "arnebia_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const MAX_BANNERS = 24;
const MAX_BRANDS = 100;
const MAX_CATEGORIES = 100;
const MAX_PRODUCTS = 900;
const MAX_POSTS = 300;
const MAX_REFERENCES = 200;

function dataDir() {
  return process.env.ADMIN_DATA_DIR || path.join(process.cwd(), "data");
}

export function adminContentPath() {
  return path.join(dataDir(), "content.json");
}

export function uploadsDir() {
  return path.join(dataDir(), "uploads");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/giu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function basenameWithoutExtension(value: string) {
  const clean = value.split("?")[0] ?? value;
  const basename = clean.split("/").pop() ?? clean;
  return basename.replace(/\.[a-z0-9]+$/i, "");
}

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) return fallback;

  return Math.min(max, Math.max(min, Math.round(numeric)));
}

function text(value: unknown, fallback: string, maxLength = 420) {
  if (typeof value !== "string") return fallback;

  return value.trim().slice(0, maxLength);
}

function textArray(
  value: unknown,
  fallback: string[] = [],
  maxItems = 50,
  maxLength = 120,
) {
  if (!Array.isArray(value)) return fallback;

  const seen = new Set<string>();

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLocaleLowerCase("ru");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, maxItems);
}

function normalizeSlug(value: unknown, fallback: string) {
  const source = text(value, fallback, 96);

  return slugify(source) || fallback;
}

function normalizeMarketplaceLinks(
  value: unknown,
  fallback: MarketplaceLinks = {},
): MarketplaceLinks {
  const source =
    typeof value === "object" && value ? (value as Partial<MarketplaceLinks>) : {};

  return {
    wildberries: text(source.wildberries, fallback.wildberries ?? "", 600) || undefined,
    ozon: text(source.ozon, fallback.ozon ?? "", 600) || undefined,
    official: text(source.official, fallback.official ?? "", 600) || undefined,
  };
}

function uniqueBySlug<T extends { slug: string }>(items: T[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (!item.slug || seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

function appendMissingBySlug<T extends { slug: string }>(items: T[], defaults: T[]) {
  const seen = new Set(items.map((item) => item.slug));

  return [
    ...items,
    ...defaults.filter((item) => {
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    }),
  ];
}

function appendMissingReferences(items: ReferenceDocument[], defaults: ReferenceDocument[]) {
  const seen = new Set(items.map((item) => item.title.toLocaleLowerCase("ru")));

  return [
    ...items,
    ...defaults.filter((item) => {
      const key = item.title.toLocaleLowerCase("ru");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
  ];
}

function aspectFromImage(image: string): BannerAspect {
  if (
    image.includes("aromatherapy") ||
    image.includes("bifidobalance") ||
    image.includes("feet-care")
  ) {
    return "square";
  }

  if (image.includes("catalog-products")) return "wide";
  if (image.includes("inform-for-visitors")) return "compact";

  return "photo";
}

function defaultWidth(index: number) {
  if (index === 0) return 4;
  if (index === 1) return 8;
  if (index === 2) return 7;
  if (index === 3) return 5;
  if (index === 4) return 6;
  if (index === 5) return 3;

  return 3;
}

function defaultImageFit(image: string): BannerImageFit {
  return image.includes("catalog-products-modern") ? "cover" : "contain";
}

function defaultBanner(
  banner: (typeof homeBanners)[number],
  index: number,
): HomeBanner {
  const id = slugify(basenameWithoutExtension(banner.image)) || `banner-${index + 1}`;

  return {
    id,
    sourceType: "custom",
    sourceSlug: undefined,
    title: banner.title,
    description: banner.description,
    image: banner.image,
    href: banner.href,
    enabled: true,
    width: defaultWidth(index),
    aspect: aspectFromImage(banner.image),
    imageFit: defaultImageFit(banner.image),
    mobileAspect: aspectFromImage(banner.image),
    mobileImageFit: defaultImageFit(banner.image),
    mobileTextMode: "full",
    order: index,
  };
}

function defaultHomeSettings(): HomePageSettings {
  return {
    heroEyebrow: "30+ лет экспертизы в натуральном уходе",
    heroTitle: "Арнебия",
    heroLead: "Натуральная косметика, эфирные масла, витамины и БАДы с понятной экспертной основой.",
    heroDescription:
      "В портфеле компании — собственные бренды и европейские линии для ухода, ароматерапии, нутрицевтики и осознанной поддержки здоровья.",
    primaryCtaLabel: "Каталог продукции",
    primaryCtaHref: "/catalog",
    secondaryCtaLabel: "Наши бренды",
    secondaryCtaHref: "/brands",
    heroProductSlugs: [
      "arnebia-skinstaff",
      "villaphyta-bifidobalance",
      "atlantomarin-comfort-rinse",
      "villaphyta-feet-deo-spray",
    ],
    facts: [
      { value: "30+", label: "лет на российском рынке" },
      { value: "4", label: "направления дистрибуции" },
      { value: "10+", label: "брендов в портфеле" },
      { value: "2", label: "Золотые медали InterCHARM" },
    ],
    directions: [
      {
        title: "Натуральный уход",
        text: "Гидролаты, кремы, дезодоранты, уход за волосами и телом для ежедневных ритуалов.",
      },
      {
        title: "Витамины и БАДы",
        text: "Шипучие комплексы, спирулина, пробиотики и нутрицевтики для поддержки организма.",
      },
      {
        title: "Ароматерапия",
        text: "Эфирные масла, смеси и аксессуары для дома, массажа и эмоционального баланса.",
      },
      {
        title: "Профессиональные материалы",
        text: "Каталоги, справочники и брендовые материалы для специалистов, партнеров и покупателей.",
      },
    ],
    brandsEyebrow: "Наши бренды",
    brandsTitle: "Создано экспертами, рождено природой",
    brandsDescription:
      "Собственные линии Арнебии и европейские партнеры для натурального ухода, ароматерапии, декоративной косметики и нутрицевтиков.",
    productsEyebrow: "Каталог",
    productsTitle: "Популярные и новые продукты",
    productsDescription:
      "Популярные позиции из направлений ухода, витаминов и БАДов, ароматерапии и натуральной косметики.",
    productsLimit: 6,
    postsEyebrow: "Новости и блог",
    postsTitle: "Материалы Арнебии",
    postsDescription:
      "Новости, акции и экспертные материалы о натуральном уходе, здоровье и продуктовых линейках.",
    postsLimit: 3,
    whyEyebrow: "Почему Арнебия",
    whyTitle: "Натуральность, экспертность и аккуратный подход к выбору формул",
    whyItems: [
      "Более 30 лет работы с натуральной косметикой, витаминами, БАДами и эфирными маслами.",
      "Сильный портфель собственных и партнерских брендов для разных сценариев ухода.",
      "Подробные справочники, каталоги и материалы для покупателей, специалистов и партнеров.",
      "Продуктовые страницы с составами, ингредиентами и прямыми переходами на маркетплейсы.",
    ],
    showHero: true,
    showFacts: true,
    showBlocks: true,
    showDirections: true,
    showBrands: true,
    showProducts: true,
    showWhy: true,
    showPosts: true,
  };
}

function defaultSeoSettings(): SeoSettings {
  return {
    siteTitle: "Арнебия — натуральная косметика, витамины, БАДы и эфирные масла",
    siteDescription:
      "ООО «Арнебия»: натуральная косметика, эфирные масла, витамины, БАДы, бренды, новости, справочники и контакты.",
    siteKeywords: [
      "Арнебия",
      "натуральная косметика",
      "эфирные масла",
      "БАДы",
      "витамины",
      "Виллафита",
      "Арнебия Селекшн",
    ],
    ogTitle: "Арнебия — натуральная косметика и экспертный уход",
    ogDescription:
      "Бренды, продукты, справочники и материалы Арнебии для осознанного выбора натурального ухода.",
    ogImage: "/banners/catalog-products-modern.png",
    robotsIndex: true,
    productTitleTemplate: "{title} | купить на маркетплейсах | Арнебия",
    productDescriptionTemplate:
      "{title}: описание, ключевые ингредиенты и ссылки на Wildberries/Ozon.",
    categoryTitleTemplate: "{title} | каталог Арнебия",
    brandTitleTemplate: "{title} | бренд Арнебия",
    marketplaceGoalText:
      "Приводить органический поисковый трафик на продуктовые страницы и направлять покупателей на маркетплейсы.",
    yandexMetrikaId: "",
    googleAnalyticsId: "",
  };
}

export function defaultAdminContent(): AdminContent {
  return {
    version: 1,
    updatedAt: null,
    home: defaultHomeSettings(),
    seo: defaultSeoSettings(),
    banners: homeBanners.map(defaultBanner),
    brands: defaultBrands,
    categories: defaultCategories,
    products: staticProducts,
    posts: staticPosts,
    references: referenceDocuments,
  };
}

function normalizeAspect(value: unknown, fallback: BannerAspect): BannerAspect {
  if (
    value === "auto" ||
    value === "square" ||
    value === "wide" ||
    value === "photo" ||
    value === "compact"
  ) {
    return value;
  }

  return fallback;
}

function normalizeFit(value: unknown, fallback: BannerImageFit): BannerImageFit {
  return value === "cover" || value === "contain" ? value : fallback;
}

function normalizeMobileTextMode(
  value: unknown,
  fallback: BannerMobileTextMode,
): BannerMobileTextMode {
  if (value === "full" || value === "title" || value === "hidden") return value;

  return fallback;
}

function normalizeSourceType(value: unknown, fallback: HomeBlockSourceType): HomeBlockSourceType {
  if (
    value === "custom" ||
    value === "product" ||
    value === "post" ||
    value === "brand" ||
    value === "category"
  ) {
    return value;
  }

  return fallback;
}

function normalizeFact(value: unknown, index: number, fallback?: HomeFact): HomeFact {
  const source = typeof value === "object" && value ? value as Partial<HomeFact> : {};

  return {
    value: text(source.value, fallback?.value ?? `${index + 1}`, 40),
    label: text(source.label, fallback?.label ?? "Показатель", 160),
  };
}

function normalizeDirection(value: unknown, index: number, fallback?: HomeDirection): HomeDirection {
  const source = typeof value === "object" && value ? value as Partial<HomeDirection> : {};

  return {
    title: text(source.title, fallback?.title ?? `Направление ${index + 1}`, 120),
    text: text(source.text, fallback?.text ?? "", 420),
  };
}

function bool(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeHomeSettings(value: unknown, fallback: HomePageSettings): HomePageSettings {
  const source = typeof value === "object" && value ? value as Partial<HomePageSettings> : {};
  const facts = Array.isArray(source.facts) ? source.facts.slice(0, 8) : fallback.facts;
  const directions = Array.isArray(source.directions)
    ? source.directions.slice(0, 8)
    : fallback.directions;

  return {
    heroEyebrow: text(source.heroEyebrow, fallback.heroEyebrow, 160),
    heroTitle: text(source.heroTitle, fallback.heroTitle, 120),
    heroLead: text(source.heroLead, fallback.heroLead, 260),
    heroDescription: text(source.heroDescription, fallback.heroDescription, 520),
    primaryCtaLabel: text(source.primaryCtaLabel, fallback.primaryCtaLabel, 80),
    primaryCtaHref: text(source.primaryCtaHref, fallback.primaryCtaHref, 300),
    secondaryCtaLabel: text(source.secondaryCtaLabel, fallback.secondaryCtaLabel, 80),
    secondaryCtaHref: text(source.secondaryCtaHref, fallback.secondaryCtaHref, 300),
    heroProductSlugs: textArray(source.heroProductSlugs, fallback.heroProductSlugs, 8, 120),
    facts: facts.map((fact, index) => normalizeFact(fact, index, fallback.facts[index])),
    directions: directions.map((direction, index) =>
      normalizeDirection(direction, index, fallback.directions[index]),
    ),
    brandsEyebrow: text(source.brandsEyebrow, fallback.brandsEyebrow, 120),
    brandsTitle: text(source.brandsTitle, fallback.brandsTitle, 180),
    brandsDescription: text(source.brandsDescription, fallback.brandsDescription, 520),
    productsEyebrow: text(source.productsEyebrow, fallback.productsEyebrow, 120),
    productsTitle: text(source.productsTitle, fallback.productsTitle, 180),
    productsDescription: text(source.productsDescription, fallback.productsDescription, 520),
    productsLimit: clamp(source.productsLimit, 1, 18, fallback.productsLimit),
    postsEyebrow: text(source.postsEyebrow, fallback.postsEyebrow, 120),
    postsTitle: text(source.postsTitle, fallback.postsTitle, 180),
    postsDescription: text(source.postsDescription, fallback.postsDescription, 520),
    postsLimit: clamp(source.postsLimit, 1, 12, fallback.postsLimit),
    whyEyebrow: text(source.whyEyebrow, fallback.whyEyebrow, 120),
    whyTitle: text(source.whyTitle, fallback.whyTitle, 220),
    whyItems: textArray(source.whyItems, fallback.whyItems, 8, 260),
    showHero: bool(source.showHero, fallback.showHero),
    showFacts: bool(source.showFacts, fallback.showFacts),
    showBlocks: bool(source.showBlocks, fallback.showBlocks),
    showDirections: bool(source.showDirections, fallback.showDirections),
    showBrands: bool(source.showBrands, fallback.showBrands),
    showProducts: bool(source.showProducts, fallback.showProducts),
    showWhy: bool(source.showWhy, fallback.showWhy),
    showPosts: bool(source.showPosts, fallback.showPosts),
  };
}

function normalizeSeoSettings(value: unknown, fallback: SeoSettings): SeoSettings {
  const source = typeof value === "object" && value ? value as Partial<SeoSettings> : {};

  return {
    siteTitle: text(source.siteTitle, fallback.siteTitle, 180),
    siteDescription: text(source.siteDescription, fallback.siteDescription, 320),
    siteKeywords: textArray(source.siteKeywords, fallback.siteKeywords, 40, 80),
    ogTitle: text(source.ogTitle, fallback.ogTitle, 180),
    ogDescription: text(source.ogDescription, fallback.ogDescription, 320),
    ogImage: text(source.ogImage, fallback.ogImage, 600),
    robotsIndex: bool(source.robotsIndex, fallback.robotsIndex),
    productTitleTemplate: text(source.productTitleTemplate, fallback.productTitleTemplate, 220),
    productDescriptionTemplate: text(
      source.productDescriptionTemplate,
      fallback.productDescriptionTemplate,
      320,
    ),
    categoryTitleTemplate: text(source.categoryTitleTemplate, fallback.categoryTitleTemplate, 220),
    brandTitleTemplate: text(source.brandTitleTemplate, fallback.brandTitleTemplate, 220),
    marketplaceGoalText: text(source.marketplaceGoalText, fallback.marketplaceGoalText, 520),
    yandexMetrikaId: text(source.yandexMetrikaId, fallback.yandexMetrikaId, 40),
    googleAnalyticsId: text(source.googleAnalyticsId, fallback.googleAnalyticsId, 40),
  };
}

function normalizeBanner(value: unknown, index: number, fallback?: HomeBanner) {
  const source = typeof value === "object" && value ? value as Partial<HomeBanner> : {};
  const fallbackId = fallback?.id ?? `banner-${index + 1}`;
  const sourceImage = text(source.image, fallback?.image ?? "", 600);
  const isLegacyContactsBanner =
    sourceImage.includes("inform-for-visitors") ||
    source.id === "inform-for-visitors" ||
    source.title === "Для посетителей";
  const image = isLegacyContactsBanner ? "/banners/contacts-consultation.png" : sourceImage;
  const id = text(source.id, fallbackId, 80) || fallbackId;

  return {
    id,
    sourceType: normalizeSourceType(source.sourceType, fallback?.sourceType ?? "custom"),
    sourceSlug: text(source.sourceSlug, fallback?.sourceSlug ?? "", 120) || undefined,
    title: isLegacyContactsBanner
      ? "Контакты"
      : text(source.title, fallback?.title ?? "Баннер", 120),
    description: isLegacyContactsBanner
      ? "Адрес, телефоны и удобные способы связи с командой Арнебии."
      : text(source.description, fallback?.description ?? "", 520),
    image,
    href: text(source.href, fallback?.href ?? "/", 600) || "/",
    enabled: typeof source.enabled === "boolean" ? source.enabled : fallback?.enabled ?? true,
    width: clamp(source.width, 3, 12, fallback?.width ?? defaultWidth(index)),
    aspect: normalizeAspect(source.aspect, fallback?.aspect ?? aspectFromImage(image)),
    imageFit: normalizeFit(source.imageFit, fallback?.imageFit ?? defaultImageFit(image)),
    mobileAspect: normalizeAspect(source.mobileAspect, fallback?.mobileAspect ?? aspectFromImage(image)),
    mobileImageFit: normalizeFit(
      source.mobileImageFit,
      fallback?.mobileImageFit ?? defaultImageFit(image),
    ),
    mobileTextMode: normalizeMobileTextMode(
      source.mobileTextMode,
      fallback?.mobileTextMode ?? "full",
    ),
    order: clamp(source.order, 0, 999, fallback?.order ?? index),
  } satisfies HomeBanner;
}

function normalizeBrand(value: unknown, index: number, fallback?: Brand): Brand {
  const source = typeof value === "object" && value ? value as Partial<Brand> : {};
  const title = text(source.title, fallback?.title ?? `Бренд ${index + 1}`, 160);

  return {
    slug: normalizeSlug(source.slug, fallback?.slug ?? `brand-${index + 1}`),
    title,
    latin: text(source.latin, fallback?.latin ?? "", 120) || undefined,
    short: text(source.short, fallback?.short ?? "", 500),
    description: text(source.description, fallback?.description ?? "", 1400),
    origin: text(source.origin, fallback?.origin ?? "", 140),
    focus: textArray(source.focus, fallback?.focus ?? [], 20, 80),
    image: text(source.image, fallback?.image ?? "/banners/catalog-products-modern.png", 600),
    logoText: text(source.logoText, fallback?.logoText ?? title, 160) || undefined,
    logoSubtext: text(source.logoSubtext, fallback?.logoSubtext ?? "", 120) || undefined,
    accent: text(source.accent, fallback?.accent ?? "#7f9f57", 32) || "#7f9f57",
    featured: typeof source.featured === "boolean" ? source.featured : fallback?.featured ?? false,
  };
}

function normalizeCategory(value: unknown, index: number, fallback?: Category): Category {
  const source = typeof value === "object" && value ? value as Partial<Category> : {};
  const title = text(source.title, fallback?.title ?? `Категория ${index + 1}`, 160);

  return {
    slug: normalizeSlug(source.slug, fallback?.slug ?? `category-${index + 1}`),
    title,
    description: text(source.description, fallback?.description ?? "", 900),
  };
}

function normalizeProduct(value: unknown, index: number, fallback?: Product): Product {
  const source = typeof value === "object" && value ? value as Partial<Product> : {};
  const title = text(source.title, fallback?.title ?? `Новый товар ${index + 1}`, 180);
  const slug = normalizeSlug(source.slug, fallback?.slug ?? `product-${index + 1}`);
  const description = text(source.description, fallback?.description ?? "", 900);
  const categories = textArray(source.categories, fallback?.categories ?? ["face-care"], 24, 80);

  return {
    slug,
    title,
    description,
    seoTitle: text(source.seoTitle, fallback?.seoTitle ?? "", 180) || undefined,
    seoDescription: text(source.seoDescription, fallback?.seoDescription ?? "", 260) || undefined,
    keywords: textArray(source.keywords, fallback?.keywords ?? [], 40, 80),
    brand: normalizeSlug(source.brand, fallback?.brand ?? "arnebia-selection"),
    categories: categories.length ? categories : fallback?.categories ?? ["face-care"],
    image: text(source.image, fallback?.image ?? "/banners/catalog-products-modern.png", 600),
    imageAlt: text(source.imageAlt, fallback?.imageAlt ?? title, 180) || title,
    ingredients: textArray(source.ingredients, fallback?.ingredients ?? [], 40, 120),
    tags: textArray(source.tags, fallback?.tags ?? [], 40, 80),
    badge: text(source.badge, fallback?.badge ?? "", 80) || undefined,
    isNew: typeof source.isNew === "boolean" ? source.isNew : fallback?.isNew ?? false,
    isPopular:
      typeof source.isPopular === "boolean" ? source.isPopular : fallback?.isPopular ?? false,
    marketplaces: normalizeMarketplaceLinks(source.marketplaces, fallback?.marketplaces),
    body: text(source.body, fallback?.body ?? "", 12000),
  };
}

function normalizePost(value: unknown, index: number, fallback?: Post): Post {
  const source = typeof value === "object" && value ? value as Partial<Post> : {};
  const title = text(source.title, fallback?.title ?? `Новый материал ${index + 1}`, 180);
  const category =
    source.category === "news" || source.category === "promo" || source.category === "article"
      ? source.category
      : fallback?.category ?? "news";

  return {
    slug: normalizeSlug(source.slug, fallback?.slug ?? `post-${index + 1}`),
    title,
    description: text(source.description, fallback?.description ?? "", 900),
    date: text(source.date, fallback?.date ?? new Date().toISOString().slice(0, 10), 32),
    category,
    image: text(source.image, fallback?.image ?? "/banners/catalog-products-modern.png", 600),
    imageAlt: text(source.imageAlt, fallback?.imageAlt ?? title, 180) || title,
    tags: textArray(source.tags, fallback?.tags ?? [], 40, 80),
    body: text(source.body, fallback?.body ?? "", 12000),
  };
}

function normalizeReference(
  value: unknown,
  index: number,
  fallback?: ReferenceDocument,
): ReferenceDocument {
  const source =
    typeof value === "object" && value ? (value as Partial<ReferenceDocument>) : {};
  const title = text(source.title, fallback?.title ?? `Справочник ${index + 1}`, 220);

  return {
    title,
    description: text(source.description, fallback?.description ?? "", 900),
    size: text(source.size, fallback?.size ?? "PDF", 80) || "PDF",
    href: text(source.href, fallback?.href ?? "#", 900) || "#",
    image: text(source.image, fallback?.image ?? "/references/arnebia-general-catalog.jpg", 600),
  };
}

export function normalizeAdminContent(value: unknown): AdminContent {
  const defaults = defaultAdminContent();
  const source = typeof value === "object" && value ? value as Partial<AdminContent> : {};
  const byId = new Map(defaults.banners.map((banner) => [banner.id, banner]));
  const brandsBySlug = new Map(defaults.brands.map((brand) => [brand.slug, brand]));
  const categoriesBySlug = new Map(defaults.categories.map((category) => [category.slug, category]));
  const productsBySlug = new Map(defaults.products.map((product) => [product.slug, product]));
  const postsBySlug = new Map(defaults.posts.map((post) => [post.slug, post]));
  const referencesByTitle = new Map(
    defaults.references.map((reference) => [reference.title, reference]),
  );
  const incoming = Array.isArray(source.banners) ? source.banners.slice(0, MAX_BANNERS) : [];
  const normalized = incoming.map((banner, index) => {
    const candidate = typeof banner === "object" && banner ? banner as Partial<HomeBanner> : {};
    const fallback = candidate.id ? byId.get(candidate.id) : defaults.banners[index];

    return normalizeBanner(banner, index, fallback);
  });
  const knownIds = new Set(normalized.map((banner) => banner.id));
  const missingDefaults = defaults.banners.filter((banner) => !knownIds.has(banner.id));
  const incomingBrands = Array.isArray(source.brands)
    ? source.brands.slice(0, MAX_BRANDS)
    : defaults.brands;
  const incomingCategories = Array.isArray(source.categories)
    ? source.categories.slice(0, MAX_CATEGORIES)
    : defaults.categories;
  const incomingProducts = Array.isArray(source.products)
    ? source.products.slice(0, MAX_PRODUCTS)
    : defaults.products;
  const incomingPosts = Array.isArray(source.posts)
    ? source.posts.slice(0, MAX_POSTS)
    : defaults.posts;
  const incomingReferences = Array.isArray(source.references)
    ? source.references.slice(0, MAX_REFERENCES)
    : defaults.references;
  const normalizedBrands = uniqueBySlug(
    incomingBrands.map((brand, index) => {
      const candidate = typeof brand === "object" && brand ? brand as Partial<Brand> : {};
      const fallback = candidate.slug ? brandsBySlug.get(candidate.slug) : defaults.brands[index];

      return normalizeBrand(brand, index, fallback);
    }),
  );
  const normalizedCategories = uniqueBySlug(
    incomingCategories.map((category, index) => {
      const candidate =
        typeof category === "object" && category ? category as Partial<Category> : {};
      const fallback = candidate.slug
        ? categoriesBySlug.get(candidate.slug)
        : defaults.categories[index];

      return normalizeCategory(category, index, fallback);
    }),
  );
  const normalizedProducts = uniqueBySlug(
    incomingProducts.map((product, index) => {
      const candidate = typeof product === "object" && product ? product as Partial<Product> : {};
      const fallback = candidate.slug ? productsBySlug.get(candidate.slug) : defaults.products[index];

      return normalizeProduct(product, index, fallback);
    }),
  );
  const normalizedPosts = uniqueBySlug(
    incomingPosts.map((post, index) => {
      const candidate = typeof post === "object" && post ? post as Partial<Post> : {};
      const fallback = candidate.slug ? postsBySlug.get(candidate.slug) : defaults.posts[index];

      return normalizePost(post, index, fallback);
    }),
  );
  const normalizedReferences = incomingReferences.map((reference, index) => {
    const candidate =
      typeof reference === "object" && reference ? reference as Partial<ReferenceDocument> : {};
    const fallback = candidate.title
      ? referencesByTitle.get(candidate.title)
      : defaults.references[index];

    return normalizeReference(reference, index, fallback);
  });

  return {
    version: 1,
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : defaults.updatedAt,
    home: normalizeHomeSettings(source.home, defaults.home),
    seo: normalizeSeoSettings(source.seo, defaults.seo),
    banners: [...normalized, ...missingDefaults].sort((a, b) => a.order - b.order),
    brands: appendMissingBySlug(normalizedBrands, defaults.brands),
    categories: appendMissingBySlug(normalizedCategories, defaults.categories),
    products: appendMissingBySlug(normalizedProducts, defaults.products),
    posts: appendMissingBySlug(normalizedPosts, defaults.posts),
    references: appendMissingReferences(normalizedReferences, defaults.references),
  };
}

export async function readAdminContent() {
  try {
    const raw = await readFile(adminContentPath(), "utf8");

    return normalizeAdminContent(JSON.parse(raw));
  } catch {
    return defaultAdminContent();
  }
}

export async function writeAdminContent(value: unknown) {
  const normalized = normalizeAdminContent(value);
  const content: AdminContent = {
    ...normalized,
    updatedAt: new Date().toISOString(),
    banners: normalized.banners.map((banner, index) => ({
      ...banner,
      order: index,
    })),
    home: normalized.home,
    seo: normalized.seo,
    brands: normalized.brands,
    categories: normalized.categories,
    products: normalized.products,
    posts: normalized.posts,
    references: normalized.references,
  };

  await mkdir(dataDir(), { recursive: true });
  await writeFile(adminContentPath(), `${JSON.stringify(content, null, 2)}\n`, "utf8");

  return content;
}

export async function readHomeBanners() {
  const content = await readAdminContent();

  return content.banners
    .filter((banner) => banner.enabled)
    .sort((a, b) => a.order - b.order);
}

export async function readHomePageSettings() {
  const content = await readAdminContent();

  return content.home;
}

export async function readSeoSettings() {
  const content = await readAdminContent();

  return content.seo;
}

export async function readProducts() {
  const content = await readAdminContent();

  return content.products;
}

export async function readBrands() {
  const content = await readAdminContent();

  return content.brands;
}

export async function readCategories() {
  const content = await readAdminContent();

  return content.categories;
}

export async function readPosts() {
  const content = await readAdminContent();

  return content.posts;
}

export async function readReferenceDocuments() {
  const content = await readAdminContent();

  return content.references;
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "arnebia-local-session-secret"
  );
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) return false;

  return timingSafeEqual(left, right);
}

export function verifyAdminPassword(value: unknown) {
  const expected = adminPassword();

  if (!expected || typeof value !== "string") return false;

  return safeEqual(value, expected);
}

export function createAdminSessionCookie() {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  const token = `${payload}.${sign(payload)}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`;
}

export function clearAdminSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function isAdminRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));

  if (!cookie) return false;

  const token = decodeURIComponent(cookie.slice(SESSION_COOKIE.length + 1));
  const lastDot = token.lastIndexOf(".");

  if (lastDot < 0) return false;

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const [, expiresAtRaw] = payload.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  return safeEqual(signature, sign(payload));
}

export function adminIsConfigured() {
  return Boolean(adminPassword());
}
