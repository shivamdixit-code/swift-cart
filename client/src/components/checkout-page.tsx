"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export function CheckoutPage() {
  const router = useRouter();
  const { items, total, sessionId, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = useMemo(() => (items.length ? 24 : 0), [items.length]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const address = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      line1: String(formData.get("line1") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      pincode: String(formData.get("pincode") || ""),
    };

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          items,
          total: total + deliveryFee,
          paymentMethod,
          address,
        }),
      });
      if (!response.ok) throw new Error("Could not place order");
      clearCart();
      toast.success("Order placed successfully");
      router.push("/");
    } catch {
      toast.error("Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-white">
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 text-purple-200">Add a few items before heading to checkout.</p>
        <Link href="/products" className="mt-6 inline-block rounded-full bg-purple-600 px-6 py-3 font-semibold">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 text-white lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
        <div>
          <h1 className="text-3xl font-semibold">Checkout</h1>
          <p className="mt-2 text-sm text-purple-200">Delivery details and payment in one quick step.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="name" placeholder="Full name" className="rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none" required />
          <input name="phone" placeholder="Phone number" className="rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none" required />
          <input name="line1" placeholder="Address line" className="rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none md:col-span-2" required />
          <input name="city" placeholder="City" className="rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none" required />
          <input name="state" placeholder="State" className="rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none" required />
          <input name="pincode" placeholder="Pincode" className="rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none md:col-span-2" required />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-purple-200">Payment method</p>
          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3">
            <span>Cash on delivery</span>
            <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3">
            <span>Mock online payment</span>
            <input type="radio" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} />
          </label>
        </div>
        <button disabled={submitting} className="rounded-full bg-purple-600 px-6 py-3 font-semibold disabled:opacity-60">
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>

      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <span>{item.title} x {item.quantity}</span>
              <span>Rs {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm text-purple-200">
          <div className="flex justify-between"><span>Subtotal</span><span>Rs {total}</span></div>
          <div className="flex justify-between"><span>Delivery fee</span><span>Rs {deliveryFee}</span></div>
          <div className="flex justify-between text-base font-semibold text-white"><span>Total</span><span>Rs {total + deliveryFee}</span></div>
        </div>
      </div>
    </div>
  );
}
