import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogFilters } from "@/components/catalog-filters";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { categories as staticCategories } from "@/content/taxonomy";
import { readBrands, readCategories, readSeoSettings } from "@/lib/admin-config";
import { getProductsByCategory } from "@/lib/content";
import { applySeoTemplate } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return staticCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const categories = await readCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) return {};

  const seo = await readSeoSettings();

  return {
    title: applySeoTemplate(seo.categoryTitleTemplate, {
      brand: "",
      category: category.title,
      title: category.title,
    }),
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const brands = await readBrands();
  const categories = await readCategories();
  const brandTitleBySlug = new Map(brands.map((item) => [item.slug, item.title]));
  const category = categories.find((item) => item.slug === slug);

  if (!category) notFound();

  const categoryProducts = await getProductsByCategory(slug);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description={category.description}
        eyebrow="Категория"
        title={category.title}
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <CatalogFilters activeCategory={slug} brands={brands} categories={categories} />
        <section>
          <div className="mb-5 rounded-md border border-stone-200 bg-white p-4">
            <p className="text-sm font-semibold text-stone-950">
              В категории: {categoryProducts.length}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categoryProducts.map((product) => (
              <ProductCard
                brandTitle={brandTitleBySlug.get(product.brand)}
                product={product}
                key={product.slug}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
