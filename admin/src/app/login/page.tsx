"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@swiftcart.local");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post<{ token: string }>("/auth/admin/login", { email, password });
      window.localStorage.setItem("swiftcart-admin-token", response.data.token);
      toast.success("Welcome back");
      router.push("/");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.22),transparent_30%),#f6f3ff] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[32px] border border-white bg-white p-6 shadow-xl">
        <p className="text-sm uppercase tracking-[0.28em] text-purple-600">SwiftCart admin</p>
        <h1 className="mt-3 text-3xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-slate-500">Use the demo credentials from the server env to continue.</p>
        <div className="mt-6 space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
          <button disabled={loading} className="w-full rounded-full bg-purple-600 px-6 py-3 font-semibold text-white">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
