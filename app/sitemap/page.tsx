import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { brands, categories } from "@/content/taxonomy";
import { posts, products } from "@/lib/content";

export const metadata: Metadata = {
  title: "Карта сайта",
  description: "HTML-карта сайта Арнебии.",
};

const staticLinks: Array<[string, string]> = [
  ["/", "Главная"],
  ["/catalog", "Каталог"],
  ["/brands", "Бренды"],
  ["/about", "О компании"],
  ["/news", "Новости"],
  ["/seminars", "Семинары"],
  ["/promotions", "Акции"],
  ["/certificates", "Справочники"],
  ["/contacts", "Контакты"],
];

function LinkGroup({
  title,
  links,
}: {
  title: string;
  links: Array<[string, string]>;
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
      <div className="mt-4 grid gap-2">
        {links.map(([href, label]) => (
          <Link className="text-sm leading-7 text-olive-800 hover:text-stone-950" href={href} key={href}>
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function SitemapPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description="Быстрый доступ к основным страницам, брендам, категориям, продуктам и материалам блога."
        eyebrow="Навигация"
        title="Карта сайта"
      />
      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <LinkGroup title="Разделы" links={staticLinks} />
        <LinkGroup
          title="Бренды"
          links={brands.map((brand): [string, string] => [`/brands/${brand.slug}`, brand.title])}
        />
        <LinkGroup
          title="Категории"
          links={categories.map((category): [string, string] => [
            `/catalog/category/${category.slug}`,
            category.title,
          ])}
        />
        <LinkGroup
          title="Товары"
          links={products.map((product): [string, string] => [`/catalog/${product.slug}`, product.title])}
        />
        <LinkGroup
          title="Материалы"
          links={posts.map((post): [string, string] => [`/news/${post.slug}`, post.title])}
        />
      </div>
    </main>
  );
}
