"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

type Category = { id: string; name: string; slug: string; icon: string; color: string };

const empty = { name: "", icon: "Package", color: "#7c3aed" };

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const response = await api.get<Category[]>("/categories");
    setCategories(response.data);
  }

  useEffect(() => {
    api.get<Category[]>("/categories").then((response) => setCategories(response.data));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId) {
      await api.put(`/categories/${editingId}`, form);
      toast.success("Category updated");
    } else {
      await api.post("/categories", form);
      toast.success("Category created");
    }
    setEditingId(null);
    setForm(empty);
    await load();
  }

  async function removeCategory(id: string) {
    await api.delete(`/categories/${id}`);
    toast.success("Category removed");
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form onSubmit={submit} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold">{editingId ? "Edit category" : "Add category"}</h2>
        <div className="mt-5 space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
          <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Icon name" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
          <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="#7c3aed" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" required />
          <button className="w-full rounded-full bg-purple-600 px-5 py-3 font-semibold text-white">
            {editingId ? "Update category" : "Create category"}
          </button>
        </div>
      </form>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <div className="mt-5 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl" style={{ backgroundColor: category.color }} />
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-slate-500">{category.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(category.id); setForm({ name: category.name, icon: category.icon, color: category.color }); }} className="rounded-full bg-slate-100 px-3 py-1.5">
                  Edit
                </button>
                <button onClick={() => void removeCategory(category.id)} className="rounded-full bg-rose-50 px-3 py-1.5 text-rose-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
