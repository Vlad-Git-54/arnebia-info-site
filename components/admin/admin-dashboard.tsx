"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import type { AdminContent } from "@/lib/admin-config";
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
  Post,
  Product,
  ReferenceDocument,
  SeoSettings,
} from "@/types/content";
import { cn } from "@/lib/utils";

type AdminSummary = {
  brands: number;
  categories: number;
  posts: number;
  products: number;
  references: number;
};

type PreviewMode = "desktop" | "mobile";
type AdminTab =
  | "banners"
  | "brands"
  | "categories"
  | "products"
  | "posts"
  | "references"
  | "seo"
  | "analytics";

const aspectLabels: Record<BannerAspect, string> = {
  auto: "Авто",
  compact: "Компакт",
  photo: "Фото",
  square: "Квадрат",
  wide: "Широкий",
};

const fitLabels: Record<BannerImageFit, string> = {
  contain: "Вписать",
  cover: "Заполнить",
};

const mobileTextLabels: Record<BannerMobileTextMode, string> = {
  full: "Текст полностью",
  hidden: "Только изображение",
  title: "Только заголовок",
};

const sourceTypeLabels: Record<HomeBlockSourceType, string> = {
  brand: "Бренд",
  category: "Категория",
  custom: "Кастомный блок",
  post: "Новость / акция",
  product: "Товар",
};

const aspectRatio: Record<BannerAspect, string | undefined> = {
  auto: undefined,
  compact: "31 / 20",
  photo: "22 / 13",
  square: "1 / 1",
  wide: "2 / 1",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ordered(banners: HomeBanner[]) {
  return banners.map((banner, index) => ({ ...banner, order: index }));
}

function makeBanner() {
  const id = `banner-${Date.now()}`;

  return {
    id,
    sourceType: "custom",
    sourceSlug: undefined,
    title: "Новый баннер",
    description: "Краткое описание подборки или акции.",
    image: "/banners/catalog-products-modern.png",
    href: "/catalog",
    enabled: true,
    width: 6,
    aspect: "wide",
    imageFit: "cover",
    mobileAspect: "photo",
    mobileImageFit: "cover",
    mobileTextMode: "title",
    order: 0,
  } satisfies HomeBanner;
}

const slugMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function slugifyClient(value: string, fallback = `item-${Date.now()}`) {
  const slug = value
    .toLocaleLowerCase("ru")
    .split("")
    .map((letter) => slugMap[letter] ?? letter)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

  return slug || fallback;
}

function fromCsv(value: string) {
  const seen = new Set<string>();

  return value
    .split(/[,\n;]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLocaleLowerCase("ru");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function toCsv(items?: string[]) {
  return (items ?? []).join(", ");
}

function makeProduct(): Product {
  const id = Date.now();

  return {
    slug: `new-product-${id}`,
    title: "Новый товар",
    description: "Краткое описание продукта для каталога.",
    brand: "arnebia-selection",
    categories: ["face-care"],
    image: "/banners/catalog-products-modern.png",
    imageAlt: "Новый товар Арнебии",
    ingredients: [],
    tags: [],
    badge: "Новинка",
    isNew: true,
    isPopular: false,
    marketplaces: {
      wildberries: "",
      ozon: "",
      apteka: "",
      goldapple: "",
      letu: "",
      zdravcity: "",
      official: "",
    },
    seoTitle: "",
    seoDescription: "",
    keywords: [],
    body: "## О продукте\n\nДобавьте подробное описание, особенности состава и рекомендации.",
  };
}

function makePost(): Post {
  const id = Date.now();

  return {
    slug: `new-post-${id}`,
    title: "Новый материал",
    description: "Краткое описание новости или статьи.",
    date: new Date().toISOString().slice(0, 10),
    category: "news",
    image: "/banners/catalog-products-modern.png",
    imageAlt: "Материал Арнебии",
    tags: [],
    body: "## Заголовок раздела\n\nДобавьте текст материала.",
  };
}

function makeReference(): ReferenceDocument {
  return {
    title: "Новый справочник",
    description: "Краткое описание материала.",
    size: "PDF",
    href: "https://www.arnebia.ru/",
    image: "/references/arnebia-general-catalog.jpg",
  };
}

function makeBrand(): Brand {
  const id = Date.now();

  return {
    slug: `new-brand-${id}`,
    title: "Новый бренд",
    latin: "",
    short: "Краткое описание бренда для карточки.",
    description: "Подробное описание бренда, его экспертизы и продуктового фокуса.",
    origin: "Россия",
    focus: [],
    image: "/banners/catalog-products-modern.png",
    logoImage: "",
    logoText: "NEW BRAND",
    logoSubtext: "natural care",
    flagCodes: ["ru"],
    accent: "#7f9f57",
    featured: false,
  };
}

function makeCategory(): Category {
  const id = Date.now();

  return {
    slug: `new-category-${id}`,
    title: "Новая категория",
    description: "Краткое SEO-описание категории для каталога.",
  };
}

async function jsonRequest<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = await response.json().catch(() => null) as T | { message?: string } | null;

  if (!response.ok) {
    throw new Error((payload && "message" in payload && payload.message) || "Запрос не выполнен.");
  }

  return payload as T;
}

export function AdminDashboard({
  initialContent,
  summary,
}: {
  initialContent: AdminContent;
  summary: AdminSummary;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<AdminContent>(initialContent);
  const [selectedId, setSelectedId] = useState(initialContent.banners[0]?.id ?? "");
  const [selectedBrandSlug, setSelectedBrandSlug] = useState(initialContent.brands[0]?.slug ?? "");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialContent.categories[0]?.slug ?? "");
  const [selectedProductSlug, setSelectedProductSlug] = useState(initialContent.products[0]?.slug ?? "");
  const [selectedPostSlug, setSelectedPostSlug] = useState(initialContent.posts[0]?.slug ?? "");
  const [selectedReferenceIndex, setSelectedReferenceIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<AdminTab>("banners");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [brandQuery, setBrandQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [postQuery, setPostQuery] = useState("");
  const [referenceQuery, setReferenceQuery] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [resizing, setResizing] = useState<null | {
    id: string;
    startWidth: number;
    startX: number;
  }>(null);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const banners = content.banners;
  const currentSummary = {
    ...summary,
    brands: content.brands.length,
    categories: content.categories.length,
    posts: content.posts.length,
    products: content.products.length,
    references: content.references.length,
  };
  const selected = useMemo(
    () => banners.find((banner) => banner.id === selectedId) ?? banners[0],
    [banners, selectedId],
  );
  const selectedBrand = useMemo(
    () => content.brands.find((brand) => brand.slug === selectedBrandSlug) ?? content.brands[0],
    [content.brands, selectedBrandSlug],
  );
  const selectedCategory = useMemo(
    () =>
      content.categories.find((category) => category.slug === selectedCategorySlug) ??
      content.categories[0],
    [content.categories, selectedCategorySlug],
  );
  const selectedProduct = useMemo(
    () => content.products.find((product) => product.slug === selectedProductSlug) ?? content.products[0],
    [content.products, selectedProductSlug],
  );
  const selectedPost = useMemo(
    () => content.posts.find((post) => post.slug === selectedPostSlug) ?? content.posts[0],
    [content.posts, selectedPostSlug],
  );
  const selectedReference = content.references[selectedReferenceIndex] ?? content.references[0];
  const filteredProducts = useMemo(() => {
    const query = productQuery.trim().toLocaleLowerCase("ru");

    if (!query) return content.products;

    return content.products.filter((product) =>
      [product.title, product.slug, product.description, product.brand, ...product.tags]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(query),
    );
  }, [content.products, productQuery]);
  const filteredBrands = useMemo(() => {
    const query = brandQuery.trim().toLocaleLowerCase("ru");

    if (!query) return content.brands;

    return content.brands.filter((brand) =>
      [brand.title, brand.slug, brand.latin, brand.short, brand.origin, ...brand.focus]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(query),
    );
  }, [brandQuery, content.brands]);
  const filteredCategories = useMemo(() => {
    const query = categoryQuery.trim().toLocaleLowerCase("ru");

    if (!query) return content.categories;

    return content.categories.filter((category) =>
      [category.title, category.slug, category.description]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(query),
    );
  }, [categoryQuery, content.categories]);
  const filteredPosts = useMemo(() => {
    const query = postQuery.trim().toLocaleLowerCase("ru");

    if (!query) return content.posts;

    return content.posts.filter((post) =>
      [post.title, post.slug, post.description, post.category, ...post.tags]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(query),
    );
  }, [content.posts, postQuery]);
  const filteredReferences = useMemo(() => {
    const query = referenceQuery.trim().toLocaleLowerCase("ru");

    if (!query) return content.references.map((reference, index) => ({ reference, index }));

    return content.references
      .map((reference, index) => ({ reference, index }))
      .filter(({ reference }) =>
        [reference.title, reference.description, reference.href]
          .join(" ")
          .toLocaleLowerCase("ru")
          .includes(query),
      );
  }, [content.references, referenceQuery]);

  useEffect(() => {
    void jsonRequest<{ authenticated: boolean; configured: boolean }>("/api/admin/session")
      .then((session) => {
        setConfigured(session.configured);
        setAuthenticated(session.authenticated);
        if (session.authenticated) {
          return jsonRequest<AdminContent>("/api/admin/content").then((fresh) => {
            setContent(fresh);
            setSelectedId(fresh.banners[0]?.id ?? "");
            setSelectedBrandSlug(fresh.brands[0]?.slug ?? "");
            setSelectedCategorySlug(fresh.categories[0]?.slug ?? "");
            setSelectedProductSlug(fresh.products[0]?.slug ?? "");
            setSelectedPostSlug(fresh.posts[0]?.slug ?? "");
            setSelectedReferenceIndex(0);
          });
        }

        return undefined;
      })
      .catch(() => {
        setAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    if (!resizing) return undefined;

    function onPointerMove(event: PointerEvent) {
      const delta = Math.round((event.clientX - resizing.startX) / 84);
      const width = clamp(resizing.startWidth + delta, 3, 12);

      setContent((current) => ({
        ...current,
        banners: ordered(
          current.banners.map((banner) =>
            banner.id === resizing.id ? { ...banner, width } : banner,
          ),
        ),
      }));
    }

    function onPointerUp() {
      setResizing(null);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [resizing]);

  function setBanners(next: HomeBanner[]) {
    setContent((current) => ({
      ...current,
      banners: ordered(next),
    }));
  }

  function updateBanner(id: string, patch: Partial<HomeBanner>) {
    setBanners(banners.map((banner) => (banner.id === id ? { ...banner, ...patch } : banner)));
  }

  function updateHome(patch: Partial<HomePageSettings>) {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        ...patch,
      },
    }));
  }

  function updateSeo(patch: Partial<SeoSettings>) {
    setContent((current) => ({
      ...current,
      seo: {
        ...current.seo,
        ...patch,
      },
    }));
  }

  function updateFact(index: number, patch: Partial<HomeFact>) {
    updateHome({
      facts: content.home.facts.map((fact, itemIndex) =>
        itemIndex === index ? { ...fact, ...patch } : fact,
      ),
    });
  }

  function addFact() {
    updateHome({
      facts: [...content.home.facts, { value: "1", label: "Новый показатель" }],
    });
  }

  function removeFact(index: number) {
    updateHome({
      facts: content.home.facts.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  function updateDirection(index: number, patch: Partial<HomeDirection>) {
    updateHome({
      directions: content.home.directions.map((direction, itemIndex) =>
        itemIndex === index ? { ...direction, ...patch } : direction,
      ),
    });
  }

  function addDirection() {
    updateHome({
      directions: [
        ...content.home.directions,
        { title: "Новое направление", text: "Краткое описание направления." },
      ],
    });
  }

  function removeDirection(index: number) {
    updateHome({
      directions: content.home.directions.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  function applyBannerSource(
    id: string,
    sourceType: HomeBlockSourceType,
    sourceSlug: string,
  ) {
    const source =
      sourceType === "product"
        ? content.products.find((item) => item.slug === sourceSlug)
        : sourceType === "post"
          ? content.posts.find((item) => item.slug === sourceSlug)
          : sourceType === "brand"
            ? content.brands.find((item) => item.slug === sourceSlug)
            : sourceType === "category"
              ? content.categories.find((item) => item.slug === sourceSlug)
              : undefined;

    if (!source || sourceType === "custom") {
      updateBanner(id, { sourceSlug, sourceType });
      return;
    }

    updateBanner(id, {
      sourceSlug,
      sourceType,
      title: source.title,
      description: "description" in source ? source.description : source.short,
      href:
        sourceType === "product"
          ? `/catalog/${source.slug}`
          : sourceType === "post"
            ? `/news/${source.slug}`
            : sourceType === "brand"
              ? `/brands/${source.slug}`
              : `/catalog/category/${source.slug}`,
      image: "image" in source ? source.image : "/banners/catalog-products-modern.png",
    });
  }

  function moveBanner(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;

    const sourceIndex = banners.findIndex((banner) => banner.id === sourceId);
    const targetIndex = banners.findIndex((banner) => banner.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) return;

    const next = [...banners];
    const [removed] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, removed);
    setBanners(next);
  }

  async function login() {
    setNotice("");

    try {
      await jsonRequest<{ ok: true }>("/api/admin/login", {
        body: JSON.stringify({ password }),
        method: "POST",
      });
      const fresh = await jsonRequest<AdminContent>("/api/admin/content");
      setAuthenticated(true);
      setContent(fresh);
      setSelectedId(fresh.banners[0]?.id ?? "");
      setSelectedBrandSlug(fresh.brands[0]?.slug ?? "");
      setSelectedCategorySlug(fresh.categories[0]?.slug ?? "");
      setSelectedProductSlug(fresh.products[0]?.slug ?? "");
      setSelectedPostSlug(fresh.posts[0]?.slug ?? "");
      setSelectedReferenceIndex(0);
      setNotice("Вход выполнен.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Не удалось войти.");
    }
  }

  async function logout() {
    await jsonRequest<{ ok: true }>("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
  }

  async function save() {
    setSaving(true);
    setNotice("");

    try {
      const fresh = await jsonRequest<AdminContent>("/api/admin/content", {
        body: JSON.stringify({ ...content, banners: ordered(content.banners) }),
        method: "PUT",
      });
      setContent(fresh);
      setNotice("Сохранено. Сайт уже читает обновленный контент.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Не удалось сохранить.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAsset(file: File) {
    const form = new FormData();
    form.append("file", file);
    setNotice("");

    const response = await fetch("/api/admin/upload", {
      body: form,
      method: "POST",
    });
    const payload = await response.json().catch(() => null) as { message?: string; url?: string } | null;

    if (!response.ok || !payload?.url) {
      setNotice(payload?.message ?? "Не удалось загрузить изображение.");
      return null;
    }

    setNotice("Изображение загружено.");
    return payload.url;
  }

  async function uploadImage(file: File, bannerId: string) {
    const url = await uploadAsset(file);

    if (url) updateBanner(bannerId, { image: url });
  }

  function duplicateBanner(banner: HomeBanner) {
    const copy = {
      ...banner,
      id: `${banner.id}-${Date.now()}`,
      title: `${banner.title} копия`,
      order: banners.length,
    };

    setBanners([...banners, copy]);
    setSelectedId(copy.id);
  }

  function removeBanner(id: string) {
    const next = banners.filter((banner) => banner.id !== id);
    setBanners(next);
    setSelectedId(next[0]?.id ?? "");
  }

  function setBrands(next: Brand[]) {
    setContent((current) => ({
      ...current,
      brands: next,
    }));
  }

  function updateBrand(slug: string, patch: Partial<Brand>) {
    setBrands(content.brands.map((brand) => (brand.slug === slug ? { ...brand, ...patch } : brand)));
  }

  function addBrand() {
    const brand = makeBrand();
    setBrands([brand, ...content.brands]);
    setSelectedBrandSlug(brand.slug);
    setActiveTab("brands");
  }

  function duplicateBrand(brand: Brand) {
    const copy = {
      ...brand,
      slug: `${brand.slug}-${Date.now()}`,
      title: `${brand.title} копия`,
      featured: false,
    };
    setBrands([copy, ...content.brands]);
    setSelectedBrandSlug(copy.slug);
  }

  function removeBrand(slug: string) {
    const brand = content.brands.find((item) => item.slug === slug);
    if (brand && !window.confirm(`Удалить бренд «${brand.title}»? Товары этого бренда останутся в каталоге.`)) return;

    const next = content.brands.filter((item) => item.slug !== slug);
    setBrands(next);
    setSelectedBrandSlug(next[0]?.slug ?? "");
  }

  function setCategories(next: Category[]) {
    setContent((current) => ({
      ...current,
      categories: next,
    }));
  }

  function updateCategory(slug: string, patch: Partial<Category>) {
    setCategories(
      content.categories.map((category) =>
        category.slug === slug ? { ...category, ...patch } : category,
      ),
    );
  }

  function addCategory() {
    const category = makeCategory();
    setCategories([category, ...content.categories]);
    setSelectedCategorySlug(category.slug);
    setActiveTab("categories");
  }

  function duplicateCategory(category: Category) {
    const copy = {
      ...category,
      slug: `${category.slug}-${Date.now()}`,
      title: `${category.title} копия`,
    };
    setCategories([copy, ...content.categories]);
    setSelectedCategorySlug(copy.slug);
  }

  function removeCategory(slug: string) {
    const category = content.categories.find((item) => item.slug === slug);
    if (category && !window.confirm(`Удалить категорию «${category.title}»? Товары этой категории останутся в каталоге.`)) return;

    const next = content.categories.filter((item) => item.slug !== slug);
    setCategories(next);
    setSelectedCategorySlug(next[0]?.slug ?? "");
  }

  function setProducts(next: Product[]) {
    setContent((current) => ({
      ...current,
      products: next,
    }));
  }

  function updateProduct(slug: string, patch: Partial<Product>) {
    setProducts(
      content.products.map((product) =>
        product.slug === slug ? { ...product, ...patch } : product,
      ),
    );
  }

  function addProduct() {
    const product = makeProduct();
    setProducts([product, ...content.products]);
    setSelectedProductSlug(product.slug);
    setActiveTab("products");
  }

  function duplicateProduct(product: Product) {
    const copy = {
      ...product,
      slug: `${product.slug}-${Date.now()}`,
      title: `${product.title} копия`,
      isNew: true,
    };
    setProducts([copy, ...content.products]);
    setSelectedProductSlug(copy.slug);
  }

  function removeProduct(slug: string) {
    const product = content.products.find((item) => item.slug === slug);
    if (product && !window.confirm(`Удалить товар «${product.title}»?`)) return;

    const next = content.products.filter((item) => item.slug !== slug);
    setProducts(next);
    setSelectedProductSlug(next[0]?.slug ?? "");
  }

  function setPosts(next: Post[]) {
    setContent((current) => ({
      ...current,
      posts: next,
    }));
  }

  function updatePost(slug: string, patch: Partial<Post>) {
    setPosts(content.posts.map((post) => (post.slug === slug ? { ...post, ...patch } : post)));
  }

  function addPost() {
    const post = makePost();
    setPosts([post, ...content.posts]);
    setSelectedPostSlug(post.slug);
    setActiveTab("posts");
  }

  function duplicatePost(post: Post) {
    const copy = {
      ...post,
      slug: `${post.slug}-${Date.now()}`,
      title: `${post.title} копия`,
    };
    setPosts([copy, ...content.posts]);
    setSelectedPostSlug(copy.slug);
  }

  function removePost(slug: string) {
    const post = content.posts.find((item) => item.slug === slug);
    if (post && !window.confirm(`Удалить материал «${post.title}»?`)) return;

    const next = content.posts.filter((item) => item.slug !== slug);
    setPosts(next);
    setSelectedPostSlug(next[0]?.slug ?? "");
  }

  function setReferences(next: ReferenceDocument[]) {
    setContent((current) => ({
      ...current,
      references: next,
    }));
  }

  function updateReference(index: number, patch: Partial<ReferenceDocument>) {
    setReferences(
      content.references.map((reference, itemIndex) =>
        itemIndex === index ? { ...reference, ...patch } : reference,
      ),
    );
  }

  function addReference() {
    const reference = makeReference();
    setReferences([reference, ...content.references]);
    setSelectedReferenceIndex(0);
    setActiveTab("references");
  }

  function duplicateReference(reference: ReferenceDocument) {
    const copy = {
      ...reference,
      title: `${reference.title} копия`,
    };
    setReferences([copy, ...content.references]);
    setSelectedReferenceIndex(0);
  }

  function removeReference(index: number) {
    const reference = content.references[index];
    if (reference && !window.confirm(`Удалить справочник «${reference.title}»?`)) return;

    const next = content.references.filter((_, itemIndex) => itemIndex !== index);
    setReferences(next);
    setSelectedReferenceIndex(0);
  }

  function resetToDefaults() {
    setContent(initialContent);
    setSelectedId(initialContent.banners[0]?.id ?? "");
    setSelectedBrandSlug(initialContent.brands[0]?.slug ?? "");
    setSelectedCategorySlug(initialContent.categories[0]?.slug ?? "");
    setSelectedProductSlug(initialContent.products[0]?.slug ?? "");
    setSelectedPostSlug(initialContent.posts[0]?.slug ?? "");
    setSelectedReferenceIndex(0);
    setNotice("Вернули настройки по умолчанию. Нажмите «Сохранить», чтобы применить.");
  }

  if (!authenticated) {
    return (
      <main className="fixed inset-0 z-[100] grid place-items-center overflow-auto bg-[#f5f1e7] px-4 py-10">
        <div className="w-full max-w-md rounded-md border border-stone-200 bg-white p-6 shadow-2xl">
          <Image
            alt="Арнебия"
            className="h-auto w-44"
            height={85}
            src="/brand/arnebia-logo.svg"
            unoptimized
            width={330}
          />
          <h1 className="mt-8 text-3xl font-semibold text-stone-950">Админка Арнебии</h1>
          <p className="mt-3 text-sm leading-7 text-stone-650">
            Войдите, чтобы управлять баннерами, материалами и настройками сайта.
          </p>
          {!configured ? (
            <div className="mt-6 rounded-md border border-clay-500/30 bg-clay-500/10 p-4 text-sm leading-7 text-clay-700">
              На сервере не задана переменная ADMIN_PASSWORD.
            </div>
          ) : null}
          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void login();
            }}
          >
            <label className="form-field">
              <span>Пароль</span>
              <input
                autoComplete="current-password"
                disabled={!configured}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Введите пароль"
                type="password"
                value={password}
              />
            </label>
            <button className="primary-link justify-center" disabled={!configured} type="submit">
              <Icon className="h-4 w-4" name="check" />
              <span>Войти</span>
            </button>
          </form>
          {notice ? <p className="mt-4 text-sm font-semibold text-clay-700">{notice}</p> : null}
          <Link className="secondary-link mt-5 justify-center" href="/">
            <Icon className="h-4 w-4" name="arrow" />
            <span>На сайт</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-[100] overflow-auto bg-[#f6f3eb] text-stone-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-stone-200 bg-stone-950 px-4 py-5 text-white">
          <Link className="inline-flex rounded-md bg-white px-3 py-2" href="/">
            <Image alt="Арнебия" height={85} src="/brand/arnebia-logo.svg" unoptimized width={210} />
          </Link>
          <nav className="mt-8 grid gap-2">
            {[
              ["banners", "Главная"],
              ["brands", "Бренды"],
              ["categories", "Категории"],
              ["products", "Товары"],
              ["posts", "Новости"],
              ["references", "Справочники"],
              ["seo", "SEO-продвижение"],
              ["analytics", "Аналитика"],
            ].map(([id, label]) => (
              <button
                className={cn(
                  "rounded-md px-3 py-3 text-left text-sm font-semibold transition",
                  activeTab === id ? "bg-white text-stone-950" : "text-stone-200 hover:bg-white/10",
                )}
                key={id}
                onClick={() => setActiveTab(id as AdminTab)}
                type="button"
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-8 grid gap-2 rounded-md border border-white/10 bg-white/5 p-3 text-sm text-stone-200">
            <p>Товаров: {currentSummary.products}</p>
            <p>Брендов: {currentSummary.brands}</p>
            <p>Новостей: {currentSummary.posts}</p>
            <p>Справочников: {currentSummary.references}</p>
          </div>
        </aside>

        <section className="grid min-h-screen grid-rows-[auto_1fr]">
          <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/92 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">
                  Панель управления
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-stone-950">
                  Контент сайта
                </h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link className="secondary-link" href="/" target="_blank">
                  <Icon className="h-4 w-4" name="external" />
                  <span>Открыть сайт</span>
                </Link>
                <button className="secondary-link" onClick={() => void logout()} type="button">
                  <span>Выйти</span>
                </button>
                <button className="primary-link" disabled={saving} onClick={() => void save()} type="button">
                  <Icon className="h-4 w-4" name="check" />
                  <span>{saving ? "Сохраняю" : "Сохранить"}</span>
                </button>
              </div>
            </div>
            {notice ? (
              <p className="mt-3 rounded-md border border-olive-200 bg-olive-50 px-3 py-2 text-sm font-semibold text-olive-900">
                {notice}
              </p>
            ) : null}
          </header>

          {activeTab === "banners" ? (
            <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[1fr_360px]">
              <section className="min-w-0">
                <HomeSettingsPanel
                  addDirection={addDirection}
                  addFact={addFact}
                  home={content.home}
                  products={content.products}
                  removeDirection={removeDirection}
                  removeFact={removeFact}
                  updateDirection={updateDirection}
                  updateFact={updateFact}
                  updateHome={updateHome}
                />
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex rounded-md border border-stone-200 bg-white p-1 shadow-sm">
                    {(["desktop", "mobile"] as const).map((mode) => (
                      <button
                        className={cn(
                          "rounded px-4 py-2 text-sm font-semibold transition",
                          previewMode === mode ? "bg-stone-950 text-white" : "text-stone-650 hover:bg-linen-100",
                        )}
                        key={mode}
                        onClick={() => setPreviewMode(mode)}
                        type="button"
                      >
                        {mode === "desktop" ? "Desktop" : "Mobile"}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="secondary-link"
                      onClick={() => {
                        const banner = makeBanner();
                        setBanners([...banners, banner]);
                        setSelectedId(banner.id);
                      }}
                      type="button"
                    >
                      <span>Добавить баннер</span>
                    </button>
                    <button className="secondary-link" onClick={resetToDefaults} type="button">
                      <span>Сбросить</span>
                    </button>
                  </div>
                </div>
                <div className="mb-4 rounded-md border border-olive-200 bg-olive-50 px-4 py-3 text-sm leading-7 text-olive-900">
                  {previewMode === "mobile"
                    ? "Мобильный предпросмотр показывает, как баннеры будут выглядеть на телефоне. Если карточка получается слишком высокой, поменяйте «Формат Mobile», «Картинка Mobile» или «Текст на Mobile» справа."
                    : "На desktop баннеры можно перетаскивать мышью, менять порядок и растягивать за правый нижний маркер. Точную ширину можно задать справа."}
                </div>

                <div
                  className={cn(
                    "rounded-md border border-stone-200 bg-white p-4 shadow-sm transition-all",
                    previewMode === "mobile" ? "mx-auto max-w-[430px]" : "w-full",
                  )}
                >
                  <div
                    className={cn(
                      "grid gap-4",
                      previewMode === "mobile" ? "grid-cols-1" : "grid-cols-12",
                    )}
                  >
                    {banners.map((banner) => (
                      <article
                        className={cn(
                          "group relative overflow-hidden rounded-md border bg-linen-50 shadow-sm transition",
                          banner.enabled ? "border-stone-200" : "border-stone-200 opacity-45",
                          selected?.id === banner.id ? "ring-2 ring-olive-600" : "hover:-translate-y-0.5",
                        )}
                        draggable
                        key={banner.id}
                        onClick={() => setSelectedId(banner.id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDragStart={() => setDraggedId(banner.id)}
                        onDrop={() => {
                          if (draggedId) moveBanner(draggedId, banner.id);
                          setDraggedId(null);
                        }}
                        style={
                          previewMode === "desktop"
                            ? { gridColumn: `span ${banner.width} / span ${banner.width}` }
                            : undefined
                        }
                      >
                        <div
                          className="relative bg-gradient-to-br from-white to-linen-100"
                          style={{
                            aspectRatio:
                              aspectRatio[
                                previewMode === "mobile" ? banner.mobileAspect : banner.aspect
                              ],
                            minHeight:
                              (previewMode === "mobile" ? banner.mobileAspect : banner.aspect) === "auto"
                                ? 220
                                : undefined,
                          }}
                        >
                          <Image
                            alt={banner.title}
                            className="h-full w-full p-2 transition group-hover:scale-[1.01]"
                            fill
                            src={banner.image}
                            style={{
                              objectFit:
                                previewMode === "mobile" ? banner.mobileImageFit : banner.imageFit,
                            }}
                            unoptimized
                          />
                          <div className="absolute left-2 top-2 inline-flex items-center gap-2 rounded-md bg-stone-950/82 px-2 py-1 text-xs font-semibold text-white">
                            <span>{banner.width}/12</span>
                          </div>
                          {previewMode === "desktop" ? (
                            <button
                              aria-label="Изменить ширину"
                              className="absolute bottom-2 right-2 hidden h-10 w-3 cursor-ew-resize rounded bg-olive-800/80 group-hover:block"
                              onPointerDown={(event) => {
                                event.preventDefault();
                                setResizing({
                                  id: banner.id,
                                  startWidth: banner.width,
                                  startX: event.clientX,
                                });
                              }}
                              type="button"
                            />
                          ) : null}
                        </div>
                        {previewMode === "mobile" && banner.mobileTextMode === "hidden" ? null : (
                          <div className="grid gap-2 border-t border-stone-200 bg-white p-4">
                            <p className="text-base font-semibold leading-tight">{banner.title}</p>
                            {previewMode === "desktop" || banner.mobileTextMode === "full" ? (
                              <p className="text-sm leading-6 text-stone-650">{banner.description}</p>
                            ) : null}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <aside className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
                {selected ? (
                  <div className="grid gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">
                          Выбранный баннер
                        </p>
                        <h2 className="mt-1 text-xl font-semibold">{selected.title}</h2>
                      </div>
                      <label className="inline-flex items-center gap-2 text-sm font-semibold">
                        <input
                          checked={selected.enabled}
                          onChange={(event) => updateBanner(selected.id, { enabled: event.target.checked })}
                          type="checkbox"
                        />
                        Вкл.
                      </label>
                    </div>

                    <div className="grid gap-3 rounded-md border border-stone-200 bg-linen-50 p-3">
                      <label className="form-field">
                        <span>Тип блока на главной</span>
                        <select
                          onChange={(event) => {
                            const sourceType = event.target.value as HomeBlockSourceType;
                            applyBannerSource(selected.id, sourceType, "");
                          }}
                          value={selected.sourceType}
                        >
                          {Object.entries(sourceTypeLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                      {selected.sourceType !== "custom" ? (
                        <label className="form-field">
                          <span>Источник контента</span>
                          <select
                            onChange={(event) =>
                              applyBannerSource(selected.id, selected.sourceType, event.target.value)
                            }
                            value={selected.sourceSlug ?? ""}
                          >
                            <option value="">Выберите источник</option>
                            {selected.sourceType === "product"
                              ? content.products.map((product) => (
                                  <option key={product.slug} value={product.slug}>
                                    {product.title}
                                  </option>
                                ))
                              : null}
                            {selected.sourceType === "post"
                              ? content.posts.map((post) => (
                                  <option key={post.slug} value={post.slug}>
                                    {post.title}
                                  </option>
                                ))
                              : null}
                            {selected.sourceType === "brand"
                              ? content.brands.map((brand) => (
                                  <option key={brand.slug} value={brand.slug}>
                                    {brand.title}
                                  </option>
                                ))
                              : null}
                            {selected.sourceType === "category"
                              ? content.categories.map((category) => (
                                  <option key={category.slug} value={category.slug}>
                                    {category.title}
                                  </option>
                                ))
                              : null}
                          </select>
                        </label>
                      ) : null}
                    </div>

                    <label className="form-field">
                      <span>Заголовок</span>
                      <input
                        onChange={(event) => updateBanner(selected.id, { title: event.target.value })}
                        value={selected.title}
                      />
                    </label>
                    <label className="form-field">
                      <span>Описание</span>
                      <textarea
                        onChange={(event) => updateBanner(selected.id, { description: event.target.value })}
                        rows={4}
                        value={selected.description}
                      />
                    </label>
                    <label className="form-field">
                      <span>Ссылка</span>
                      <input
                        onChange={(event) => updateBanner(selected.id, { href: event.target.value })}
                        value={selected.href}
                      />
                    </label>
                    <label className="form-field">
                      <span>Изображение</span>
                      <input
                        onChange={(event) => updateBanner(selected.id, { image: event.target.value })}
                        value={selected.image}
                      />
                    </label>
                    <label className="form-field">
                      <span>Загрузить файл</span>
                      <input
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void uploadImage(file, selected.id);
                        }}
                        type="file"
                      />
                    </label>

                    <div className="grid gap-3 rounded-md border border-stone-200 bg-linen-50 p-3">
                      <label className="form-field">
                        <span>Ширина на ПК: {selected.width}/12</span>
                        <input
                          max={12}
                          min={3}
                          onChange={(event) => updateBanner(selected.id, { width: Number(event.target.value) })}
                          type="range"
                          value={selected.width}
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className="secondary-link justify-center"
                          onClick={() => updateBanner(selected.id, { width: clamp(selected.width - 1, 3, 12) })}
                          type="button"
                        >
                          Уже
                        </button>
                        <button
                          className="secondary-link justify-center"
                          onClick={() => updateBanner(selected.id, { width: clamp(selected.width + 1, 3, 12) })}
                          type="button"
                        >
                          Шире
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="form-field">
                        <span>Формат ПК</span>
                        <select
                          onChange={(event) => updateBanner(selected.id, { aspect: event.target.value as BannerAspect })}
                          value={selected.aspect}
                        >
                          {Object.entries(aspectLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </label>
                      <label className="form-field">
                        <span>Картинка ПК</span>
                        <select
                          onChange={(event) => updateBanner(selected.id, { imageFit: event.target.value as BannerImageFit })}
                          value={selected.imageFit}
                        >
                          {Object.entries(fitLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </label>
                      <label className="form-field">
                        <span>Формат Mobile</span>
                        <select
                          onChange={(event) => updateBanner(selected.id, { mobileAspect: event.target.value as BannerAspect })}
                          value={selected.mobileAspect}
                        >
                          {Object.entries(aspectLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </label>
                      <label className="form-field">
                        <span>Картинка Mobile</span>
                        <select
                          onChange={(event) => updateBanner(selected.id, { mobileImageFit: event.target.value as BannerImageFit })}
                          value={selected.mobileImageFit}
                        >
                          {Object.entries(fitLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="form-field">
                      <span>Текст на Mobile</span>
                      <select
                        onChange={(event) => updateBanner(selected.id, { mobileTextMode: event.target.value as BannerMobileTextMode })}
                        value={selected.mobileTextMode}
                      >
                        {Object.entries(mobileTextLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button className="secondary-link justify-center" onClick={() => duplicateBanner(selected)} type="button">
                        Дублировать
                      </button>
                      <button className="secondary-link justify-center" onClick={() => removeBanner(selected.id)} type="button">
                        Удалить
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-stone-650">Выберите баннер.</p>
                )}
              </aside>
            </div>
          ) : null}

          {activeTab === "brands" ? (
            <BrandsEditor
              addBrand={addBrand}
              duplicateBrand={duplicateBrand}
              filteredBrands={filteredBrands}
              brandQuery={brandQuery}
              removeBrand={removeBrand}
              selectedBrand={selectedBrand}
              selectedBrandSlug={selectedBrandSlug}
              setBrandQuery={setBrandQuery}
              setSelectedBrandSlug={setSelectedBrandSlug}
              updateBrand={updateBrand}
              uploadAsset={uploadAsset}
            />
          ) : null}

          {activeTab === "categories" ? (
            <CategoriesEditor
              addCategory={addCategory}
              categoryQuery={categoryQuery}
              duplicateCategory={duplicateCategory}
              filteredCategories={filteredCategories}
              removeCategory={removeCategory}
              selectedCategory={selectedCategory}
              selectedCategorySlug={selectedCategorySlug}
              setCategoryQuery={setCategoryQuery}
              setSelectedCategorySlug={setSelectedCategorySlug}
              updateCategory={updateCategory}
            />
          ) : null}

          {activeTab === "products" ? (
            <ProductsEditor
              addProduct={addProduct}
              catalogBrands={content.brands}
              catalogCategories={content.categories}
              duplicateProduct={duplicateProduct}
              filteredProducts={filteredProducts}
              productQuery={productQuery}
              removeProduct={removeProduct}
              selectedProduct={selectedProduct}
              selectedProductSlug={selectedProductSlug}
              setProductQuery={setProductQuery}
              setSelectedProductSlug={setSelectedProductSlug}
              updateProduct={updateProduct}
              uploadAsset={uploadAsset}
            />
          ) : null}

          {activeTab === "posts" ? (
            <PostsEditor
              addPost={addPost}
              duplicatePost={duplicatePost}
              filteredPosts={filteredPosts}
              postQuery={postQuery}
              removePost={removePost}
              selectedPost={selectedPost}
              selectedPostSlug={selectedPostSlug}
              setPostQuery={setPostQuery}
              setSelectedPostSlug={setSelectedPostSlug}
              updatePost={updatePost}
              uploadAsset={uploadAsset}
            />
          ) : null}

          {activeTab === "references" ? (
            <ReferencesEditor
              addReference={addReference}
              duplicateReference={duplicateReference}
              filteredReferences={filteredReferences}
              referenceQuery={referenceQuery}
              removeReference={removeReference}
              selectedReference={selectedReference}
              selectedReferenceIndex={selectedReferenceIndex}
              setReferenceQuery={setReferenceQuery}
              setSelectedReferenceIndex={setSelectedReferenceIndex}
              updateReference={updateReference}
              uploadAsset={uploadAsset}
            />
          ) : null}

          {activeTab === "seo" ? (
            <SeoEditor
              products={content.products}
              seo={content.seo}
              updateSeo={updateSeo}
              uploadAsset={uploadAsset}
            />
          ) : null}
          {activeTab === "analytics" ? (
            <AnalyticsEditor seo={content.seo} updateSeo={updateSeo} />
          ) : null}
        </section>
      </div>
    </main>
  );
}

function ToggleRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-semibold">
      <span>{label}</span>
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
    </label>
  );
}

function HomeSettingsPanel({
  addDirection,
  addFact,
  home,
  products,
  removeDirection,
  removeFact,
  updateDirection,
  updateFact,
  updateHome,
}: {
  addDirection: () => void;
  addFact: () => void;
  home: HomePageSettings;
  products: Product[];
  removeDirection: (index: number) => void;
  removeFact: (index: number) => void;
  updateDirection: (index: number, patch: Partial<HomeDirection>) => void;
  updateFact: (index: number, patch: Partial<HomeFact>) => void;
  updateHome: (patch: Partial<HomePageSettings>) => void;
}) {
  return (
    <details className="mb-5 rounded-md border border-stone-200 bg-white p-4 shadow-sm" open>
      <summary className="cursor-pointer text-lg font-semibold text-stone-950">
        Настройки главной страницы
      </summary>
      <div className="mt-5 grid gap-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="form-field">
            <span>Надзаголовок hero</span>
            <input
              onChange={(event) => updateHome({ heroEyebrow: event.target.value })}
              value={home.heroEyebrow}
            />
          </label>
          <label className="form-field">
            <span>Главный заголовок</span>
            <input
              onChange={(event) => updateHome({ heroTitle: event.target.value })}
              value={home.heroTitle}
            />
          </label>
        </div>
        <label className="form-field">
          <span>Крупный текст hero</span>
          <textarea
            onChange={(event) => updateHome({ heroLead: event.target.value })}
            rows={2}
            value={home.heroLead}
          />
        </label>
        <label className="form-field">
          <span>Описание hero</span>
          <textarea
            onChange={(event) => updateHome({ heroDescription: event.target.value })}
            rows={3}
            value={home.heroDescription}
          />
        </label>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="form-field">
            <span>Основная кнопка</span>
            <input
              onChange={(event) => updateHome({ primaryCtaLabel: event.target.value })}
              value={home.primaryCtaLabel}
            />
          </label>
          <label className="form-field">
            <span>Ссылка основной кнопки</span>
            <input
              onChange={(event) => updateHome({ primaryCtaHref: event.target.value })}
              value={home.primaryCtaHref}
            />
          </label>
          <label className="form-field">
            <span>Вторая кнопка</span>
            <input
              onChange={(event) => updateHome({ secondaryCtaLabel: event.target.value })}
              value={home.secondaryCtaLabel}
            />
          </label>
          <label className="form-field">
            <span>Ссылка второй кнопки</span>
            <input
              onChange={(event) => updateHome({ secondaryCtaHref: event.target.value })}
              value={home.secondaryCtaHref}
            />
          </label>
        </div>

        <div className="grid gap-3 rounded-md border border-stone-200 bg-linen-50 p-3">
          <p className="text-sm font-bold text-stone-700">Товары в первом экране</p>
          <div className="grid gap-2 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <label className="form-field" key={index}>
                <span>Товар {index + 1}</span>
                <select
                  onChange={(event) => {
                    const next = [...home.heroProductSlugs];
                    next[index] = event.target.value;
                    updateHome({ heroProductSlugs: next.filter(Boolean) });
                  }}
                  value={home.heroProductSlugs[index] ?? ""}
                >
                  <option value="">Не показывать</option>
                  {products.map((product) => (
                    <option key={product.slug} value={product.slug}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-3 rounded-md border border-stone-200 bg-linen-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-stone-700">Видимость секций</p>
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <ToggleRow checked={home.showHero} label="Hero" onChange={(value) => updateHome({ showHero: value })} />
            <ToggleRow checked={home.showFacts} label="Показатели" onChange={(value) => updateHome({ showFacts: value })} />
            <ToggleRow checked={home.showBlocks} label="Блоки/баннеры" onChange={(value) => updateHome({ showBlocks: value })} />
            <ToggleRow checked={home.showDirections} label="Направления" onChange={(value) => updateHome({ showDirections: value })} />
            <ToggleRow checked={home.showBrands} label="Бренды" onChange={(value) => updateHome({ showBrands: value })} />
            <ToggleRow checked={home.showProducts} label="Товары" onChange={(value) => updateHome({ showProducts: value })} />
            <ToggleRow checked={home.showWhy} label="Почему Арнебия" onChange={(value) => updateHome({ showWhy: value })} />
            <ToggleRow checked={home.showPosts} label="Новости" onChange={(value) => updateHome({ showPosts: value })} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionTextSettings
            description={home.brandsDescription}
            eyebrow={home.brandsEyebrow}
            title={home.brandsTitle}
            onChange={(patch) =>
              updateHome({
                brandsDescription: patch.description ?? home.brandsDescription,
                brandsEyebrow: patch.eyebrow ?? home.brandsEyebrow,
                brandsTitle: patch.title ?? home.brandsTitle,
              })
            }
            name="Секция брендов"
          />
          <SectionTextSettings
            description={home.productsDescription}
            eyebrow={home.productsEyebrow}
            title={home.productsTitle}
            onChange={(patch) =>
              updateHome({
                productsDescription: patch.description ?? home.productsDescription,
                productsEyebrow: patch.eyebrow ?? home.productsEyebrow,
                productsTitle: patch.title ?? home.productsTitle,
              })
            }
            name="Секция товаров"
          />
          <SectionTextSettings
            description={home.postsDescription}
            eyebrow={home.postsEyebrow}
            title={home.postsTitle}
            onChange={(patch) =>
              updateHome({
                postsDescription: patch.description ?? home.postsDescription,
                postsEyebrow: patch.eyebrow ?? home.postsEyebrow,
                postsTitle: patch.title ?? home.postsTitle,
              })
            }
            name="Секция новостей"
          />
          <div className="grid gap-3 rounded-md border border-stone-200 bg-white p-3">
            <p className="text-sm font-bold text-stone-700">Лимиты</p>
            <label className="form-field">
              <span>Сколько товаров показывать</span>
              <input
                max={18}
                min={1}
                onChange={(event) => updateHome({ productsLimit: Number(event.target.value) })}
                type="number"
                value={home.productsLimit}
              />
            </label>
            <label className="form-field">
              <span>Сколько новостей показывать</span>
              <input
                max={12}
                min={1}
                onChange={(event) => updateHome({ postsLimit: Number(event.target.value) })}
                type="number"
                value={home.postsLimit}
              />
            </label>
          </div>
        </div>

        <div className="grid gap-3 rounded-md border border-stone-200 bg-linen-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-stone-700">Показатели компании</p>
            <button className="secondary-link" onClick={addFact} type="button">
              Добавить
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {home.facts.map((fact, index) => (
              <div className="grid gap-2 rounded-md border border-stone-200 bg-white p-3" key={index}>
                <input
                  className="rounded border border-stone-200 bg-linen-50 px-3 py-2 text-sm font-semibold"
                  onChange={(event) => updateFact(index, { value: event.target.value })}
                  value={fact.value}
                />
                <textarea
                  className="rounded border border-stone-200 bg-linen-50 px-3 py-2 text-sm"
                  onChange={(event) => updateFact(index, { label: event.target.value })}
                  rows={2}
                  value={fact.label}
                />
                <button className="secondary-link justify-center" onClick={() => removeFact(index)} type="button">
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 rounded-md border border-stone-200 bg-linen-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-stone-700">Направления</p>
            <button className="secondary-link" onClick={addDirection} type="button">
              Добавить
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {home.directions.map((direction, index) => (
              <div className="grid gap-2 rounded-md border border-stone-200 bg-white p-3" key={index}>
                <input
                  className="rounded border border-stone-200 bg-linen-50 px-3 py-2 text-sm font-semibold"
                  onChange={(event) => updateDirection(index, { title: event.target.value })}
                  value={direction.title}
                />
                <textarea
                  className="rounded border border-stone-200 bg-linen-50 px-3 py-2 text-sm"
                  onChange={(event) => updateDirection(index, { text: event.target.value })}
                  rows={3}
                  value={direction.text}
                />
                <button className="secondary-link justify-center" onClick={() => removeDirection(index)} type="button">
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 rounded-md border border-stone-200 bg-white p-3">
          <label className="form-field">
            <span>Заголовок блока «Почему Арнебия»</span>
            <input
              onChange={(event) => updateHome({ whyTitle: event.target.value })}
              value={home.whyTitle}
            />
          </label>
          <label className="form-field">
            <span>Пункты через перенос строки</span>
            <textarea
              onChange={(event) => updateHome({ whyItems: fromCsv(event.target.value) })}
              rows={5}
              value={home.whyItems.join("\n")}
            />
          </label>
        </div>
      </div>
    </details>
  );
}

function SectionTextSettings({
  description,
  eyebrow,
  name,
  onChange,
  title,
}: {
  description: string;
  eyebrow: string;
  name: string;
  onChange: (patch: { description?: string; eyebrow?: string; title?: string }) => void;
  title: string;
}) {
  return (
    <div className="grid gap-3 rounded-md border border-stone-200 bg-white p-3">
      <p className="text-sm font-bold text-stone-700">{name}</p>
      <label className="form-field">
        <span>Eyebrow</span>
        <input onChange={(event) => onChange({ eyebrow: event.target.value })} value={eyebrow} />
      </label>
      <label className="form-field">
        <span>Заголовок</span>
        <input onChange={(event) => onChange({ title: event.target.value })} value={title} />
      </label>
      <label className="form-field">
        <span>Описание</span>
        <textarea
          onChange={(event) => onChange({ description: event.target.value })}
          rows={3}
          value={description}
        />
      </label>
    </div>
  );
}

function SeoEditor({
  products,
  seo,
  updateSeo,
  uploadAsset,
}: {
  products: Product[];
  seo: SeoSettings;
  updateSeo: (patch: Partial<SeoSettings>) => void;
  uploadAsset: (file: File) => Promise<string | null>;
}) {
  const missingSeoTitle = products.filter((product) => !product.seoTitle?.trim());
  const missingSeoDescription = products.filter((product) => !product.seoDescription?.trim());
  const missingImageAlt = products.filter((product) => !product.imageAlt?.trim());
  const missingMarketplaceLinks = products.filter(
    (product) =>
      !product.marketplaces.wildberries?.trim() &&
      !product.marketplaces.ozon?.trim() &&
      !product.marketplaces.apteka?.trim() &&
      !product.marketplaces.goldapple?.trim() &&
      !product.marketplaces.letu?.trim() &&
      !product.marketplaces.zdravcity?.trim() &&
      !product.marketplaces.official?.trim(),
  );
  const auditItems = [
    {
      count: missingSeoTitle.length,
      label: "Title карточек",
      tone: missingSeoTitle.length ? "text-amber-700" : "text-olive-800",
    },
    {
      count: missingSeoDescription.length,
      label: "Description карточек",
      tone: missingSeoDescription.length ? "text-amber-700" : "text-olive-800",
    },
    {
      count: missingImageAlt.length,
      label: "Alt изображений",
      tone: missingImageAlt.length ? "text-amber-700" : "text-olive-800",
    },
    {
      count: missingMarketplaceLinks.length,
      label: "Ссылки на маркетплейсы",
      tone: missingMarketplaceLinks.length ? "text-amber-700" : "text-olive-800",
    },
  ];
  const problemProducts = [
    ...new Map(
      [...missingSeoTitle, ...missingSeoDescription, ...missingImageAlt, ...missingMarketplaceLinks]
        .slice(0, 20)
        .map((product) => [product.slug, product]),
    ).values(),
  ];

  return (
    <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid gap-5 rounded-md border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">SEO-продвижение</p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-950">Сниппеты, индексация и переходы на маркетплейсы</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-650">
            Здесь задаются глобальные мета-теги, Open Graph для ссылок в мессенджерах и шаблоны посадочных страниц.
            Эти настройки помогают приводить поисковый трафик в каталог и дальше вести посетителей на WB/Ozon.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="form-field">
            <span>Title сайта</span>
            <input onChange={(event) => updateSeo({ siteTitle: event.target.value })} value={seo.siteTitle} />
          </label>
          <label className="form-field">
            <span>Ключевые запросы через запятую</span>
            <input
              onChange={(event) => updateSeo({ siteKeywords: fromCsv(event.target.value) })}
              value={toCsv(seo.siteKeywords)}
            />
          </label>
        </div>

        <label className="form-field">
          <span>Description сайта</span>
          <textarea
            onChange={(event) => updateSeo({ siteDescription: event.target.value })}
            rows={3}
            value={seo.siteDescription}
          />
        </label>

        <div className="grid gap-4 rounded-md border border-stone-200 bg-linen-50 p-4 lg:grid-cols-2">
          <label className="form-field">
            <span>OG title</span>
            <input onChange={(event) => updateSeo({ ogTitle: event.target.value })} value={seo.ogTitle} />
          </label>
          <label className="form-field">
            <span>OG image</span>
            <input onChange={(event) => updateSeo({ ogImage: event.target.value })} value={seo.ogImage} />
          </label>
          <label className="form-field lg:col-span-2">
            <span>OG description</span>
            <textarea
              onChange={(event) => updateSeo({ ogDescription: event.target.value })}
              rows={3}
              value={seo.ogDescription}
            />
          </label>
          <label className="form-field lg:col-span-2">
            <span>Загрузить изображение для шаринга</span>
            <input
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void uploadAsset(file).then((url) => {
                  if (url) updateSeo({ ogImage: url });
                });
              }}
              type="file"
            />
          </label>
        </div>

        <div className="grid gap-4 rounded-md border border-stone-200 bg-white p-4">
          <div>
            <p className="text-sm font-bold text-stone-800">Шаблоны для посадочных страниц</p>
            <p className="mt-1 text-xs leading-6 text-stone-500">
              Можно использовать переменные {"{title}"}, {"{brand}"} и {"{category}"}. Индивидуальные SEO-поля товара
              всегда имеют приоритет над шаблоном.
            </p>
          </div>
          <label className="form-field">
            <span>Title товара</span>
            <input
              onChange={(event) => updateSeo({ productTitleTemplate: event.target.value })}
              value={seo.productTitleTemplate}
            />
          </label>
          <label className="form-field">
            <span>Description товара</span>
            <textarea
              onChange={(event) => updateSeo({ productDescriptionTemplate: event.target.value })}
              rows={3}
              value={seo.productDescriptionTemplate}
            />
          </label>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="form-field">
              <span>Title категории</span>
              <input
                onChange={(event) => updateSeo({ categoryTitleTemplate: event.target.value })}
                value={seo.categoryTitleTemplate}
              />
            </label>
            <label className="form-field">
              <span>Title бренда</span>
              <input
                onChange={(event) => updateSeo({ brandTitleTemplate: event.target.value })}
                value={seo.brandTitleTemplate}
              />
            </label>
          </div>
          <label className="form-field">
            <span>Текст цели перехода на маркетплейсы</span>
            <textarea
              onChange={(event) => updateSeo({ marketplaceGoalText: event.target.value })}
              rows={3}
              value={seo.marketplaceGoalText}
            />
          </label>
          <ToggleRow
            checked={seo.robotsIndex}
            label="Разрешить индексацию сайта поисковиками"
            onChange={(value) => updateSeo({ robotsIndex: value })}
          />
        </div>
      </section>

      <aside className="grid content-start gap-5">
        <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">SEO-аудит каталога</p>
          <div className="mt-4 grid gap-3">
            {auditItems.map((item) => (
              <div className="rounded-md border border-stone-200 bg-linen-50 p-3" key={item.label}>
                <p className={`text-2xl font-semibold ${item.tone}`}>{item.count}</p>
                <p className="mt-1 text-sm font-semibold text-stone-800">Нужно заполнить: {item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-stone-900">Карточки для доработки</p>
          <div className="mt-3 grid max-h-[430px] gap-2 overflow-auto pr-1">
            {problemProducts.length ? (
              problemProducts.map((product) => (
                <a
                  className="rounded-md border border-stone-200 bg-linen-50 px-3 py-2 text-sm font-semibold text-stone-800 transition hover:border-olive-400 hover:bg-white"
                  href={`/catalog/${product.slug}`}
                  key={product.slug}
                  target="_blank"
                >
                  {product.title}
                </a>
              ))
            ) : (
              <p className="rounded-md border border-olive-200 bg-olive-50 p-3 text-sm font-semibold text-olive-900">
                Базовые SEO-поля заполнены.
              </p>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}

function AnalyticsEditor({
  seo,
  updateSeo,
}: {
  seo: SeoSettings;
  updateSeo: (patch: Partial<SeoSettings>) => void;
}) {
  return (
    <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid gap-5 rounded-md border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">Аналитика</p>
          <h2 className="mt-1 text-2xl font-semibold text-stone-950">Метрика, GA и оценка переходов</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-650">
            Добавьте идентификаторы счетчиков, чтобы видеть, какие страницы приводят посетителей к кнопкам
            маркетплейсов, формам и контактам.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="form-field">
            <span>Яндекс.Метрика ID</span>
            <input
              inputMode="numeric"
              onChange={(event) => updateSeo({ yandexMetrikaId: event.target.value })}
              placeholder="12345678"
              value={seo.yandexMetrikaId}
            />
          </label>
          <label className="form-field">
            <span>Google Analytics ID</span>
            <input
              onChange={(event) => updateSeo({ googleAnalyticsId: event.target.value })}
              placeholder="G-XXXXXXXXXX"
              value={seo.googleAnalyticsId}
            />
          </label>
        </div>
        <div className="rounded-md border border-stone-200 bg-linen-50 p-4 text-sm leading-7 text-stone-650">
          После сохранения счетчики подключаются на публичном сайте автоматически. Для целей в Метрике удобно
          отслеживать клики по ссылкам Wildberries/Ozon, отправку формы и переходы в контакты.
        </div>
      </section>

      <aside className="grid content-start gap-4">
        <div className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-stone-900">Что смотреть в первую очередь</p>
          <div className="mt-3 grid gap-3 text-sm leading-7 text-stone-650">
            <p>1. Поисковые страницы входа: карточки товаров, бренды и категории.</p>
            <p>2. Клики по кнопкам WB/Ozon и доля переходов от общего трафика.</p>
            <p>3. Запросы, по которым пользователи приходят на натуральную косметику, БАДы и витамины.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ListButton({
  active,
  meta,
  onClick,
  title,
}: {
  active: boolean;
  meta?: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className={cn(
        "grid gap-1 rounded-md border px-3 py-3 text-left transition",
        active
          ? "border-olive-600 bg-olive-50 text-stone-950"
          : "border-stone-200 bg-white text-stone-700 hover:border-olive-200 hover:bg-linen-50",
      )}
      onClick={onClick}
      type="button"
    >
      <span className="line-clamp-2 text-sm font-semibold leading-snug">{title}</span>
      {meta ? <span className="text-xs text-stone-500">{meta}</span> : null}
    </button>
  );
}

function BrandsEditor({
  addBrand,
  brandQuery,
  duplicateBrand,
  filteredBrands,
  removeBrand,
  selectedBrand,
  selectedBrandSlug,
  setBrandQuery,
  setSelectedBrandSlug,
  updateBrand,
  uploadAsset,
}: {
  addBrand: () => void;
  brandQuery: string;
  duplicateBrand: (brand: Brand) => void;
  filteredBrands: Brand[];
  removeBrand: (slug: string) => void;
  selectedBrand?: Brand;
  selectedBrandSlug: string;
  setBrandQuery: (value: string) => void;
  setSelectedBrandSlug: (value: string) => void;
  updateBrand: (slug: string, patch: Partial<Brand>) => void;
  uploadAsset: (file: File) => Promise<string | null>;
}) {
  return (
    <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[340px_1fr]">
      <aside className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">Каталог</p>
            <h2 className="mt-1 text-xl font-semibold">Бренды</h2>
          </div>
          <button className="primary-link" onClick={addBrand} type="button">
            Добавить
          </button>
        </div>
        <label className="form-field mt-4">
          <span>Поиск</span>
          <input
            onChange={(event) => setBrandQuery(event.target.value)}
            placeholder="Название, страна, slug"
            value={brandQuery}
          />
        </label>
        <div className="mt-4 grid max-h-[calc(100vh-250px)] gap-2 overflow-auto pr-1">
          {filteredBrands.map((brand) => (
            <ListButton
              active={selectedBrandSlug === brand.slug}
              key={brand.slug}
              meta={brand.origin}
              onClick={() => setSelectedBrandSlug(brand.slug)}
              title={brand.title}
            />
          ))}
        </div>
      </aside>

      <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        {selectedBrand ? (
          <div className="grid gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">
                  Страница бренда
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{selectedBrand.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="secondary-link" href={`/brands/${selectedBrand.slug}`} target="_blank">
                  Открыть
                </a>
                <button className="secondary-link" onClick={() => duplicateBrand(selectedBrand)} type="button">
                  Дублировать
                </button>
                <button className="secondary-link" onClick={() => removeBrand(selectedBrand.slug)} type="button">
                  Удалить
                </button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="grid gap-4">
                <label className="form-field">
                  <span>Название</span>
                  <input
                    onChange={(event) => updateBrand(selectedBrand.slug, { title: event.target.value })}
                    value={selectedBrand.title}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <label className="form-field">
                    <span>Slug страницы</span>
                    <input
                      onChange={(event) => {
                        const slug = event.target.value;
                        updateBrand(selectedBrand.slug, { slug });
                        setSelectedBrandSlug(slug);
                      }}
                      value={selectedBrand.slug}
                    />
                  </label>
                  <button
                    className="secondary-link self-end justify-center"
                    onClick={() => {
                      const slug = slugifyClient(selectedBrand.title, selectedBrand.slug);
                      updateBrand(selectedBrand.slug, { slug });
                      setSelectedBrandSlug(slug);
                    }}
                    type="button"
                  >
                    Сформировать
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="form-field">
                    <span>Latin / международное название</span>
                    <input
                      onChange={(event) => updateBrand(selectedBrand.slug, { latin: event.target.value })}
                      value={selectedBrand.latin ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>Страна / происхождение</span>
                    <input
                      onChange={(event) => updateBrand(selectedBrand.slug, { origin: event.target.value })}
                      value={selectedBrand.origin}
                    />
                  </label>
                </div>
                <label className="form-field">
                  <span>Короткое описание</span>
                  <textarea
                    onChange={(event) => updateBrand(selectedBrand.slug, { short: event.target.value })}
                    rows={3}
                    value={selectedBrand.short}
                  />
                </label>
                <label className="form-field">
                  <span>Подробное описание</span>
                  <textarea
                    onChange={(event) => updateBrand(selectedBrand.slug, { description: event.target.value })}
                    rows={7}
                    value={selectedBrand.description}
                  />
                </label>
                <label className="form-field">
                  <span>Фокус через запятую</span>
                  <input
                    onChange={(event) => updateBrand(selectedBrand.slug, { focus: fromCsv(event.target.value) })}
                    value={toCsv(selectedBrand.focus)}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <label className="form-field">
                    <span>URL логотипа бренда</span>
                    <input
                      onChange={(event) => updateBrand(selectedBrand.slug, { logoImage: event.target.value })}
                      value={selectedBrand.logoImage ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>Коды флагов</span>
                    <input
                      onChange={(event) => updateBrand(selectedBrand.slug, { flagCodes: fromCsv(event.target.value) })}
                      placeholder="ru, de, it, fr"
                      value={toCsv(selectedBrand.flagCodes ?? [])}
                    />
                  </label>
                  <label className="form-field">
                    <span>Текст логотипа</span>
                    <input
                      onChange={(event) => updateBrand(selectedBrand.slug, { logoText: event.target.value })}
                      value={selectedBrand.logoText ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>Подпись логотипа</span>
                    <input
                      onChange={(event) => updateBrand(selectedBrand.slug, { logoSubtext: event.target.value })}
                      value={selectedBrand.logoSubtext ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>Акцентный цвет</span>
                    <input
                      onChange={(event) => updateBrand(selectedBrand.slug, { accent: event.target.value })}
                      type="color"
                      value={selectedBrand.accent}
                    />
                  </label>
                </div>
                <label className="inline-flex items-center gap-2 text-sm font-semibold">
                  <input
                    checked={Boolean(selectedBrand.featured)}
                    onChange={(event) => updateBrand(selectedBrand.slug, { featured: event.target.checked })}
                    type="checkbox"
                  />
                  Показывать бренд на главной
                </label>
              </div>

              <aside className="grid content-start gap-4">
                <div className="grid min-h-[250px] place-items-center overflow-hidden rounded-md border border-stone-200 bg-linen-50 p-5 text-center">
                  {selectedBrand.logoImage ? (
                    <Image
                      alt={`${selectedBrand.title} logo`}
                      className="max-h-[150px] w-full max-w-[280px] object-contain"
                      height={150}
                      src={selectedBrand.logoImage}
                      unoptimized
                      width={280}
                    />
                  ) : (
                    <div>
                      <p
                        className="break-words text-3xl font-semibold leading-tight"
                        style={{ color: selectedBrand.accent }}
                      >
                        {selectedBrand.logoText ?? selectedBrand.latin ?? selectedBrand.title}
                      </p>
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                        {selectedBrand.logoSubtext ?? selectedBrand.origin}
                      </p>
                    </div>
                  )}
                </div>
                <label className="form-field">
                  <span>Загрузить логотип</span>
                  <input
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      void uploadAsset(file).then((url) => {
                        if (url) updateBrand(selectedBrand.slug, { logoImage: url });
                      });
                    }}
                    type="file"
                  />
                </label>
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-stone-200 bg-linen-50">
                  <Image
                    alt={selectedBrand.title}
                    className="h-full w-full object-contain p-3"
                    fill
                    sizes="300px"
                    src={selectedBrand.image}
                    unoptimized
                  />
                </div>
                <label className="form-field">
                  <span>URL изображения бренда</span>
                  <input
                    onChange={(event) => updateBrand(selectedBrand.slug, { image: event.target.value })}
                    value={selectedBrand.image}
                  />
                </label>
                <label className="form-field">
                  <span>Загрузить изображение</span>
                  <input
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      void uploadAsset(file).then((url) => {
                        if (url) updateBrand(selectedBrand.slug, { image: url });
                      });
                    }}
                    type="file"
                  />
                </label>
              </aside>
            </div>
          </div>
        ) : (
          <EmptyEditorState action={addBrand} label="Добавить бренд" title="Брендов пока нет" />
        )}
      </section>
    </div>
  );
}

function CategoriesEditor({
  addCategory,
  categoryQuery,
  duplicateCategory,
  filteredCategories,
  removeCategory,
  selectedCategory,
  selectedCategorySlug,
  setCategoryQuery,
  setSelectedCategorySlug,
  updateCategory,
}: {
  addCategory: () => void;
  categoryQuery: string;
  duplicateCategory: (category: Category) => void;
  filteredCategories: Category[];
  removeCategory: (slug: string) => void;
  selectedCategory?: Category;
  selectedCategorySlug: string;
  setCategoryQuery: (value: string) => void;
  setSelectedCategorySlug: (value: string) => void;
  updateCategory: (slug: string, patch: Partial<Category>) => void;
}) {
  return (
    <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[340px_1fr]">
      <aside className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">Каталог</p>
            <h2 className="mt-1 text-xl font-semibold">Категории</h2>
          </div>
          <button className="primary-link" onClick={addCategory} type="button">
            Добавить
          </button>
        </div>
        <label className="form-field mt-4">
          <span>Поиск</span>
          <input
            onChange={(event) => setCategoryQuery(event.target.value)}
            placeholder="Название или slug"
            value={categoryQuery}
          />
        </label>
        <div className="mt-4 grid max-h-[calc(100vh-250px)] gap-2 overflow-auto pr-1">
          {filteredCategories.map((category) => (
            <ListButton
              active={selectedCategorySlug === category.slug}
              key={category.slug}
              meta={category.slug}
              onClick={() => setSelectedCategorySlug(category.slug)}
              title={category.title}
            />
          ))}
        </div>
      </aside>

      <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        {selectedCategory ? (
          <div className="grid gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">
                  Страница категории
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{selectedCategory.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="secondary-link" href={`/catalog/category/${selectedCategory.slug}`} target="_blank">
                  Открыть
                </a>
                <button
                  className="secondary-link"
                  onClick={() => duplicateCategory(selectedCategory)}
                  type="button"
                >
                  Дублировать
                </button>
                <button
                  className="secondary-link"
                  onClick={() => removeCategory(selectedCategory.slug)}
                  type="button"
                >
                  Удалить
                </button>
              </div>
            </div>
            <div className="grid max-w-3xl gap-4">
              <label className="form-field">
                <span>Название</span>
                <input
                  onChange={(event) => updateCategory(selectedCategory.slug, { title: event.target.value })}
                  value={selectedCategory.title}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <label className="form-field">
                  <span>Slug страницы</span>
                  <input
                    onChange={(event) => {
                      const slug = event.target.value;
                      updateCategory(selectedCategory.slug, { slug });
                      setSelectedCategorySlug(slug);
                    }}
                    value={selectedCategory.slug}
                  />
                </label>
                <button
                  className="secondary-link self-end justify-center"
                  onClick={() => {
                    const slug = slugifyClient(selectedCategory.title, selectedCategory.slug);
                    updateCategory(selectedCategory.slug, { slug });
                    setSelectedCategorySlug(slug);
                  }}
                  type="button"
                >
                  Сформировать
                </button>
              </div>
              <label className="form-field">
                <span>Описание</span>
                <textarea
                  onChange={(event) =>
                    updateCategory(selectedCategory.slug, { description: event.target.value })
                  }
                  rows={7}
                  value={selectedCategory.description}
                />
              </label>
            </div>
          </div>
        ) : (
          <EmptyEditorState action={addCategory} label="Добавить категорию" title="Категорий пока нет" />
        )}
      </section>
    </div>
  );
}

function ProductsEditor({
  addProduct,
  catalogBrands,
  catalogCategories,
  duplicateProduct,
  filteredProducts,
  productQuery,
  removeProduct,
  selectedProduct,
  selectedProductSlug,
  setProductQuery,
  setSelectedProductSlug,
  updateProduct,
  uploadAsset,
}: {
  addProduct: () => void;
  catalogBrands: Brand[];
  catalogCategories: Category[];
  duplicateProduct: (product: Product) => void;
  filteredProducts: Product[];
  productQuery: string;
  removeProduct: (slug: string) => void;
  selectedProduct?: Product;
  selectedProductSlug: string;
  setProductQuery: (value: string) => void;
  setSelectedProductSlug: (value: string) => void;
  updateProduct: (slug: string, patch: Partial<Product>) => void;
  uploadAsset: (file: File) => Promise<string | null>;
}) {
  return (
    <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[340px_1fr]">
      <aside className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">Каталог</p>
            <h2 className="mt-1 text-xl font-semibold">Товары</h2>
          </div>
          <button className="primary-link" onClick={addProduct} type="button">
            Добавить
          </button>
        </div>
        <label className="form-field mt-4">
          <span>Поиск</span>
          <input
            onChange={(event) => setProductQuery(event.target.value)}
            placeholder="Название, бренд, slug"
            value={productQuery}
          />
        </label>
        <div className="mt-4 grid max-h-[calc(100vh-250px)] gap-2 overflow-auto pr-1">
          {filteredProducts.map((product) => (
            <ListButton
              active={selectedProductSlug === product.slug}
              key={product.slug}
              meta={`${product.brand} · ${product.categories.length} кат.`}
              onClick={() => setSelectedProductSlug(product.slug)}
              title={product.title}
            />
          ))}
        </div>
      </aside>

      <section className="min-w-0 rounded-md border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        {selectedProduct ? (
          <div className="grid gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">
                  Карточка товара
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{selectedProduct.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="secondary-link" href={`/catalog/${selectedProduct.slug}`} target="_blank">
                  Открыть
                </a>
                <button className="secondary-link" onClick={() => duplicateProduct(selectedProduct)} type="button">
                  Дублировать
                </button>
                <button className="secondary-link" onClick={() => removeProduct(selectedProduct.slug)} type="button">
                  Удалить
                </button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="grid gap-4">
                <label className="form-field">
                  <span>Название</span>
                  <input
                    onChange={(event) => updateProduct(selectedProduct.slug, { title: event.target.value })}
                    value={selectedProduct.title}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <label className="form-field">
                    <span>Slug страницы</span>
                    <input
                      onChange={(event) => {
                        const slug = event.target.value;
                        updateProduct(selectedProduct.slug, { slug });
                        setSelectedProductSlug(slug);
                      }}
                      value={selectedProduct.slug}
                    />
                  </label>
                  <button
                    className="secondary-link self-end justify-center"
                    onClick={() => {
                      const slug = slugifyClient(selectedProduct.title, selectedProduct.slug);
                      updateProduct(selectedProduct.slug, { slug });
                      setSelectedProductSlug(slug);
                    }}
                    type="button"
                  >
                    Сформировать
                  </button>
                </div>
                <label className="form-field">
                  <span>Краткое описание</span>
                  <textarea
                    onChange={(event) => updateProduct(selectedProduct.slug, { description: event.target.value })}
                    rows={4}
                    value={selectedProduct.description}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="form-field">
                    <span>Бренд</span>
                    <select
                      onChange={(event) => updateProduct(selectedProduct.slug, { brand: event.target.value })}
                      value={selectedProduct.brand}
                    >
                      {!catalogBrands.some((brand) => brand.slug === selectedProduct.brand) ? (
                        <option value={selectedProduct.brand}>{selectedProduct.brand}</option>
                      ) : null}
                      {catalogBrands.map((brand) => (
                        <option key={brand.slug} value={brand.slug}>
                          {brand.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="form-field">
                    <span>Бейдж</span>
                    <input
                      onChange={(event) => updateProduct(selectedProduct.slug, { badge: event.target.value })}
                      placeholder="Новинка, хит, каталог"
                      value={selectedProduct.badge ?? ""}
                    />
                  </label>
                </div>
                <div className="grid gap-3 rounded-md border border-stone-200 bg-linen-50 p-3">
                  <span className="text-sm font-bold text-stone-700">Категории</span>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {catalogCategories.map((category) => {
                      const checked = selectedProduct.categories.includes(category.slug);

                      return (
                        <label
                          className="flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-semibold"
                          key={category.slug}
                        >
                          <input
                            checked={checked}
                            onChange={(event) => {
                              const next = event.target.checked
                                ? [...selectedProduct.categories, category.slug]
                                : selectedProduct.categories.filter((slug) => slug !== category.slug);
                              updateProduct(selectedProduct.slug, { categories: next });
                            }}
                            type="checkbox"
                          />
                          {category.title}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="form-field">
                    <span>Ингредиенты через запятую</span>
                    <textarea
                      onChange={(event) =>
                        updateProduct(selectedProduct.slug, { ingredients: fromCsv(event.target.value) })
                      }
                      rows={3}
                      value={toCsv(selectedProduct.ingredients)}
                    />
                  </label>
                  <label className="form-field">
                    <span>Теги через запятую</span>
                    <textarea
                      onChange={(event) =>
                        updateProduct(selectedProduct.slug, { tags: fromCsv(event.target.value) })
                      }
                      rows={3}
                      value={toCsv(selectedProduct.tags)}
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <label className="form-field">
                    <span>Wildberries</span>
                    <input
                      onChange={(event) =>
                        updateProduct(selectedProduct.slug, {
                          marketplaces: {
                            ...selectedProduct.marketplaces,
                            wildberries: event.target.value,
                          },
                        })
                      }
                      value={selectedProduct.marketplaces.wildberries ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>Ozon</span>
                    <input
                      onChange={(event) =>
                        updateProduct(selectedProduct.slug, {
                          marketplaces: {
                            ...selectedProduct.marketplaces,
                            ozon: event.target.value,
                          },
                        })
                      }
                      value={selectedProduct.marketplaces.ozon ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>Apteka.ru</span>
                    <input
                      onChange={(event) =>
                        updateProduct(selectedProduct.slug, {
                          marketplaces: {
                            ...selectedProduct.marketplaces,
                            apteka: event.target.value,
                          },
                        })
                      }
                      value={selectedProduct.marketplaces.apteka ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>Золотое Яблоко</span>
                    <input
                      onChange={(event) =>
                        updateProduct(selectedProduct.slug, {
                          marketplaces: {
                            ...selectedProduct.marketplaces,
                            goldapple: event.target.value,
                          },
                        })
                      }
                      value={selectedProduct.marketplaces.goldapple ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>ЛЭтуаль</span>
                    <input
                      onChange={(event) =>
                        updateProduct(selectedProduct.slug, {
                          marketplaces: {
                            ...selectedProduct.marketplaces,
                            letu: event.target.value,
                          },
                        })
                      }
                      value={selectedProduct.marketplaces.letu ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>Здравсити</span>
                    <input
                      onChange={(event) =>
                        updateProduct(selectedProduct.slug, {
                          marketplaces: {
                            ...selectedProduct.marketplaces,
                            zdravcity: event.target.value,
                          },
                        })
                      }
                      value={selectedProduct.marketplaces.zdravcity ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>Официальная ссылка Arnebia.ru</span>
                    <input
                      onChange={(event) =>
                        updateProduct(selectedProduct.slug, {
                          marketplaces: {
                            ...selectedProduct.marketplaces,
                            official: event.target.value,
                          },
                        })
                      }
                      value={selectedProduct.marketplaces.official ?? ""}
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="form-field">
                    <span>SEO title</span>
                    <input
                      onChange={(event) => updateProduct(selectedProduct.slug, { seoTitle: event.target.value })}
                      value={selectedProduct.seoTitle ?? ""}
                    />
                  </label>
                  <label className="form-field">
                    <span>Keywords через запятую</span>
                    <input
                      onChange={(event) =>
                        updateProduct(selectedProduct.slug, { keywords: fromCsv(event.target.value) })
                      }
                      value={toCsv(selectedProduct.keywords)}
                    />
                  </label>
                </div>
                <label className="form-field">
                  <span>SEO description</span>
                  <textarea
                    onChange={(event) =>
                      updateProduct(selectedProduct.slug, { seoDescription: event.target.value })
                    }
                    rows={3}
                    value={selectedProduct.seoDescription ?? ""}
                  />
                </label>
                <label className="form-field">
                  <span>Подробный текст страницы</span>
                  <textarea
                    onChange={(event) => updateProduct(selectedProduct.slug, { body: event.target.value })}
                    rows={11}
                    value={selectedProduct.body}
                  />
                </label>
              </div>

              <aside className="grid content-start gap-4">
                <div className="relative aspect-square overflow-hidden rounded-md border border-stone-200 bg-linen-50">
                  <Image
                    alt={selectedProduct.imageAlt}
                    className="h-full w-full object-contain p-3"
                    fill
                    sizes="300px"
                    src={selectedProduct.image}
                    unoptimized
                  />
                </div>
                <label className="form-field">
                  <span>URL изображения</span>
                  <input
                    onChange={(event) => updateProduct(selectedProduct.slug, { image: event.target.value })}
                    value={selectedProduct.image}
                  />
                </label>
                <label className="form-field">
                  <span>Alt изображения</span>
                  <input
                    onChange={(event) => updateProduct(selectedProduct.slug, { imageAlt: event.target.value })}
                    value={selectedProduct.imageAlt}
                  />
                </label>
                <label className="form-field">
                  <span>Загрузить изображение</span>
                  <input
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      void uploadAsset(file).then((url) => {
                        if (url) updateProduct(selectedProduct.slug, { image: url });
                      });
                    }}
                    type="file"
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-semibold">
                  <input
                    checked={Boolean(selectedProduct.isNew)}
                    onChange={(event) => updateProduct(selectedProduct.slug, { isNew: event.target.checked })}
                    type="checkbox"
                  />
                  Новинка
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-semibold">
                  <input
                    checked={Boolean(selectedProduct.isPopular)}
                    onChange={(event) =>
                      updateProduct(selectedProduct.slug, { isPopular: event.target.checked })
                    }
                    type="checkbox"
                  />
                  Показывать на главной
                </label>
              </aside>
            </div>
          </div>
        ) : (
          <EmptyEditorState action={addProduct} label="Добавить товар" title="Товаров пока нет" />
        )}
      </section>
    </div>
  );
}

function PostsEditor({
  addPost,
  duplicatePost,
  filteredPosts,
  postQuery,
  removePost,
  selectedPost,
  selectedPostSlug,
  setPostQuery,
  setSelectedPostSlug,
  updatePost,
  uploadAsset,
}: {
  addPost: () => void;
  duplicatePost: (post: Post) => void;
  filteredPosts: Post[];
  postQuery: string;
  removePost: (slug: string) => void;
  selectedPost?: Post;
  selectedPostSlug: string;
  setPostQuery: (value: string) => void;
  setSelectedPostSlug: (value: string) => void;
  updatePost: (slug: string, patch: Partial<Post>) => void;
  uploadAsset: (file: File) => Promise<string | null>;
}) {
  return (
    <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[340px_1fr]">
      <aside className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">Материалы</p>
            <h2 className="mt-1 text-xl font-semibold">Новости и блог</h2>
          </div>
          <button className="primary-link" onClick={addPost} type="button">
            Добавить
          </button>
        </div>
        <label className="form-field mt-4">
          <span>Поиск</span>
          <input
            onChange={(event) => setPostQuery(event.target.value)}
            placeholder="Заголовок, категория, slug"
            value={postQuery}
          />
        </label>
        <div className="mt-4 grid max-h-[calc(100vh-250px)] gap-2 overflow-auto pr-1">
          {filteredPosts.map((post) => (
            <ListButton
              active={selectedPostSlug === post.slug}
              key={post.slug}
              meta={`${post.category} · ${post.date}`}
              onClick={() => setSelectedPostSlug(post.slug)}
              title={post.title}
            />
          ))}
        </div>
      </aside>

      <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        {selectedPost ? (
          <div className="grid gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">
                  Редактор материала
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{selectedPost.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="secondary-link" href={`/news/${selectedPost.slug}`} target="_blank">
                  Открыть
                </a>
                <button className="secondary-link" onClick={() => duplicatePost(selectedPost)} type="button">
                  Дублировать
                </button>
                <button className="secondary-link" onClick={() => removePost(selectedPost.slug)} type="button">
                  Удалить
                </button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="grid gap-4">
                <label className="form-field">
                  <span>Заголовок</span>
                  <input
                    onChange={(event) => updatePost(selectedPost.slug, { title: event.target.value })}
                    value={selectedPost.title}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <label className="form-field">
                    <span>Slug страницы</span>
                    <input
                      onChange={(event) => {
                        const slug = event.target.value;
                        updatePost(selectedPost.slug, { slug });
                        setSelectedPostSlug(slug);
                      }}
                      value={selectedPost.slug}
                    />
                  </label>
                  <button
                    className="secondary-link self-end justify-center"
                    onClick={() => {
                      const slug = slugifyClient(selectedPost.title, selectedPost.slug);
                      updatePost(selectedPost.slug, { slug });
                      setSelectedPostSlug(slug);
                    }}
                    type="button"
                  >
                    Сформировать
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="form-field">
                    <span>Дата</span>
                    <input
                      onChange={(event) => updatePost(selectedPost.slug, { date: event.target.value })}
                      type="date"
                      value={selectedPost.date}
                    />
                  </label>
                  <label className="form-field">
                    <span>Тип материала</span>
                    <select
                      onChange={(event) =>
                        updatePost(selectedPost.slug, {
                          category: event.target.value as Post["category"],
                        })
                      }
                      value={selectedPost.category}
                    >
                      <option value="news">Новость</option>
                      <option value="promo">Акция</option>
                      <option value="article">Статья</option>
                    </select>
                  </label>
                </div>
                <label className="form-field">
                  <span>Краткое описание</span>
                  <textarea
                    onChange={(event) => updatePost(selectedPost.slug, { description: event.target.value })}
                    rows={4}
                    value={selectedPost.description}
                  />
                </label>
                <label className="form-field">
                  <span>Теги через запятую</span>
                  <input
                    onChange={(event) => updatePost(selectedPost.slug, { tags: fromCsv(event.target.value) })}
                    value={toCsv(selectedPost.tags)}
                  />
                </label>
                <label className="form-field">
                  <span>Текст материала</span>
                  <textarea
                    onChange={(event) => updatePost(selectedPost.slug, { body: event.target.value })}
                    rows={15}
                    value={selectedPost.body}
                  />
                </label>
              </div>

              <aside className="grid content-start gap-4">
                <div className="relative aspect-[16/11] overflow-hidden rounded-md border border-stone-200 bg-linen-50">
                  <Image
                    alt={selectedPost.imageAlt}
                    className="h-full w-full object-contain p-3"
                    fill
                    sizes="300px"
                    src={selectedPost.image}
                    unoptimized
                  />
                </div>
                <label className="form-field">
                  <span>URL изображения</span>
                  <input
                    onChange={(event) => updatePost(selectedPost.slug, { image: event.target.value })}
                    value={selectedPost.image}
                  />
                </label>
                <label className="form-field">
                  <span>Alt изображения</span>
                  <input
                    onChange={(event) => updatePost(selectedPost.slug, { imageAlt: event.target.value })}
                    value={selectedPost.imageAlt}
                  />
                </label>
                <label className="form-field">
                  <span>Загрузить изображение</span>
                  <input
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      void uploadAsset(file).then((url) => {
                        if (url) updatePost(selectedPost.slug, { image: url });
                      });
                    }}
                    type="file"
                  />
                </label>
              </aside>
            </div>
          </div>
        ) : (
          <EmptyEditorState action={addPost} label="Добавить материал" title="Материалов пока нет" />
        )}
      </section>
    </div>
  );
}

function ReferencesEditor({
  addReference,
  duplicateReference,
  filteredReferences,
  referenceQuery,
  removeReference,
  selectedReference,
  selectedReferenceIndex,
  setReferenceQuery,
  setSelectedReferenceIndex,
  updateReference,
  uploadAsset,
}: {
  addReference: () => void;
  duplicateReference: (reference: ReferenceDocument) => void;
  filteredReferences: Array<{ reference: ReferenceDocument; index: number }>;
  referenceQuery: string;
  removeReference: (index: number) => void;
  selectedReference?: ReferenceDocument;
  selectedReferenceIndex: number;
  setReferenceQuery: (value: string) => void;
  setSelectedReferenceIndex: (value: number) => void;
  updateReference: (index: number, patch: Partial<ReferenceDocument>) => void;
  uploadAsset: (file: File) => Promise<string | null>;
}) {
  return (
    <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[340px_1fr]">
      <aside className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">Материалы</p>
            <h2 className="mt-1 text-xl font-semibold">Справочники</h2>
          </div>
          <button className="primary-link" onClick={addReference} type="button">
            Добавить
          </button>
        </div>
        <label className="form-field mt-4">
          <span>Поиск</span>
          <input
            onChange={(event) => setReferenceQuery(event.target.value)}
            placeholder="Название или ссылка"
            value={referenceQuery}
          />
        </label>
        <div className="mt-4 grid max-h-[calc(100vh-250px)] gap-2 overflow-auto pr-1">
          {filteredReferences.map(({ reference, index }) => (
            <ListButton
              active={selectedReferenceIndex === index}
              key={`${reference.title}-${index}`}
              meta={reference.size}
              onClick={() => setSelectedReferenceIndex(index)}
              title={reference.title}
            />
          ))}
        </div>
      </aside>

      <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        {selectedReference ? (
          <div className="grid gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive-800">
                  Редактор справочника
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{selectedReference.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="secondary-link" href={selectedReference.href} target="_blank">
                  Открыть
                </a>
                <button
                  className="secondary-link"
                  onClick={() => duplicateReference(selectedReference)}
                  type="button"
                >
                  Дублировать
                </button>
                <button
                  className="secondary-link"
                  onClick={() => removeReference(selectedReferenceIndex)}
                  type="button"
                >
                  Удалить
                </button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="grid gap-4">
                <label className="form-field">
                  <span>Название</span>
                  <input
                    onChange={(event) =>
                      updateReference(selectedReferenceIndex, { title: event.target.value })
                    }
                    value={selectedReference.title}
                  />
                </label>
                <label className="form-field">
                  <span>Описание</span>
                  <textarea
                    onChange={(event) =>
                      updateReference(selectedReferenceIndex, { description: event.target.value })
                    }
                    rows={5}
                    value={selectedReference.description}
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                  <label className="form-field">
                    <span>Размер / тип</span>
                    <input
                      onChange={(event) =>
                        updateReference(selectedReferenceIndex, { size: event.target.value })
                      }
                      value={selectedReference.size}
                    />
                  </label>
                  <label className="form-field">
                    <span>Ссылка на файл или страницу</span>
                    <input
                      onChange={(event) =>
                        updateReference(selectedReferenceIndex, { href: event.target.value })
                      }
                      value={selectedReference.href}
                    />
                  </label>
                </div>
              </div>

              <aside className="grid content-start gap-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-stone-200 bg-linen-50">
                  <Image
                    alt={selectedReference.title}
                    className="h-full w-full object-contain p-3"
                    fill
                    sizes="300px"
                    src={selectedReference.image}
                    unoptimized
                  />
                </div>
                <label className="form-field">
                  <span>URL обложки</span>
                  <input
                    onChange={(event) =>
                      updateReference(selectedReferenceIndex, { image: event.target.value })
                    }
                    value={selectedReference.image}
                  />
                </label>
                <label className="form-field">
                  <span>Загрузить обложку</span>
                  <input
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      void uploadAsset(file).then((url) => {
                        if (url) updateReference(selectedReferenceIndex, { image: url });
                      });
                    }}
                    type="file"
                  />
                </label>
              </aside>
            </div>
          </div>
        ) : (
          <EmptyEditorState action={addReference} label="Добавить справочник" title="Справочников пока нет" />
        )}
      </section>
    </div>
  );
}

function EmptyEditorState({
  action,
  label,
  title,
}: {
  action: () => void;
  label: string;
  title: string;
}) {
  return (
    <div className="grid min-h-[320px] place-items-center rounded-md border border-dashed border-stone-300 bg-linen-50 p-8 text-center">
      <div>
        <h2 className="text-2xl font-semibold text-stone-950">{title}</h2>
        <button className="primary-link mt-5" onClick={action} type="button">
          {label}
        </button>
      </div>
    </div>
  );
}
