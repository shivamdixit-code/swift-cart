"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      onClick={() => void addItem(product, 1)}
      className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white"
    >
      Add
    </button>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="rounded-[28px] border border-white/10 bg-white/5 p-3 text-white">
          <div className="relative h-52 overflow-hidden rounded-[24px]">
            <Image src={product.image} alt={product.title} fill className="object-cover" />
            <span className="absolute left-3 top-3 rounded-full bg-purple-500 px-3 py-1 text-xs font-semibold">
              {product.discount}% OFF
            </span>
          </div>
          <div className="space-y-3 p-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/products/${product.id}`} className="text-lg font-semibold">
                  {product.title}
                </Link>
                <p className="text-sm text-purple-100/70">{product.unit}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase text-purple-200">
                {product.category}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="font-semibold">Rs {product.price}</p>
                <p className="text-sm text-purple-100/60 line-through">Rs {product.mrp}</p>
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  const [selected, setSelected] = useState(product.images[0] || product.image);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 text-white md:grid-cols-[1fr_0.95fr]">
      <div className="space-y-4">
        <div className="relative h-[22rem] overflow-hidden rounded-[32px] border border-white/10 bg-white/5 md:h-[32rem]">
          <Image src={selected} alt={product.title} fill className="object-cover" />
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {product.images.map((image) => (
            <button
              key={image}
              onClick={() => setSelected(image)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border ${selected === image ? "border-purple-400" : "border-white/10"}`}
            >
              <Image src={image} alt={product.title} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-purple-200">{product.category}</p>
        <h1 className="mt-3 text-3xl font-semibold md:text-5xl">{product.title}</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-purple-100/80 md:text-base">{product.description}</p>
        <div className="mt-6 flex items-end gap-4">
          <p className="text-3xl font-semibold">Rs {product.price}</p>
          <p className="pb-1 text-lg text-purple-100/60 line-through">Rs {product.mrp}</p>
          <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-emerald-950">{product.discount}% OFF</span>
        </div>
        <p className="mt-2 text-sm text-purple-200">{product.unit} • {product.stock} left</p>
        <div className="mt-8 flex items-center gap-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#140f28] px-4 py-3">
            <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity((value) => value + 1)}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => void addItem(product, quantity)}
            className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
