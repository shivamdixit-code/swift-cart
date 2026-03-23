"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Search, ShoppingBag, Trash2, MapPin } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useCartStore } from "@/store/cart-store";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const { items, total, isOpen, setOpen, syncCart, updateItem, removeItem } = useCartStore();

  useEffect(() => {
    void syncCart();
  }, [syncCart]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(12,10,25,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 text-white">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-purple-200">Delivery in 10 mins</p>
            <button className="mt-1 inline-flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-purple-300" />
              Koramangala, Bengaluru
            </button>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-purple-500 px-4 py-2 text-sm font-semibold shadow-lg shadow-purple-950/30"
          >
            <ShoppingBag className="h-4 w-4" />
            {count} items
          </button>
        </div>
        <div className="border-t border-white/10 bg-[#120d25]/90 px-4 py-3">
          <form action="/products" className="mx-auto flex max-w-6xl items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-3">
            <Search className="h-4 w-4 text-purple-200" />
            <input
              name="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search milk, chips, fruits..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-purple-200/70"
            />
          </form>
        </div>
      </header>

      <main>{children}</main>

      {count > 0 ? (
        <button
          onClick={() => setOpen(true)}
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-3xl bg-purple-600 px-5 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(88,28,135,0.45)] md:hidden"
        >
          <span>{count} items in cart</span>
          <span>Rs {total}</span>
        </button>
      ) : null}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform border-l border-white/10 bg-[#0f0b1d] text-white shadow-2xl transition duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-lg font-semibold">Your cart</p>
            <p className="text-sm text-purple-200">{count} items</p>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-full border border-white/10 px-3 py-1 text-sm">
            Close
          </button>
        </div>
        <div className="flex h-[calc(100%-162px)] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-purple-200">
                Your cart is empty. Add some essentials to continue.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="flex gap-3 rounded-3xl border border-white/10 bg-white/5 p-3">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-purple-200">{item.unit}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="font-semibold">Rs {item.price * item.quantity}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => void updateItem(item.productId, item.quantity - 1)}
                          className="rounded-full border border-white/10 p-1"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-5 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => void updateItem(item.productId, item.quantity + 1)}
                          className="rounded-full border border-white/10 p-1"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void removeItem(item.productId)}
                          className="rounded-full border border-white/10 p-1 text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-white/10 p-5">
            <div className="mb-4 flex items-center justify-between text-sm text-purple-200">
              <span>Total</span>
              <span className="text-lg font-semibold text-white">Rs {total}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block rounded-2xl bg-purple-600 px-4 py-3 text-center font-semibold"
            >
              Continue to checkout
            </Link>
          </div>
        </div>
      </aside>
      {isOpen ? <button className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} aria-label="Overlay" /> : null}
      <Toaster position="top-center" />
    </>
  );
}
