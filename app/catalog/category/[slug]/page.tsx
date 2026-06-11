import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogFilters } from "@/components/catalog-filters";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { categories, getCategory } from "@/content/taxonomy";
import { getProductsByCategory } from "@/lib/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) return {};

  return {
    title: category.title,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) notFound();

  const categoryProducts = getProductsByCategory(slug);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description={category.description}
        eyebrow="Категория"
        title={category.title}
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <CatalogFilters activeCategory={slug} />
        <section>
          <div className="mb-5 rounded-md border border-stone-200 bg-white p-4">
            <p className="text-sm font-semibold text-stone-950">
              В категории: {categoryProducts.length}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categoryProducts.map((product) => (
              <ProductCard product={product} key={product.slug} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

