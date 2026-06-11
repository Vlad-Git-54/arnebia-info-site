import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Акции",
  description: "Акции и маркетинговые материалы Арнебии.",
};

export default function PromotionsPage() {
  const promos = posts.filter((post) => post.category === "promo");

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description="Информационные материалы о специальных предложениях и навигации на маркетплейсы."
        eyebrow="Акции"
        title="Актуальные предложения и промо"
      />
      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {promos.map((post) => (
          <PostCard post={post} key={post.slug} />
        ))}
      </div>
    </main>
  );
}

