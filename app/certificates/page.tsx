import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { referenceDocuments } from "@/content/site";

export const metadata: Metadata = {
  title: "Справочники и каталоги",
  description: "Справочники, брошюры и каталоги продукции Арнебии.",
};

export default function CertificatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description="Каталоги брендов, справочники по продуктам, брошюры по витаминам, нутрицевтикам и натуральной косметике."
        eyebrow="Материалы"
        title="Справочники и каталоги"
      />
      <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {referenceDocuments.map((document) => (
          <article className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm" key={document.title}>
            <div className="relative aspect-[16/10] bg-linen-100">
              <Image
                alt={document.title}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                src={document.image}
                unoptimized
              />
            </div>
            <div className="grid gap-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">
                  PDF · {document.size}
                </p>
                <h2 className="mt-2 text-xl font-semibold leading-tight text-stone-950">{document.title}</h2>
                <p className="mt-3 text-sm leading-7 text-stone-650">{document.description}</p>
              </div>
              <a
                className="secondary-link justify-center"
                href={document.href}
                rel="noreferrer"
                target="_blank"
              >
                <Icon className="h-4 w-4" name="external" />
                <span>Скачать</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
