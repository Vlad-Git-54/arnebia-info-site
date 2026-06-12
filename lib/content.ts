import { readProducts, readPosts } from "@/lib/admin-config";
import { staticPosts, staticProducts } from "@/lib/static-content";
import type { Post, Product } from "@/types/content";

export const products = staticProducts;
export const posts = staticPosts;

function sortProducts(items: Product[]) {
  return [...items].sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

function sortPosts(items: Post[]) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getProducts() {
  return sortProducts(await readProducts());
}

export async function getPosts() {
  return sortPosts(await readPosts());
}

export async function getProduct(slug: string) {
  const runtimeProducts = await getProducts();

  return runtimeProducts.find((product) => product.slug === slug);
}

export async function getPost(slug: string) {
  const runtimePosts = await getPosts();

  return runtimePosts.find((post) => post.slug === slug);
}

export async function getProductsByBrand(brand: string) {
  const runtimeProducts = await getProducts();

  return runtimeProducts.filter((product) => product.brand === brand);
}

export async function getProductsByCategory(category: string) {
  const runtimeProducts = await getProducts();

  return runtimeProducts.filter((product) => product.categories.includes(category));
}

export function searchProductsIn(items: Product[], query: string) {
  const normalized = query.trim().toLocaleLowerCase("ru");

  if (!normalized) return items;

  return items.filter((product) =>
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

export async function searchProducts(query: string) {
  return searchProductsIn(await getProducts(), query);
}

