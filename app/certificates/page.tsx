import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Сертификаты",
  description: "Сертификаты, справочники и каталоги продукции Арнебии.",
};

const documents = [
  {
    title: "АРНЕБИЯ СЕЛЕКШН: каталог косметики",
    description: "Доступная инновационная дерматокосметика из России.",
  },
  {
    title: "Справочник по продуктам компании Арнебия",
    description: "Общий каталог-справочник по брендам, направлениям и продуктам.",
  },
  {
    title: "Натуральная косметика от А до Я",
    description: "Справочные материалы для покупателей и специалистов.",
  },
  {
    title: "Витамины и минералы в эстетической практике",
    description: "Материалы по нутрикосметологии и поддержке кожи.",
  },
];

export default function CertificatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description="Раздел для PDF-каталогов, сертификатов, экспертных брошюр и материалов для партнеров."
        eyebrow="Сертификаты"
        title="Документы, справочники и каталоги"
      />
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {documents.map((document) => (
          <article className="rounded-md border border-stone-200 bg-white p-6 shadow-sm" key={document.title}>
            <Icon className="h-6 w-6 text-olive-800" name="check" />
            <h2 className="mt-4 text-2xl font-semibold text-stone-950">{document.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-650">{document.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

