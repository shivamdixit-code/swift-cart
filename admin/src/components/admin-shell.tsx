"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Shapes, ShoppingBasket, Users, LogOut } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { getAdminBasePath } from "@/lib/api";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: Shapes },
  { href: "/orders", label: "Orders", icon: ShoppingBasket },
  { href: "/users", label: "Users", icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = getAdminBasePath();
  const isLogin = pathname === `${basePath}/login`;

  if (isLogin) {
    return (
      <>
        {children}
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3ff] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-200 bg-white px-5 py-6">
          <div className="rounded-[28px] bg-[linear-gradient(145deg,#7c3aed,#2e1065)] p-5 text-white shadow-xl">
            <p className="text-xs uppercase tracking-[0.28em] text-purple-100">SwiftCart</p>
            <h1 className="mt-3 text-2xl font-semibold">Admin control</h1>
            <p className="mt-2 text-sm text-purple-100/85">Manage catalog, orders, and users from one clean dashboard.</p>
          </div>
          <nav className="mt-6 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === `${basePath}${link.href}` || (link.href !== "/" && pathname.startsWith(`${basePath}${link.href}`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${active ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => {
              window.localStorage.removeItem("swiftcart-admin-token");
              router.push("/login");
            }}
            className="mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </aside>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
