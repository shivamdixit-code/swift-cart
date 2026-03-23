import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center text-white">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-purple-200">The item you are looking for is not available.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-purple-600 px-6 py-3 font-semibold">
        Return home
      </Link>
    </div>
  );
}
