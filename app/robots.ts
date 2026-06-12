import type { MetadataRoute } from "next";
import { readSeoSettings } from "@/lib/admin-config";
import { absoluteUrl } from "@/lib/utils";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await readSeoSettings();

  return {
    rules: {
      userAgent: "*",
      allow: seo.robotsIndex ? "/" : undefined,
      disallow: seo.robotsIndex ? ["/admin", "/api/admin"] : "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
