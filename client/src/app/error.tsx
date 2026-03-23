"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center text-white">
      <h2 className="text-3xl font-semibold">Something went wrong</h2>
      <p className="mt-3 text-purple-200">We could not load this page. Please try again.</p>
      <button onClick={reset} className="mt-6 rounded-full bg-purple-600 px-6 py-3 font-semibold">
        Retry
      </button>
    </div>
  );
}
