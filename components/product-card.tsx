import Image from "next/image";
import Link from "next/link";
import { MarketplaceLinks } from "@/components/marketplace-links";
import type { Product } from "@/types/content";

export function ProductCard({
  brandTitle,
  product,
}: {
  brandTitle?: string;
  product: Product;
}) {
  return (
    <article className="group grid overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        aria-label={product.title}
        className="relative block aspect-square overflow-hidden bg-gradient-to-br from-white to-linen-100"
        href={`/catalog/${product.slug}`}
      >
        <Image
          alt={product.imageAlt}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={product.image}
          style={{ objectFit: "contain" }}
          unoptimized
        />
        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold text-olive-900 shadow-sm">
            {product.badge}
          </span>
        ) : null}
      </Link>
      <div className="grid gap-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">
            {brandTitle ?? product.brand}
          </p>
          <h3 className="mt-2 text-lg font-semibold leading-snug text-stone-950">
            <Link className="hover:text-olive-800" href={`/catalog/${product.slug}`}>
              {product.title}
            </Link>
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-650">
            {product.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.ingredients.slice(0, 3).map((ingredient) => (
            <span
              className="rounded-md border border-stone-200 px-2.5 py-1 text-xs text-stone-650"
              key={ingredient}
            >
              {ingredient}
            </span>
          ))}
        </div>
        <MarketplaceLinks compact links={product.marketplaces} />
      </div>
    </article>
  );
}
