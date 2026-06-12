import type { CSSProperties } from "react";

const flagStyles: Record<string, CSSProperties> = {
  ru: {
    background: "linear-gradient(to bottom, #ffffff 0 33.33%, #1f57a4 33.33% 66.66%, #d52b1e 66.66% 100%)",
  },
  de: {
    background: "linear-gradient(to bottom, #111111 0 33.33%, #dd0000 33.33% 66.66%, #ffce00 66.66% 100%)",
  },
  it: {
    background: "linear-gradient(to right, #009246 0 33.33%, #ffffff 33.33% 66.66%, #ce2b37 66.66% 100%)",
  },
  fr: {
    background: "linear-gradient(to right, #0055a4 0 33.33%, #ffffff 33.33% 66.66%, #ef4135 66.66% 100%)",
  },
};

const flagLabels: Record<string, string> = {
  ru: "Россия",
  de: "Германия",
  it: "Италия",
  fr: "Франция",
};

export function BrandFlags({ className = "", codes }: { className?: string; codes?: string[] }) {
  const flags = (codes ?? []).filter((code) => flagStyles[code]);

  if (!flags.length) return null;

  return (
    <span className={`flex items-center gap-1 ${className}`.trim()} aria-label="Страны бренда">
      {flags.map((code) => (
        <span
          aria-label={flagLabels[code]}
          className="block h-3.5 w-5 rounded-[2px] border border-stone-200 shadow-sm"
          key={code}
          role="img"
          style={flagStyles[code]}
          title={flagLabels[code]}
        />
      ))}
    </span>
  );
}
