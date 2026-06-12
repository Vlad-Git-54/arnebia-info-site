import type { MetadataRoute } from "next";
import { readBrands, readCategories } from "@/lib/admin-config";
import { getPosts, getProducts } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/catalog",
    "/brands",
    "/about",
    "/news",
    "/promotions",
    "/certificates",
    "/contacts",
    "/sitemap",
  ];

  const products = await getProducts();
  const posts = await getPosts();
  const brands = await readBrands();
  const categories = await readCategories();
  const productRoutes = products.map((product) => `/catalog/${product.slug}`);
  const brandRoutes = brands.map((brand) => `/brands/${brand.slug}`);
  const categoryRoutes = categories.map((category) => `/catalog/category/${category.slug}`);
  const postRoutes = posts.map((post) => `/news/${post.slug}`);

  return [...staticRoutes, ...productRoutes, ...brandRoutes, ...categoryRoutes, ...postRoutes].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route.includes("/news/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/catalog") ? 0.85 : 0.7,
  }));
}
