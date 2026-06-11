import { Icon } from "@/components/icons";
import type { MarketplaceLinks as MarketplaceLinkType } from "@/types/content";

const marketplaces = [
  { key: "wildberries", label: "Wildberries" },
  { key: "ozon", label: "Ozon" },
] as const;

export function MarketplaceLinks({
  links,
  compact = false,
}: {
  links: MarketplaceLinkType;
  compact?: boolean;
}) {
  const visibleLinks = marketplaces.filter(({ key }) => links[key]);

  if (!visibleLinks.length) return null;

  if (compact) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-olive-800">
          Где купить
        </p>
        <div className="mt-3 grid gap-2">
          {visibleLinks.map(({ key, label }) => (
            <a
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-950 transition hover:border-olive-700 hover:bg-olive-50 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2"
              href={links[key]}
              key={key}
              rel="noreferrer"
              target="_blank"
            >
              <span>{label}</span>
              <Icon className="h-4 w-4" name="external" />
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-olive-200 bg-olive-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-olive-800">
        Где купить
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {visibleLinks.map(({ key, label }) => (
          <a
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-olive-800 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2"
            href={links[key]}
            key={key}
            rel="noreferrer"
            target="_blank"
          >
            <span>{label}</span>
            <Icon className="h-4 w-4" name="external" />
          </a>
        ))}
      </div>
    </div>
  );
}
