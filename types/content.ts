export type MarketplaceLinks = {
  wildberries?: string;
  ozon?: string;
};

export type Brand = {
  slug: string;
  title: string;
  latin?: string;
  short: string;
  description: string;
  origin: string;
  focus: string[];
  image: string;
  accent: string;
  featured?: boolean;
};

export type Category = {
  slug: string;
  title: string;
  description: string;
};

export type Product = {
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  brand: string;
  categories: string[];
  image: string;
  imageAlt: string;
  ingredients: string[];
  tags: string[];
  badge?: string;
  isNew?: boolean;
  isPopular?: boolean;
  marketplaces: MarketplaceLinks;
  body: string;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: "news" | "seminar" | "promo" | "article";
  image: string;
  imageAlt: string;
  tags: string[];
  body: string;
};

export type ParsedFrontmatter<T> = T & {
  body: string;
};

