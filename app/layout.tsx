import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { defaultSeo, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.arnebia.ru"),
  title: {
    default: defaultSeo.title,
    template: "%s | Арнебия",
  },
  description: defaultSeo.description,
  keywords: [
    "Арнебия",
    "натуральная косметика",
    "эфирные масла",
    "БАДы",
    "витамины",
    "Виллафита",
    "Арнебия Селекшн",
  ],
  openGraph: {
    title: defaultSeo.title,
    description: defaultSeo.description,
    locale: "ru_RU",
    siteName: "Арнебия",
    type: "website",
    url: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f8f6ef",
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

