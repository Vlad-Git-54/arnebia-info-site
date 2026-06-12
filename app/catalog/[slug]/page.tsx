import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { MarketplaceLinks } from "@/components/marketplace-links";
import { ProductCard } from "@/components/product-card";
import { RichText } from "@/components/rich-text";
import { SectionHeading } from "@/components/section-heading";
import { readBrands, readCategories, readSeoSettings } from "@/lib/admin-config";
import { getProduct, getProducts, products } from "@/lib/content";
import { applySeoTemplate, breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return {};

  const [seo, brands, categories] = await Promise.all([
    readSeoSettings(),
    readBrands(),
    readCategories(),
  ]);
  const brandTitle = brands.find((item) => item.slug === product.brand)?.title ?? product.brand;
  const categoryTitle =
    product.categories
      .map((categorySlug) => categories.find((item) => item.slug === categorySlug)?.title)
      .find(Boolean) ?? "";
  const templateValues = {
    brand: brandTitle,
    category: categoryTitle,
    title: product.title,
  };
  const title = product.seoTitle || applySeoTemplate(seo.productTitleTemplate, templateValues);
  const description =
    product.seoDescription ||
    (seo.productDescriptionTemplate
      ? applySeoTemplate(seo.productDescriptionTemplate, templateValues)
      : product.description);

  return {
    title,
    description,
    keywords: product.keywords,
    openGraph: {
      title,
      description,
      images: [{ url: product.image, alt: product.imageAlt }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const brands = await readBrands();
  const categories = await readCategories();
  const brand = brands.find((item) => item.slug === product.brand);
  const runtimeProducts = await getProducts();
  const related = runtimeProducts
    .filter((item) => item.slug !== product.slug && item.brand === product.brand)
    .slice(0, 3);

  return (
    <main>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
          { name: product.title, url: `/catalog/${product.slug}` },
        ])}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="relative aspect-square overflow-hidden rounded-md border border-stone-200 bg-gradient-to-br from-white to-linen-100 shadow-sm">
          <Image
            alt={product.imageAlt}
            className="h-full w-full object-contain"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={product.image}
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">
            {brand?.title ?? product.brand}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-stone-950 md:text-6xl">
            {product.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-650">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span className="rounded-md bg-linen-100 px-3 py-1.5 text-sm font-semibold text-stone-700" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <MarketplaceLinks links={product.marketplaces} />
          </div>

          <div className="mt-8 rounded-md border border-stone-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-stone-950">Ключевые ингредиенты</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {product.ingredients.map((ingredient) => (
                <div className="rounded-md bg-linen-100 px-3 py-2 text-sm text-stone-700" key={ingredient}>
                  {ingredient}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <RichText body={product.body} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {product.categories.map((slug) => {
            const category = categories.find((item) => item.slug === slug);
            if (!category) return null;

            return (
              <Link
                className="rounded-md border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl"
                href={`/catalog/category/${category.slug}`}
                key={category.slug}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">Категория</p>
                <h2 className="mt-2 text-xl font-semibold text-stone-950">{category.title}</h2>
                <p className="mt-2 text-sm leading-7 text-stone-650">{category.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {related.length ? (
        <section className="bg-linen-100 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Еще в бренде"
              title={brand ? `Другие продукты ${brand.title}` : "Похожие продукты"}
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <ProductCard brandTitle={brand?.title} product={item} key={item.slug} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
