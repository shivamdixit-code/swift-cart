import { ProductGrid } from "@/components/product-ui";
import { getCategories, getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

type SearchProps = {
  searchParams: Promise<{
    category?: string;
    search?: string;
    maxPrice?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: SearchProps) {
  const filters = await searchParams;
  const [products, categories] = await Promise.all([getProducts(filters), getCategories()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 text-white">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-[32px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.28em] text-purple-200">Filters</p>
          <form className="mt-4 space-y-4" action="/products">
            <div>
              <label className="mb-2 block text-sm text-purple-100/70">Category</label>
              <select name="category" defaultValue={filters.category || ""} className="w-full rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none">
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-purple-100/70">Search</label>
              <input name="search" defaultValue={filters.search || ""} className="w-full rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none" placeholder="Search products" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-purple-100/70">Max price</label>
              <input name="maxPrice" defaultValue={filters.maxPrice || ""} type="number" className="w-full rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none" placeholder="Eg. 150" />
            </div>
            <button className="w-full rounded-full bg-purple-600 px-5 py-3 font-semibold">Apply filters</button>
          </form>
        </aside>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Products</h1>
              <p className="mt-2 text-sm text-purple-100/70">{products.length} results found</p>
            </div>
          </div>
          {products.length ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-[32px] border border-dashed border-white/10 bg-white/5 p-10 text-center text-purple-200">
              No products match those filters right now.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
