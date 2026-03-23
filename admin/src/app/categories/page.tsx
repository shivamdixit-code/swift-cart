import { AuthGuard } from "@/components/auth-guard";
import { CategoriesPage } from "@/components/categories-page";

export default function Page() {
  return (
    <AuthGuard>
      <CategoriesPage />
    </AuthGuard>
  );
}
