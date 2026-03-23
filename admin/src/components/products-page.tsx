"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  unit: string;
  image: string;
  description: string;
  images?: string[];
  isTrending?: boolean;
};

type Category = { id: string; slug: string; name: string };

const initialForm = {
  title: "",
  category: "",
  price: 0,
  mrp: 0,
  stock: 0,
  unit: "",
  image: "",
  description: "",
  isTrending: false,
};

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const [productsRes, categoriesRes] = await Promise.all([api.get<Product[]>("/products"), api.get<Category[]>("/categories")]);
    setProducts(productsRes.data);
    setCategories(categoriesRes.data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post<{ imageUrl: string }>("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setForm((value) => ({ ...value, image: response.data.imageUrl }));
    toast.success("Image uploaded");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        images: form.image ? [form.image] : [],
      };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      setForm(initialForm);
      setEditingId(null);
      await load();
    } catch {
      toast.error("Could not save product");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeProduct(id: string) {
    await api.delete(`/products/${id}`);
    toast.success("Product deleted");
    await load();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <form onSubmit={handleSubmit} className="h-fit rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold">{editingId ? "Edit product" : "Add product"}</h2>
        <div className="mt-5 space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product title" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" required>
            <option value="">Select category</option>
            {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} type="number" placeholder="Price" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
            <input value={form.mrp} onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })} type="number" placeholder="MRP" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} type="number" placeholder="Stock" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
            <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Unit" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
          <input type="file" accept="image/*" onChange={handleUpload} className="w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3" />
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <input type="checkbox" checked={form.isTrending} onChange={(e) => setForm({ ...form, isTrending: e.target.checked })} />
            Show in trending products
          </label>
          <button disabled={submitting} className="w-full rounded-full bg-purple-600 px-5 py-3 font-semibold text-white">
            {submitting ? "Saving..." : editingId ? "Update product" : "Create product"}
          </button>
        </div>
      </form>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Catalog</h2>
          <span className="text-sm text-slate-500">{products.length} products</span>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100">
                  <td className="py-4 font-medium">{product.title}</td>
                  <td className="py-4 capitalize">{product.category}</td>
                  <td className="py-4">Rs {product.price}</td>
                  <td className="py-4">{product.stock}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(product.id);
                          setForm({
                            title: product.title,
                            category: product.category,
                            price: product.price,
                            mrp: product.mrp,
                            stock: product.stock,
                            unit: product.unit,
                            image: product.image,
                            description: product.description,
                            isTrending: Boolean(product.isTrending),
                          });
                        }}
                        className="rounded-full bg-slate-100 px-3 py-1.5"
                      >
                        Edit
                      </button>
                      <button onClick={() => void removeProduct(product.id)} className="rounded-full bg-rose-50 px-3 py-1.5 text-rose-700">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
