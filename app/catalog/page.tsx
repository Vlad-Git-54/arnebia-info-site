import type { Metadata } from "next";
import { CatalogFilters } from "@/components/catalog-filters";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { readBrands, readCategories } from "@/lib/admin-config";
import { getProducts, searchProductsIn } from "@/lib/content";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: "Каталог продукции",
  description:
    "Каталог продукции Арнебии по брендам и категориям: косметика, БАДы, витамины, эфирные масла и уход за полостью рта.",
};

export const dynamic = "force-dynamic";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params: Record<string, string | string[] | undefined> = searchParams
    ? await searchParams
    : {};
  const query = firstParam(params.q) ?? "";
  const activeBrand = firstParam(params.brand);
  const brands = await readBrands();
  const categories = await readCategories();
  const brandTitleBySlug = new Map(brands.map((item) => [item.slug, item.title]));
  const brand = activeBrand ? brands.find((item) => item.slug === activeBrand) : undefined;
  const products = await getProducts();

  const searched = query ? searchProductsIn(products, query) : products;
  const filtered = activeBrand
    ? searched.filter((product) => product.brand === activeBrand)
    : searched;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description="Фильтруйте продукты по брендам и категориям, изучайте составы и выбирайте удобный маркетплейс в карточках товаров."
        eyebrow="Каталог"
        title={brand ? `Продукция ${brand.title}` : "Продукция Арнебии"}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <CatalogFilters
          activeBrand={activeBrand}
          brands={brands}
          categories={categories}
          query={query}
        />
        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 rounded-md border border-stone-200 bg-white p-4 sm:flex-row sm:items-center">
            <p className="text-sm font-semibold text-stone-950">
              Найдено: {filtered.length} из {products.length}
            </p>
            <p className="text-sm text-stone-650">
              Бренды: {brands.length} · Категории и подборки обновляются
            </p>
          </div>
          {filtered.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  brandTitle={brandTitleBySlug.get(product.brand)}
                  product={product}
                  key={product.slug}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-stone-200 bg-white p-8 text-center">
              <h2 className="text-2xl font-semibold text-stone-950">Ничего не найдено</h2>
              <p className="mt-3 text-sm leading-7 text-stone-650">
                Попробуйте изменить поисковый запрос или выбрать другой бренд.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
