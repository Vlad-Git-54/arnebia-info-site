import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { siteConfig } from "@/content/site";

const navItems = [
  { href: "/catalog", label: "Каталог" },
  { href: "/brands", label: "Бренды" },
  { href: "/about", label: "О компании" },
  { href: "/news", label: "Новости" },
  { href: "/certificates", label: "Справочники" },
  { href: "/contacts", label: "Контакты" },
];

function NavLinks({ className = "" }: { className?: string }) {
  return (
    <nav className={className} aria-label="Основная навигация">
      {navItems.map((item) => (
        <Link className="nav-link" href={item.href} key={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center" href="/" aria-label="Арнебия, главная">
          <Image
            alt="Арнебия"
            className="h-auto w-[148px] sm:w-[184px]"
            height={85}
            priority
            src="/brand/arnebia-logo.svg"
            unoptimized
            width={330}
          />
        </Link>

        <NavLinks className="hidden items-center gap-1 lg:flex" />

        <div className="hidden items-center gap-3 lg:flex">
          <a className="icon-link" href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}>
            <Icon className="h-4 w-4" name="phone" />
            <span>{siteConfig.phone}</span>
          </a>
          <Link className="primary-link" href="/catalog">
            <Icon className="h-4 w-4" name="search" />
            <span>Найти продукт</span>
          </Link>
        </div>

        <details className="mobile-menu lg:hidden">
          <summary aria-label="Открыть меню">
            <Icon className="h-5 w-5" name="menu" />
          </summary>
          <div className="absolute left-0 right-0 top-full border-b border-stone-200 bg-white px-4 py-5 shadow-xl">
            <NavLinks className="grid gap-2" />
            <div className="mt-4 grid gap-2">
              <a className="primary-link justify-center" href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}>
                <Icon className="h-4 w-4" name="phone" />
                <span>{siteConfig.phone}</span>
              </a>
              <Link className="secondary-link justify-center" href="/catalog">
                <Icon className="h-4 w-4" name="search" />
                <span>Каталог продукции</span>
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
