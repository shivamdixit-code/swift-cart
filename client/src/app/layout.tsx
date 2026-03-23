import type { Metadata } from "next";
import "./globals.css";
import { ClientShell } from "@/components/client-shell";

export const metadata: Metadata = {
  title: {
    default: "SwiftCart",
    template: "%s | SwiftCart",
  },
  description: "Quick-commerce storefront with fast grocery delivery, modern UI, and admin-ready backend.",
  keywords: ["quick commerce", "grocery delivery", "Next.js ecommerce", "SwiftCart"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
