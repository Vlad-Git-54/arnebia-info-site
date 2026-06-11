import { parseFrontmatter } from "@/lib/frontmatter";
import type { Post, Product } from "@/types/content";

const productModules = import.meta.glob("../content/products/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default",
});

const postModules = import.meta.glob("../content/posts/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default",
});

function parseCollection<T extends Record<string, unknown>>(
  modules: Record<string, unknown>,
) {
  return Object.values(modules).map((source) => {
    if (typeof source !== "string") {
      throw new Error("Expected raw MDX content as a string.");
    }

    return parseFrontmatter<T>(source);
  });
}

export const products = parseCollection<Product>(productModules).sort((a, b) =>
  a.title.localeCompare(b.title, "ru"),
);

export const posts = parseCollection<Post>(postModules).sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getProductsByBrand(brand: string) {
  return products.filter((product) => product.brand === brand);
}

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.categories.includes(category));
}

export function searchProducts(query: string) {
  const normalized = query.trim().toLocaleLowerCase("ru");

  if (!normalized) return products;

  return products.filter((product) =>
    [
      product.title,
      product.description,
      product.brand,
      ...product.categories,
      ...product.ingredients,
      ...product.tags,
    ]
      .join(" ")
      .toLocaleLowerCase("ru")
      .includes(normalized),
  );
}

