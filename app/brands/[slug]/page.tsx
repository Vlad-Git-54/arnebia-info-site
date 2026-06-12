import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandFlags } from "@/components/brand-flags";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { brands as staticBrands } from "@/content/taxonomy";
import { readBrands, readSeoSettings } from "@/lib/admin-config";
import { getProductsByBrand } from "@/lib/content";
import { applySeoTemplate, breadcrumbJsonLd } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return staticBrands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const brands = await readBrands();
  const brand = brands.find((item) => item.slug === slug);

  if (!brand) return {};

  const seo = await readSeoSettings();
  const title = applySeoTemplate(seo.brandTitleTemplate, {
    brand: brand.title,
    category: "",
    title: brand.title,
  });

  return {
    title,
    description: brand.description,
    openGraph: {
      title,
      description: brand.description,
      images: [{ url: brand.image, alt: brand.title }],
    },
  };
}

export default async function BrandPage({ params }: { params: Params }) {
  const { slug } = await params;
  const brands = await readBrands();
  const brand = brands.find((item) => item.slug === slug);

  if (!brand) notFound();

  const brandProducts = await getProductsByBrand(brand.slug);

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Главная", url: "/" },
          { name: "Бренды", url: "/brands" },
          { name: brand.title, url: `/brands/${brand.slug}` },
        ])}
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">
            {brand.origin}
          </p>
          <h1 className="mt-3 text-balance text-5xl font-semibold leading-tight text-stone-950 md:text-7xl">
            {brand.title}
          </h1>
          {brand.latin ? (
            <p className="mt-3 text-xl font-medium text-olive-800">{brand.latin}</p>
          ) : null}
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-650">
            {brand.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {brand.focus.map((item) => (
              <span className="rounded-md bg-linen-100 px-3 py-1.5 text-sm font-semibold text-stone-700" key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="primary-link" href={`/catalog?brand=${brand.slug}`}>
              Продукты бренда
            </Link>
            <Link className="secondary-link" href="/contacts">
              Связаться с отделом продаж
            </Link>
          </div>
        </div>

        <div className="grid overflow-hidden rounded-md border border-stone-200 bg-linen-100 shadow-sm">
          <div className="relative grid min-h-[360px] place-items-center px-8 py-12">
            <span
              aria-hidden
              className="absolute inset-x-10 top-0 h-1 rounded-b-md"
              style={{ backgroundColor: brand.accent }}
            />
            <div className="relative grid w-full max-w-lg place-items-center rounded-md border border-white/80 bg-white px-8 py-12 text-center shadow-sm">
              <BrandFlags className="absolute right-4 top-4" codes={brand.flagCodes} />
              {brand.logoImage ? (
                <Image
                  alt={`${brand.title} logo`}
                  className="h-auto max-h-[190px] w-full max-w-[420px] object-contain"
                  height={180}
                  src={brand.logoImage}
                  unoptimized
                  width={420}
                />
              ) : (
                <>
                  <p
                    className="break-words text-balance text-3xl font-semibold leading-tight tracking-normal [overflow-wrap:anywhere] md:text-5xl"
                    style={{ color: brand.accent }}
                  >
                    {brand.logoText ?? brand.latin ?? brand.title}
                  </p>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {brand.logoSubtext ?? brand.origin}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="rounded-md bg-linen-100 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">Фокус</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">{brand.focus[0]}</h2>
          </div>
          <div className="rounded-md bg-linen-100 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">Происхождение</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">{brand.origin}</h2>
          </div>
          <div className="rounded-md bg-linen-100 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">Карточек</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-950">{brandProducts.length}</h2>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          description={
            brandProducts.length
              ? "Фото, назначение, ключевые ингредиенты и переход к карточкам товаров."
              : "Ассортимент бренда обновляется."
          }
          eyebrow="Продукты"
          title={`Каталог ${brand.title}`}
        />
        {brandProducts.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {brandProducts.map((product) => (
              <ProductCard brandTitle={brand.title} product={product} key={product.slug} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-md border border-stone-200 bg-white p-8 text-stone-650">
            Ассортимент бренда обновляется.
          </div>
        )}
      </section>
    </main>
  );
}
