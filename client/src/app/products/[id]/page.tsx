import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/product-ui";
import { getProduct } from "@/lib/api";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
