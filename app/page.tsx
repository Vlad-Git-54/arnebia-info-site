import Image from "next/image";
import Link from "next/link";
import { BrandCard } from "@/components/brand-card";
import { Icon } from "@/components/icons";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { readBrands, readCategories, readHomeBanners, readHomePageSettings } from "@/lib/admin-config";
import { getPosts, getProducts } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { BannerAspect, BannerImageFit, HomeBanner, Product } from "@/types/content";

export const dynamic = "force-dynamic";

function getBannerAspectClass(aspect: BannerAspect, mobileAspect: BannerAspect) {
  const mobile =
    {
      auto: "min-h-[260px]",
      compact: "aspect-[31/20]",
      photo: "aspect-[22/13]",
      square: "aspect-square",
      wide: "aspect-[2/1]",
    }[mobileAspect] ?? "aspect-[22/13]";
  const desktop =
    {
      auto: "md:min-h-[260px]",
      compact: "md:aspect-[31/20]",
      photo: "md:aspect-[22/13]",
      square: "md:aspect-square",
      wide: "md:aspect-[2/1]",
    }[aspect] ?? "md:aspect-[22/13]";

  return `${mobile} ${desktop}`;
}

function getBannerCardClass(width: number) {
  const medium = width >= 7 ? "md:col-span-2" : "md:col-span-1";
  const large =
    {
      3: "lg:col-span-3",
      4: "lg:col-span-4",
      5: "lg:col-span-5",
      6: "lg:col-span-6",
      7: "lg:col-span-7",
      8: "lg:col-span-8",
      9: "lg:col-span-9",
      10: "lg:col-span-10",
      11: "lg:col-span-11",
      12: "lg:col-span-12",
    }[width] ?? "lg:col-span-4";

  return `${medium} ${large}`;
}

function getBannerFitClass(fit: BannerImageFit, mobileFit: BannerImageFit) {
  const mobile = mobileFit === "cover" ? "object-cover" : "object-contain";
  const desktop = fit === "cover" ? "md:object-cover" : "md:object-contain";

  return `${mobile} ${desktop}`;
}

function getBannerTextClass(mode: string) {
  if (mode === "hidden") return "hidden border-t border-stone-200 bg-white p-5 md:grid";

  return "grid content-start gap-2 border-t border-stone-200 bg-white p-5";
}

function getBannerDescriptionClass(mode: string) {
  return mode === "title" ? "hidden text-sm leading-7 text-stone-650 md:block" : "text-sm leading-7 text-stone-650";
}

function resolveHomeBlock(
  block: HomeBanner,
  products: Awaited<ReturnType<typeof getProducts>>,
  posts: Awaited<ReturnType<typeof getPosts>>,
  brands: Awaited<ReturnType<typeof readBrands>>,
  categories: Awaited<ReturnType<typeof readCategories>>,
) {
  if (block.sourceType === "product" && block.sourceSlug) {
    const product = products.find((item) => item.slug === block.sourceSlug);
    if (product) {
      return {
        ...block,
        title: block.title || product.title,
        description: block.description || product.description,
        image: block.image || product.image,
        href: `/catalog/${product.slug}`,
      };
    }
  }

  if (block.sourceType === "post" && block.sourceSlug) {
    const post = posts.find((item) => item.slug === block.sourceSlug);
    if (post) {
      return {
        ...block,
        title: block.title || post.title,
        description: block.description || post.description,
        image: block.image || post.image,
        href: `/news/${post.slug}`,
      };
    }
  }

  if (block.sourceType === "brand" && block.sourceSlug) {
    const brand = brands.find((item) => item.slug === block.sourceSlug);
    if (brand) {
      return {
        ...block,
        title: block.title || brand.title,
        description: block.description || brand.short,
        image: block.image || brand.image,
        href: `/brands/${brand.slug}`,
      };
    }
  }

  if (block.sourceType === "category" && block.sourceSlug) {
    const category = categories.find((item) => item.slug === block.sourceSlug);
    if (category) {
      return {
        ...block,
        title: block.title || category.title,
        description: block.description || category.description,
        href: `/catalog/category/${category.slug}`,
      };
    }
  }

  return block;
}

export default async function Home() {
  const home = await readHomePageSettings();
  const featuredBanners = await readHomeBanners();
  const brands = await readBrands();
  const categories = await readCategories();
  const runtimeProducts = await getProducts();
  const runtimePosts = await getPosts();
  const brandTitleBySlug = new Map(brands.map((brand) => [brand.slug, brand.title]));
  const featuredBrands = brands.filter((brand) => brand.featured);
  const heroProducts = home.heroProductSlugs
    .map((slug) => runtimeProducts.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
  const popularProducts = runtimeProducts.filter((product) => product.isPopular).slice(0, home.productsLimit);
  const latestPosts = runtimePosts.slice(0, home.postsLimit);
  const resolvedBanners = featuredBanners.map((banner) =>
    resolveHomeBlock(banner, runtimeProducts, runtimePosts, brands, categories),
  );

  return (
    <main>
      {home.showHero ? (
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="hero-grid items-center gap-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md border border-olive-200 bg-white/78 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-olive-900">
              <Icon className="h-4 w-4" name="leaf" />
              {home.heroEyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-balance text-6xl font-semibold leading-[0.98] text-stone-950 md:text-8xl">
              {home.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-2xl font-semibold leading-tight text-stone-950 md:text-4xl">
              {home.heroLead}
            </p>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-stone-650 md:text-lg">
              {home.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="primary-link" href={home.primaryCtaHref}>
                <Icon className="h-4 w-4" name="search" />
                <span>{home.primaryCtaLabel}</span>
              </Link>
              <Link className="secondary-link" href={home.secondaryCtaHref}>
                <Icon className="h-4 w-4" name="spark" />
                <span>{home.secondaryCtaLabel}</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {heroProducts.map((product, index) => (
              <Link
                className="group relative aspect-[4/5] overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                href={`/catalog/${product.slug}`}
                key={product.slug}
              >
                <Image
                  alt={product.imageAlt}
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]"
                  fill
                  priority={index < 2}
                  sizes="(max-width: 768px) 45vw, 240px"
                  src={product.image}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
                <span className="absolute bottom-3 left-3 right-3 rounded-md bg-white/92 px-3 py-2 text-xs font-semibold leading-snug text-stone-900 shadow-sm">
                  {product.badge ?? product.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {home.showFacts ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {home.facts.map((fact) => (
            <div className="rounded-md border border-stone-200 bg-white/84 p-4" key={fact.label}>
              <p className="text-3xl font-semibold text-olive-900">{fact.value}</p>
              <p className="mt-1 text-sm leading-6 text-stone-650">{fact.label}</p>
            </div>
          ))}
        </div>
        ) : null}
      </section>
      ) : null}

      {home.showBlocks ? (
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
            {resolvedBanners.map((banner, index) => (
              <Link
                className={cn(
                  "group grid overflow-hidden rounded-md border border-stone-200 bg-linen-50 shadow-sm transition hover:-translate-y-1 hover:shadow-xl",
                  getBannerCardClass(banner.width),
                )}
                href={banner.href}
                key={banner.title}
              >
                <div
                  className={cn(
                    "relative bg-gradient-to-br from-white to-linen-100",
                    getBannerAspectClass(banner.aspect, banner.mobileAspect),
                  )}
                >
                  <Image
                    alt={banner.title}
                    className={cn(
                      "h-full w-full p-2 transition duration-500 group-hover:scale-[1.02] sm:p-3",
                      getBannerFitClass(banner.imageFit, banner.mobileImageFit),
                    )}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 720px"
                    src={banner.image}
                    unoptimized
                  />
                </div>
                <div className={getBannerTextClass(banner.mobileTextMode)}>
                  <p className="text-lg font-semibold leading-tight text-stone-950">{banner.title}</p>
                  <p className={getBannerDescriptionClass(banner.mobileTextMode)}>
                    {banner.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {home.showDirections ? (
      <section className="border-y border-stone-200 bg-linen-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {home.directions.map((direction) => (
              <div className="rounded-md border border-stone-200 bg-white p-5" key={direction.title}>
                <p className="text-lg font-semibold text-stone-950">{direction.title}</p>
                <p className="mt-3 text-sm leading-7 text-stone-650">{direction.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {home.showBrands ? (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              description={home.brandsDescription}
              eyebrow={home.brandsEyebrow}
              title={home.brandsTitle}
            />
            <Link className="secondary-link self-start md:self-end" href="/brands">
              <span>Все бренды</span>
              <Icon className="h-4 w-4" name="arrow" />
            </Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {featuredBrands.map((brand) => (
              <BrandCard brand={brand} key={brand.slug} />
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {home.showProducts ? (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            description={home.productsDescription}
            eyebrow={home.productsEyebrow}
            title={home.productsTitle}
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {popularProducts.map((product) => (
              <ProductCard
                brandTitle={brandTitleBySlug.get(product.brand)}
                product={product}
                key={product.slug}
              />
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {home.showWhy ? (
      <section className="bg-olive-900 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-olive-200">
              {home.whyEyebrow}
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight md:text-5xl">
              {home.whyTitle}
            </h2>
          </div>
          <div className="grid gap-3">
            {home.whyItems.map((advantage) => (
              <div className="flex gap-3 rounded-md bg-white/8 p-4" key={advantage}>
                <Icon className="mt-1 h-5 w-5 shrink-0 text-olive-200" name="check" />
                <p className="text-sm leading-7 text-olive-50">{advantage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {home.showPosts ? (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              description={home.postsDescription}
              eyebrow={home.postsEyebrow}
              title={home.postsTitle}
            />
            <Link className="secondary-link self-start md:self-end" href="/news">
              <span>Все материалы</span>
              <Icon className="h-4 w-4" name="arrow" />
            </Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard post={post} key={post.slug} />
            ))}
          </div>
        </div>
      </section>
      ) : null}
    </main>
  );
}
