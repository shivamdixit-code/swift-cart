import { AuthGuard } from "@/components/auth-guard";
import { OrdersPage } from "@/components/orders-page";

export default function Page() {
  return (
    <AuthGuard>
      <OrdersPage />
    </AuthGuard>
  );
}
