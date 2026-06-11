import { siteConfig } from "@/content/site";
import { brands, categories } from "@/content/taxonomy";
import type { Product } from "@/types/content";
import { absoluteUrl } from "@/lib/utils";

export const defaultSeo = {
  title: "Арнебия — натуральная косметика, БАДы, витамины и эфирные масла",
  description:
    "ООО «Арнебия»: натуральная косметика, эфирные масла, БАДы, витамины, бренды, новости, семинары и контакты.",
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: absoluteUrl("/"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Южнопортовая, д. 6/28",
      addressLocality: "Москва",
      postalCode: "115193",
      addressCountry: "RU",
    },
    sameAs: [siteConfig.telegramUrl, siteConfig.dzenUrl],
    brand: brands.map((brand) => brand.title),
  };
}

export function productJsonLd(product: Product) {
  const brand = brands.find((item) => item.slug === product.brand);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: brand?.title ?? product.brand,
    },
    category: product.categories
      .map((slug) => categories.find((category) => category.slug === slug)?.title)
      .filter(Boolean)
      .join(", "),
    additionalProperty: product.ingredients.map((ingredient) => ({
      "@type": "PropertyValue",
      name: "Ключевой ингредиент",
      value: ingredient,
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/catalog")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
