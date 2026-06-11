import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type { Brand } from "@/types/content";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <article className="grid overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link className="relative block aspect-[5/3] bg-linen-100" href={`/brands/${brand.slug}`}>
        <Image
          alt={`Продукция бренда ${brand.title}`}
          className="object-contain p-8"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={brand.image}
          unoptimized
        />
      </Link>
      <div className="grid gap-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">
            {brand.origin}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-stone-950">{brand.title}</h3>
          <p className="mt-2 text-sm leading-7 text-stone-650">{brand.short}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {brand.focus.slice(0, 3).map((item) => (
            <span className="rounded-md bg-linen-100 px-2.5 py-1 text-xs text-stone-700" key={item}>
              {item}
            </span>
          ))}
        </div>
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-olive-800 hover:text-stone-950"
          href={`/brands/${brand.slug}`}
        >
          <span>О бренде</span>
          <Icon className="h-4 w-4" name="arrow" />
        </Link>
      </div>
    </article>
  );
}

