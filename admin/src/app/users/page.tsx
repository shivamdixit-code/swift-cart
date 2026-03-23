import { AuthGuard } from "@/components/auth-guard";
import { UsersPage } from "@/components/users-page";

export default function Page() {
  return (
    <AuthGuard>
      <UsersPage />
    </AuthGuard>
  );
}
