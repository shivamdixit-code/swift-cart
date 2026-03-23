import Image from "next/image";
import Link from "next/link";
import { Clock3, Sparkles } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { AddToCartButton } from "./product-ui";

const banners = [
  { title: "Fresh picks in 10 mins", subtitle: "Daily fruit drops with up to 30% off" },
  { title: "Snack break sorted", subtitle: "Office munchies and pantry essentials" },
  { title: "Dairy for the week", subtitle: "Milk, yogurt, and butter delivered cold" },
];

export function HomePage({ categories, trending }: { categories: Category[]; trending: Product[] }) {
  return (
    <div className="bg-[#070510] text-white">
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[1.15fr_0.85fr] md:py-10">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.45),transparent_35%),linear-gradient(145deg,#24113f,#0f0b1d_70%)] p-6 shadow-[0_30px_90px_rgba(76,29,149,0.35)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/20 bg-white/10 px-3 py-1 text-xs font-semibold text-purple-100">
            <Clock3 className="h-3.5 w-3.5" />
            Instant delivery
          </div>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
            Grocery essentials that move at city speed.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-purple-100/85 md:text-base">
            SwiftCart brings fresh produce, pantry staples, dairy, and household basics to your door with a crisp, minimal shopping flow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#140d28]">
              Shop now
            </Link>
            <Link href="/auth" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              Sign in with OTP
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {banners.map((banner, index) => (
            <div
              key={banner.title}
              className={`rounded-[28px] border border-white/10 p-5 ${index === 0 ? "bg-[#161127]" : "bg-[#0d0a19]"}`}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-100">
                <Sparkles className="h-3.5 w-3.5" />
                Offer drop
              </div>
              <p className="mt-4 text-2xl font-semibold">{banner.title}</p>
              <p className="mt-2 text-sm text-purple-100/80">{banner.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">Shop by category</h2>
          <Link href="/products" className="text-sm text-purple-200">Browse all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rounded-[28px] border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:bg-white/8"
            >
              <div className="h-11 w-11 rounded-2xl" style={{ backgroundColor: category.color }} />
              <p className="mt-4 font-semibold">{category.name}</p>
              <p className="mt-1 text-xs text-purple-100/70">Fast picks</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">Trending products</h2>
          <p className="text-sm text-purple-100/70">Popular right now</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5">
              <div className="relative h-52">
                <Image src={product.image} alt={product.title} fill className="object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-emerald-950">
                  {product.discount}% OFF
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{product.title}</p>
                    <p className="text-sm text-purple-100/70">{product.unit}</p>
                  </div>
                  <Link href={`/products/${product.id}`} className="text-sm text-purple-200">
                    View
                  </Link>
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
      </section>
    </div>
  );
}
