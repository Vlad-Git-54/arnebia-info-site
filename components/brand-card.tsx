import type { CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type { Brand } from "@/types/content";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <article className="grid overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link
        className="group relative grid min-h-[178px] place-items-center overflow-hidden bg-linen-100 px-6 py-8"
        href={`/brands/${brand.slug}`}
        style={{ "--brand-accent": brand.accent } as CSSProperties}
      >
        <span
          aria-hidden
          className="absolute inset-x-8 top-0 h-1 rounded-b-md"
          style={{ backgroundColor: brand.accent }}
        />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_44%)]" />
        <span className="relative grid min-h-[108px] w-full place-items-center rounded-md border border-white/80 bg-white/80 px-5 py-6 text-center shadow-sm transition duration-300 group-hover:scale-[1.02]">
          <span
            className="block max-w-full break-words text-balance text-xl font-semibold leading-tight tracking-normal text-stone-950 [overflow-wrap:anywhere] sm:text-2xl"
            style={{ color: brand.accent }}
          >
            {brand.logoText ?? brand.latin ?? brand.title}
          </span>
          <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            {brand.logoSubtext ?? brand.origin}
          </span>
        </span>
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
