import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { readSeoSettings } from "@/lib/admin-config";
import { defaultSeo, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await readSeoSettings();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://arnebia-info.ru"),
    title: {
      default: seo.siteTitle || defaultSeo.title,
      template: "%s | Арнебия",
    },
    description: seo.siteDescription || defaultSeo.description,
    keywords: seo.siteKeywords,
    openGraph: {
      title: seo.ogTitle || seo.siteTitle || defaultSeo.title,
      description: seo.ogDescription || seo.siteDescription || defaultSeo.description,
      images: seo.ogImage ? [{ url: seo.ogImage, alt: "Арнебия" }] : undefined,
      locale: "ru_RU",
      siteName: "Арнебия",
      type: "website",
      url: "/",
    },
    robots: seo.robotsIndex
      ? undefined
      : {
          follow: false,
          index: false,
        },
    icons: {
      icon: "/favicon.png?v=2",
      shortcut: "/favicon.png?v=2",
      apple: "/favicon.png?v=2",
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  themeColor: "#fcfaf4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
