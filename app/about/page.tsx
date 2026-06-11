import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { companyFacts, siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "ООО «Арнебия»: 30+ лет на рынке, натуральная косметика, БАДы, витамины, ароматерапия, InterCHARM и GreenAwards.",
};

const directions = [
  "витамины и биологически активные добавки",
  "ароматерапия и аромакосметика",
  "натуральная косметика",
  "аптечная косметика",
];

const partnerOffers = [
  "Для аптек и фармдистрибьюторов: витаминные комплексы, БАДы, тоники и аптечная косметика.",
  "Для косметического ритейла: натуральная косметика, эфирные масла, гидролаты и beauty-from-within продукты.",
  "Для SPA, массажных и wellness-центров: аромапродукция, методическая поддержка и профессиональные решения.",
  "Для фитнес- и йога-центров: ароматерапия, восстановительный уход и продукты для повседневных ритуалов.",
];

const awards = [
  "Золотая медаль InterCHARM за широкий зеленый ассортимент для российского потребителя",
  "Золотая медаль InterCHARM в номинации «Тренд года»",
  "Победы и финалы GreenAwards и Green Rating для отдельных продуктов",
];

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          description="Компания представляет на российском рынке качественную отечественную и европейскую продукцию для здоровья и красоты, развивая экспертные программы, собственные бренды и партнерскую дистрибуцию."
          eyebrow="О компании"
          title="Арнебия: 30+ лет натуральной экспертизы"
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {companyFacts.map((fact) => (
            <div className="rounded-md border border-stone-200 bg-white p-5" key={fact.label}>
              <p className="text-4xl font-semibold text-olive-900">{fact.value}</p>
              <p className="mt-2 text-sm leading-6 text-stone-650">{fact.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold text-stone-950">Дистрибьюторская деятельность</h2>
            <div className="mt-6 grid gap-3">
              {directions.map((direction) => (
                <div className="flex gap-3 rounded-md bg-linen-100 p-4" key={direction}>
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-olive-800" name="leaf" />
                  <p className="text-sm leading-7 text-stone-700">{direction}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-stone-950">Награды и признание</h2>
            <div className="mt-6 grid gap-3">
              {awards.map((award) => (
                <div className="flex gap-3 rounded-md bg-olive-50 p-4" key={award}>
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-clay-700" name="spark" />
                  <p className="text-sm leading-7 text-stone-700">{award}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          description="Арнебия развивает долгосрочные отношения с крупными и небольшими клиентами: от аптечных сетей до wellness-проектов."
          eyebrow="Партнерство"
          title="Предложения для профессионального рынка"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {partnerOffers.map((offer) => (
            <div className="rounded-md border border-stone-200 bg-white p-5" key={offer}>
              <p className="text-sm leading-7 text-stone-700">{offer}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-md bg-olive-900 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-olive-200">Мы всегда на связи</p>
          <p className="mt-3 text-lg leading-8">
            Отдел продаж: <a className="underline" href={`mailto:${siteConfig.salesEmail}`}>{siteConfig.salesEmail}</a>, {siteConfig.phone}
          </p>
          <Link className="mt-5 inline-flex rounded-md bg-white px-4 py-3 text-sm font-semibold text-olive-900" href="/contacts">
            Обсудить сотрудничество
          </Link>
        </div>
      </section>
    </main>
  );
}

