import type { MarketplaceLinks as MarketplaceLinkType } from "@/types/content";

const marketplaces = [
  { key: "wildberries", label: "Wildberries" },
  { key: "ozon", label: "Ozon" },
  { key: "apteka", label: "apteka.ru" },
  { key: "goldapple", label: "Золотое Яблоко" },
  { key: "letu", label: "ЛЭтуаль" },
  { key: "zdravcity", label: "Здравсити" },
  { key: "official", label: "Arnebia.ru" },
] as const;

type MarketplaceKey = (typeof marketplaces)[number]["key"];

function MarketplaceLogo({
  compact,
  type,
}: {
  compact: boolean;
  type: MarketplaceKey;
}) {
  const sizeClass = compact ? "h-6 w-12 text-[10px]" : "h-7 w-14 text-[11px]";

  if (type === "wildberries") {
    return (
      <span
        aria-hidden="true"
        className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded bg-gradient-to-br from-[#d91690] via-[#9b2bd6] to-[#5b2eea] px-2 font-black tracking-normal text-white shadow-sm`}
      >
        WB
      </span>
    );
  }

  if (type === "ozon") {
    return (
      <span
        aria-hidden="true"
        className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded bg-[#005bff] px-2 font-black tracking-normal text-white shadow-sm`}
      >
        OZON
      </span>
    );
  }

  if (type === "apteka") {
    return (
      <span
        aria-hidden="true"
        className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded bg-[#00a650] px-2 font-black tracking-normal text-white shadow-sm`}
      >
        АПТ
      </span>
    );
  }

  if (type === "goldapple") {
    return (
      <span
        aria-hidden="true"
        className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded bg-gradient-to-br from-[#ffcc33] to-[#f59e0b] px-2 font-black tracking-normal text-stone-950 shadow-sm`}
      >
        ЗЯ
      </span>
    );
  }

  if (type === "letu") {
    return (
      <span
        aria-hidden="true"
        className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded bg-[#111827] px-2 font-black tracking-normal text-white shadow-sm`}
      >
        ЛЭ
      </span>
    );
  }

  if (type === "zdravcity") {
    return (
      <span
        aria-hidden="true"
        className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded bg-gradient-to-br from-[#00a884] to-[#0070c9] px-2 font-black tracking-normal text-white shadow-sm`}
      >
        ZC
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded bg-olive-700 px-2 font-black tracking-normal text-white shadow-sm`}
    >
      AR
    </span>
  );
}

function getOfficialLabel(url: string | undefined) {
  if (!url) return "Подробнее";

  try {
    const host = new URL(url).hostname.replace(/^www\./, "");

    if (host === "arnebia.ru") return "Arnebia.ru";
    return host;
  } catch {
    return "Подробнее";
  }
}

function isArnebiaUrl(url: string | undefined) {
  if (!url) return false;

  try {
    return new URL(url).hostname.replace(/^www\./, "") === "arnebia.ru";
  } catch {
    return false;
  }
}

function getMarketplaceLabel(
  key: MarketplaceKey,
  label: string,
  links: MarketplaceLinkType,
) {
  if (key === "official") return getOfficialLabel(links.official);

  return label;
}

export function MarketplaceLinks({
  links,
  compact = false,
}: {
  links: MarketplaceLinkType;
  compact?: boolean;
}) {
  const visibleLinks = marketplaces.filter(({ key }) => links[key]);

  if (!visibleLinks.length) return null;

  const onlyOfficial =
    visibleLinks.length === 1 &&
    visibleLinks[0]?.key === "official" &&
    isArnebiaUrl(links.official);
  const heading = onlyOfficial ? "Подробнее" : "Где купить";

  if (compact) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-olive-800">
          {heading}
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
              <MarketplaceLogo compact={compact} type={key} />
              <span>{getMarketplaceLabel(key, label, links)}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-olive-200 bg-olive-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-olive-800">
        {heading}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {visibleLinks.map(({ key, label }) => (
          <a
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-olive-700 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-olive-800 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2"
            href={links[key]}
            key={key}
            rel="noreferrer"
            target="_blank"
          >
            <MarketplaceLogo compact={compact} type={key} />
            <span>{getMarketplaceLabel(key, label, links)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
