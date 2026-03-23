import { HomePage } from "@/components/home-page";
import { getCategories, getTrendingProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [categories, trending] = await Promise.all([getCategories(), getTrendingProducts()]);
  return <HomePage categories={categories} trending={trending} />;
}
