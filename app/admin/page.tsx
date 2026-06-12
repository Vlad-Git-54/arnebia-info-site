import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { defaultAdminContent } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Админка",
  robots: {
    follow: false,
    index: false,
  },
};

export default function AdminPage() {
  const initialContent = defaultAdminContent();

  return (
    <AdminDashboard
      initialContent={initialContent}
      summary={{
        brands: initialContent.brands.length,
        categories: initialContent.categories.length,
        posts: initialContent.posts.length,
        products: initialContent.products.length,
        references: initialContent.references.length,
      }}
    />
  );
}
