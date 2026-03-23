import { AuthGuard } from "@/components/auth-guard";
import { ProductsPage } from "@/components/products-page";

export default function Page() {
  return (
    <AuthGuard>
      <ProductsPage />
    </AuthGuard>
  );
}
