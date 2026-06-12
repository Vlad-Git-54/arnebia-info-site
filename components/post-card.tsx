import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types/content";

const labels = {
  article: "Статья",
  news: "Новость",
  promo: "Акция",
};

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="grid overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link className="relative block aspect-[16/10] bg-linen-100" href={`/news/${post.slug}`}>
        <Image
          alt={post.imageAlt}
          className="h-full w-full object-contain"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={post.image}
          style={{ objectFit: "contain" }}
          unoptimized
        />
      </Link>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700">
          {labels[post.category]} · {formatDate(post.date)}
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-snug text-stone-950">
          <Link className="hover:text-olive-800" href={`/news/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-7 text-stone-650">{post.description}</p>
      </div>
    </article>
  );
}
