import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { RichText } from "@/components/rich-text";
import { posts, getPost } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

const labels = {
  article: "Статья",
  news: "Новость",
  promo: "Акция",
  seminar: "Семинар",
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.image, alt: post.imageAlt }],
      type: "article",
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Главная", url: "/" },
          { name: "Новости", url: "/news" },
          { name: post.title, url: `/news/${post.slug}` },
        ])}
      />
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">
          {labels[post.category]} · {formatDate(post.date)}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-stone-950 md:text-6xl">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-stone-650">{post.description}</p>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-md border border-stone-200 bg-white">
          <Image
            alt={post.imageAlt}
            className="object-contain p-8"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            src={post.image}
            unoptimized
          />
        </div>
        <RichText body={post.body} />
      </article>
    </main>
  );
}

