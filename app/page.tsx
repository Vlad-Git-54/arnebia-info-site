import Image from "next/image";
import Link from "next/link";
import { BrandCard } from "@/components/brand-card";
import { Icon } from "@/components/icons";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { companyFacts, homeBanners } from "@/content/site";
import { brands } from "@/content/taxonomy";
import { posts, products } from "@/lib/content";

const heroProductSlugs = [
  "arnebia-skinstaff",
  "villaphyta-feet-deo-spray",
  "villaphyta-bifidobalance",
  "atlantomarin-comfort-rinse",
];

const heroProducts = heroProductSlugs
  .map((slug) => products.find((product) => product.slug === slug))
  .filter((product): product is (typeof products)[number] => Boolean(product));
const featuredBrands = brands.filter((brand) => brand.featured);
const popularProducts = products.filter((product) => product.isPopular).slice(0, 6);
const latestPosts = posts.slice(0, 3);

const advantages = [
  "30+ лет экспертной работы с натуральной косметикой, витаминами и БАДами",
  "Собственные бренды и европейские партнеры с сильной отраслевой экспертизой",
  "Образовательные семинары, справочники и консультационная поддержка партнеров",
  "Каталог, справочники и материалы для уверенного выбора продуктов",
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
        <div className="hero-grid items-center gap-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md border border-olive-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-olive-900">
              <Icon className="h-4 w-4" name="spark" />
              Натуральная экспертиза с 1990-х
            </p>
            <h1 className="mt-6 max-w-4xl text-balance text-6xl font-semibold leading-[0.98] text-stone-950 md:text-8xl">
              Арнебия
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-2xl font-semibold leading-tight text-stone-950 md:text-4xl">
              Натуральная косметика, витамины, БАДы и эфирные масла.
            </p>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-stone-650 md:text-lg">
              ООО «Арнебия» производит и дистрибьютирует натуральную косметику, эфирные масла, БАДы и витамины. В каталоге собраны бренды, составы, рекомендации и экспертные материалы для осознанного выбора.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="primary-link" href="/catalog">
                <Icon className="h-4 w-4" name="search" />
                <span>Смотреть каталог</span>
              </Link>
              <Link className="secondary-link" href="/about">
                <Icon className="h-4 w-4" name="leaf" />
                <span>О компании</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {heroProducts.map((product, index) => (
              <Link
                className="group relative aspect-[4/5] overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                href={`/catalog/${product.slug}`}
                key={product.slug}
              >
                <Image
                  alt={product.imageAlt}
                  className="object-contain p-5 transition duration-500 group-hover:scale-105"
                  fill
                  priority={index < 2}
                  sizes="(max-width: 768px) 45vw, 240px"
                  src={product.image}
                  unoptimized
                />
                <span className="absolute bottom-3 left-3 right-3 rounded-md bg-white/90 px-3 py-2 text-xs font-semibold leading-snug text-stone-900 shadow-sm">
                  {product.badge ?? product.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {companyFacts.map((fact) => (
            <div className="rounded-md border border-stone-200 bg-white/80 p-4" key={fact.label}>
              <p className="text-3xl font-semibold text-olive-900">{fact.value}</p>
              <p className="mt-1 text-sm leading-6 text-stone-650">{fact.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {homeBanners.map((banner, index) => (
              <Link
                className={
                  index === 0
                    ? "group relative min-h-[220px] overflow-hidden rounded-md border border-stone-200 bg-linen-100 shadow-sm md:col-span-2 xl:col-span-2"
                    : "group relative min-h-[220px] overflow-hidden rounded-md border border-stone-200 bg-linen-100 shadow-sm"
                }
                href={banner.href}
                key={banner.title}
              >
                <Image
                  alt={banner.title}
                  className="object-cover transition duration-500 group-hover:scale-105"
                  fill
                  sizes={index === 0 ? "(max-width: 1280px) 100vw, 470px" : "(max-width: 768px) 100vw, 230px"}
                  src={banner.image}
                  unoptimized
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/82 to-transparent p-5 pt-16 text-white">
                  <span className="block text-lg font-semibold leading-tight">{banner.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-white/82">{banner.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              description="От собственных линий Виллафита и Арнебия Селекшн до европейских брендов натуральной косметики, ароматерапии и нутрицевтиков."
              eyebrow="Наши бренды"
              title="Портфель для аптек, косметического ритейла и осознанного ухода"
            />
            <Link className="secondary-link self-start md:self-end" href="/brands">
              <span>Все бренды</span>
              <Icon className="h-4 w-4" name="arrow" />
            </Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {featuredBrands.map((brand) => (
              <BrandCard brand={brand} key={brand.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            description="Новинки и востребованные позиции из направлений ухода, витаминов, БАДов, ароматерапии и натуральной косметики."
            eyebrow="Каталог"
            title="Популярные и новые продукты"
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {popularProducts.map((product) => (
              <ProductCard product={product} key={product.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-olive-900 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-olive-200">
              Почему Арнебия
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight md:text-5xl">
              Экологичный ассортимент с понятной экспертной основой
            </h2>
          </div>
          <div className="grid gap-3">
            {advantages.map((advantage) => (
              <div className="flex gap-3 rounded-md bg-white/8 p-4" key={advantage}>
                <Icon className="mt-1 h-5 w-5 shrink-0 text-olive-200" name="check" />
                <p className="text-sm leading-7 text-olive-50">{advantage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              description="Новости, образовательные события, акции и экспертные материалы для покупателей и партнеров."
              eyebrow="Новости и блог"
              title="Материалы Арнебии"
            />
            <Link className="secondary-link self-start md:self-end" href="/news">
              <span>Все материалы</span>
              <Icon className="h-4 w-4" name="arrow" />
            </Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard post={post} key={post.slug} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
