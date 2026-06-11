import Link from "next/link";
import { Icon } from "@/components/icons";
import { siteConfig } from "@/content/site";
import { brands, categories } from "@/content/taxonomy";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link className="flex items-center gap-3" href="/" aria-label="Арнебия, главная">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-olive-500 text-stone-950">
              <Icon className="h-5 w-5" name="leaf" />
            </span>
            <span>
              <span className="block text-lg font-semibold leading-none">Арнебия</span>
              <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-stone-400">
                алгоритмы красоты и здоровья
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-stone-300">
            Информационный сайт производителя и дистрибьютора натуральной косметики, эфирных масел, БАДов и витаминов.
          </p>
          <div className="mt-5 flex gap-2">
            <a className="footer-social" href={siteConfig.telegramUrl} rel="noreferrer" target="_blank">
              <Icon className="h-4 w-4" name="telegram" />
              <span className="sr-only">Telegram</span>
            </a>
            <a className="footer-social" href={`mailto:${siteConfig.email}`}>
              <Icon className="h-4 w-4" name="mail" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>

        <div>
          <h2 className="footer-title">Разделы</h2>
          <div className="footer-links">
            {[
              ["/catalog", "Каталог"],
              ["/about", "О компании"],
              ["/news", "Новости и блог"],
              ["/seminars", "Семинары"],
              ["/promotions", "Акции"],
              ["/certificates", "Сертификаты"],
              ["/sitemap", "Карта сайта"],
            ].map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="footer-title">Бренды</h2>
          <div className="footer-links">
            {brands.slice(0, 7).map((brand) => (
              <Link href={`/brands/${brand.slug}`} key={brand.slug}>
                {brand.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="footer-title">Категории</h2>
          <div className="footer-links">
            {categories.slice(0, 7).map((category) => (
              <Link href={`/catalog/category/${category.slug}`} key={category.slug}>
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-stone-400">
        © 2026 ООО «Арнебия». Информационный сайт без корзины, цен и онлайн-оформления заказа.
      </div>
    </footer>
  );
}

