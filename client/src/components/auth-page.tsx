"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export function AuthPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      toast.success(`Demo OTP sent: ${data.otp}`);
      setStep("otp");
    } catch {
      toast.error("Could not send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      if (!response.ok) throw new Error();
      toast.success("Logged in successfully");
    } catch {
      toast.error("Use OTP 1234 in demo mode");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-white">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-purple-200">Sign in</p>
        <h1 className="mt-3 text-3xl font-semibold">OTP login</h1>
        <p className="mt-2 text-sm text-purple-100/70">Use any phone number and enter 1234 to continue.</p>
        {step === "phone" ? (
          <form onSubmit={requestOtp} className="mt-6 space-y-4">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none" required />
            <button disabled={loading} className="w-full rounded-full bg-purple-600 px-6 py-3 font-semibold">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="mt-6 space-y-4">
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full rounded-2xl border border-white/10 bg-[#130f25] px-4 py-3 outline-none" required />
            <button disabled={loading} className="w-full rounded-full bg-purple-600 px-6 py-3 font-semibold">
              {loading ? "Verifying..." : "Verify and continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
