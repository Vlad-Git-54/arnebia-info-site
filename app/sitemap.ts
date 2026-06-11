import type { MetadataRoute } from "next";
import { brands, categories } from "@/content/taxonomy";
import { posts, products } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/catalog",
    "/brands",
    "/about",
    "/news",
    "/seminars",
    "/promotions",
    "/certificates",
    "/contacts",
    "/sitemap",
  ];

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
