"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import type { CartItem, CartResponse, Product } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

function createSessionId() {
  return `guest-${Math.random().toString(36).slice(2, 10)}`;
}

type CartState = {
  sessionId: string;
  isOpen: boolean;
  items: CartItem[];
  total: number;
  isSyncing: boolean;
  setOpen: (isOpen: boolean) => void;
  syncCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
};

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE}${path}`, init);
  if (!response.ok) throw new Error("Cart request failed");
  return (await response.json()) as T;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      sessionId: createSessionId(),
      isOpen: false,
      items: [],
      total: 0,
      isSyncing: false,
      setOpen: (isOpen) => set({ isOpen }),
      syncCart: async () => {
        const { sessionId } = get();
        set({ isSyncing: true });
        try {
          const cart = await request<CartResponse>(`/cart/${sessionId}`);
          set({ items: cart.items, total: cart.total });
        } catch {
          toast.error("Could not sync cart");
        } finally {
          set({ isSyncing: false });
        }
      },
      addItem: async (product, quantity = 1) => {
        const { sessionId } = get();
        try {
          const cart = await request<CartResponse>(`/cart/${sessionId}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id, quantity }),
          });
          set({ items: cart.items, total: cart.total, isOpen: true });
          toast.success(`${product.title} added to cart`);
        } catch {
          toast.error("Unable to add item");
        }
      },
      updateItem: async (productId, quantity) => {
        const { sessionId } = get();
        try {
          const cart = await request<CartResponse>(`/cart/${sessionId}/items/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
          });
          set({ items: cart.items, total: cart.total });
        } catch {
          toast.error("Unable to update cart");
        }
      },
      removeItem: async (productId) => {
        const { sessionId } = get();
        try {
          const cart = await request<CartResponse>(`/cart/${sessionId}/items/${productId}`, {
            method: "DELETE",
          });
          set({ items: cart.items, total: cart.total });
          toast.success("Item removed");
        } catch {
          toast.error("Unable to remove item");
        }
      },
      clearCart: () => set({ items: [], total: 0, isOpen: false }),
    }),
    {
      name: "swiftcart-store",
      partialize: (state) => ({ sessionId: state.sessionId }),
    }
  )
);
