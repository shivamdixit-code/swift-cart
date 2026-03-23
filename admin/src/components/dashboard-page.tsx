"use client";

import { useEffect, useState } from "react";
import { PackageCheck, ShoppingBasket, Users } from "lucide-react";
import { api } from "@/lib/api";

type Product = { id: string; price: number };
type Order = { id: string; total: number; status: string };
type User = { id: string };

export function DashboardPage() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, active: 0 });

  useEffect(() => {
    void Promise.all([api.get<Order[]>("/orders"), api.get<User[]>("/users"), api.get<Product[]>("/products")]).then(
      ([ordersRes, usersRes, productsRes]) => {
        const orders = ordersRes.data;
        const users = usersRes.data;
        setStats({
          orders: orders.length,
          revenue: orders.reduce((sum, order) => sum + order.total, 0),
          users: users.length,
          active: productsRes.data.length,
        });
      }
    );
  }, []);

  const cards = [
    { label: "Total orders", value: stats.orders, icon: ShoppingBasket },
    { label: "Revenue", value: `Rs ${stats.revenue}`, icon: PackageCheck },
    { label: "Active users", value: stats.users, icon: Users },
    { label: "Live products", value: stats.active, icon: PackageCheck },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-purple-600">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold">Operations dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-2xl bg-purple-50 p-3 text-purple-700">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
