import Link from "next/link";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Brand, Category } from "@/types/content";

export function CatalogFilters({
  activeBrand,
  activeCategory,
  brands,
  categories,
  query,
}: {
  activeBrand?: string;
  activeCategory?: string;
  brands: Brand[];
  categories: Category[];
  query?: string;
}) {
  return (
    <aside className="rounded-md border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
        <Icon className="h-4 w-4" name="filter" />
        <span>Фильтры</span>
      </div>

      <form action="/catalog" className="mt-4">
        <label className="sr-only" htmlFor="catalog-search">
          Поиск по каталогу
        </label>
        <div className="flex overflow-hidden rounded-md border border-stone-200 bg-linen-50">
          <input
            className="min-h-11 w-full bg-transparent px-3 text-sm outline-none placeholder:text-stone-400"
            defaultValue={query}
            id="catalog-search"
            name="q"
            placeholder="Поиск по продуктам"
            type="search"
          />
          <button className="grid w-11 place-items-center bg-olive-900 text-white" type="submit">
            <Icon className="h-4 w-4" name="search" />
            <span className="sr-only">Найти</span>
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h2 className="filter-title">Бренды</h2>
        <div className="mt-3 flex flex-wrap gap-2 lg:grid">
          <Link className={cn("filter-chip", !activeBrand && !activeCategory && "filter-chip-active")} href="/catalog">
            Все продукты
          </Link>
          {brands.map((brand) => (
            <Link
              className={cn("filter-chip", activeBrand === brand.slug && "filter-chip-active")}
              href={`/catalog?brand=${brand.slug}`}
              key={brand.slug}
            >
              {brand.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="filter-title">Категории</h2>
        <div className="mt-3 flex flex-wrap gap-2 lg:grid">
          {categories.map((category) => (
            <Link
              className={cn("filter-chip", activeCategory === category.slug && "filter-chip-active")}
              href={`/catalog/category/${category.slug}`}
              key={category.slug}
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
