import { AuthGuard } from "@/components/auth-guard";
import { DashboardPage } from "@/components/dashboard-page";

export default function Page() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
