"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

type Order = {
  id: string;
  total: number;
  status: string;
  paymentMethod: string;
  address: { name: string; city: string };
  items: { title: string; quantity: number }[];
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    const response = await api.get<Order[]>("/orders");
    setOrders(response.data);
  }

  useEffect(() => {
    api.get<Order[]>("/orders").then((response) => setOrders(response.data));
  }, []);

  async function updateStatus(id: string, status: string) {
    await api.patch(`/orders/${id}/status`, { status });
    toast.success("Order updated");
    await load();
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <span className="text-sm text-slate-500">{orders.length} total</span>
      </div>
      <div className="mt-5 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-[24px] border border-slate-100 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{order.address.name}</p>
                <p className="text-sm text-slate-500">{order.address.city} • {order.paymentMethod}</p>
                <p className="mt-2 text-sm text-slate-600">{order.items.map((item) => `${item.title} x${item.quantity}`).join(", ")}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">Rs {order.total}</p>
                <select value={order.status} onChange={(e) => void updateStatus(order.id, e.target.value)} className="rounded-full border border-slate-200 px-4 py-2 outline-none">
                  <option value="Pending">Pending</option>
                  <option value="Packed">Packed</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
