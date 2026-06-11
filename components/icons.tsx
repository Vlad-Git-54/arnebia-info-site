import type { SVGProps } from "react";

type IconName =
  | "arrow"
  | "check"
  | "external"
  | "filter"
  | "leaf"
  | "mail"
  | "map"
  | "menu"
  | "phone"
  | "search"
  | "spark"
  | "telegram";

const paths: Record<IconName, string[]> = {
  arrow: ["M5 12h14", "m13 6 6 6-6 6"],
  check: ["m5 13 4 4L19 7"],
  external: ["M7 7h10v10", "M7 17 17 7", "M7 7v10h10"],
  filter: ["M4 7h16", "M7 12h10", "M10 17h4"],
  leaf: ["M5 19c9 0 14-5 14-14C10 5 5 10 5 19Z", "M5 19c3-6 7-9 14-14"],
  mail: ["M4 6h16v12H4z", "m4 7 8 6 8-6"],
  map: ["M9 18 4 20V6l5-2 6 2 5-2v14l-5 2-6-2Z", "M9 4v14", "M15 6v14"],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  phone: ["M7 4h3l1 5-2 1c1 2 3 4 5 5l1-2 5 1v3c0 2-2 3-4 3C10 20 4 14 4 8c0-2 1-4 3-4Z"],
  search: ["M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z", "m16 16 4 4"],
  spark: ["M12 3l2.5 6L21 12l-6.5 3L12 21l-2.5-6L3 12l6.5-3L12 3Z"],
  telegram: ["M21 5 3 12l6 2 2 6 3-4 5 3 2-14Z", "m9 14 9-8"],
};

export function Icon({
  name,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name].map((d) => (
        <path d={d} key={d} />
      ))}
    </svg>
  );
}

