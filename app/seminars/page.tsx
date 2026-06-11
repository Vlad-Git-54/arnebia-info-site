import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Семинары",
  description: "Семинары и образовательные мероприятия Арнебии для специалистов и партнеров.",
};

export default function SeminarsPage() {
  const seminars = posts.filter((post) => post.category === "seminar");

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        description="Очные и онлайн-мероприятия о натуральном уходе, нутрицевтиках, ароматерапии и wellness-подходах."
        eyebrow="Семинары"
        title="Образовательные события Арнебии"
      />
      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {seminars.map((post) => (
          <PostCard post={post} key={post.slug} />
        ))}
      </div>
    </main>
  );
}

