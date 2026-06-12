import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты ООО «Арнебия»: адрес, телефон, email, форма обратной связи, Telegram и WhatsApp.",
};

const contactCards = [
  { icon: "phone" as const, label: "Телефон", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}` },
  { icon: "mail" as const, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: "map" as const, label: "Адрес", value: siteConfig.address, href: "https://yandex.ru/maps/-/CHfLQL09" },
];

export default function ContactsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description="Свяжитесь с Арнебией по вопросам дистрибуции, партнерских программ, каталогов и справочников."
        eyebrow="Контакты"
        title="Мы всегда на связи"
      />
      <div className="mt-9 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="grid gap-4">
          {contactCards.map((card) => (
            <a
              className="flex gap-4 rounded-md border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              href={card.href}
              key={card.label}
              rel={card.href.startsWith("http") ? "noreferrer" : undefined}
              target={card.href.startsWith("http") ? "_blank" : undefined}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-olive-50 text-olive-900">
                <Icon className="h-5 w-5" name={card.icon} />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">
                  {card.label}
                </span>
                <span className="mt-2 block text-base font-semibold leading-7 text-stone-950">
                  {card.value}
                </span>
              </span>
            </a>
          ))}
          <div className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">Время работы</h2>
            <p className="mt-2 text-sm leading-7 text-stone-650">{siteConfig.worktime}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a className="primary-link" href={siteConfig.telegramUrl} rel="noreferrer" target="_blank">
                <Icon className="h-4 w-4" name="telegram" />
                <span>Telegram</span>
              </a>
              <a className="secondary-link" href={siteConfig.whatsappUrl} rel="noreferrer" target="_blank">
                <Icon className="h-4 w-4" name="phone" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
        <ContactForm />
      </div>
    </main>
  );
}
