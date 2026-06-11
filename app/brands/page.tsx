import type { Metadata } from "next";
import { BrandCard } from "@/components/brand-card";
import { SectionHeading } from "@/components/section-heading";
import { brands } from "@/content/taxonomy";

export const metadata: Metadata = {
  title: "Бренды",
  description:
    "Бренды в портфеле Арнебии: Виллафита, Арнебия Селекшн, Атлантомарин, Бенекос, Примавера, Гербатинт, Санатур и другие.",
};

export default function BrandsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description="Собственные линии Арнебии и европейские партнеры представлены отдельными страницами с категориями, продуктами и материалами."
        eyebrow="Бренды"
        title="Портфель натуральной косметики, ароматерапии и нутрицевтиков"
      />
      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <BrandCard brand={brand} key={brand.slug} />
        ))}
      </div>
    </main>
  );
}

