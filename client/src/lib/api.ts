import type { Category, Product } from "./types";

const API_BASE = process.env.INTERNAL_API_BASE_URL || "http://127.0.0.1:4000/api";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }

  return response.json();
}

export async function getCategories() {
  return fetchJson<Category[]>("/categories");
}

export async function getProducts(filters?: {
  category?: string;
  search?: string;
  maxPrice?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.search) params.set("search", filters.search);
  if (filters?.maxPrice) params.set("maxPrice", filters.maxPrice);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return fetchJson<Product[]>(`/products${suffix}`);
}

export async function getTrendingProducts() {
  const products = await getProducts();
  return products.filter((product) => product.isTrending).slice(0, 6);
}

export async function getProduct(id: string) {
  return fetchJson<Product>(`/products/${id}`);
}

export { API_BASE };
