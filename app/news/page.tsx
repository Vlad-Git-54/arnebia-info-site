import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Новости и блог",
  description: "Новости, акции и экспертные статьи Арнебии о натуральном уходе, продуктах и wellness-направлениях.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description="Материалы для покупателей, партнеров и специалистов beauty- и wellness-направлений."
        eyebrow="Новости и блог"
        title="Экспертные материалы Арнебии"
      />
      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard post={post} key={post.slug} />
        ))}
      </div>
    </main>
  );
}
