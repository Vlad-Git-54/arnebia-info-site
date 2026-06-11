import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Новости и блог",
  description: "Новости, акции, семинары и экспертные статьи Арнебии.",
};

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description="Материалы для покупателей, партнеров, специалистов wellness и beauty-направлений."
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

