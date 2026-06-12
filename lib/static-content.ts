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

export const staticProducts = parseCollection<Product>(productModules).sort((a, b) =>
  a.title.localeCompare(b.title, "ru"),
);

export const staticPosts = parseCollection<Post>(postModules).sort((a, b) =>
  b.date.localeCompare(a.date),
);

