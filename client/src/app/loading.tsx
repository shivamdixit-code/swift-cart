export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6">
      <div className="h-56 animate-pulse rounded-[32px] bg-white/5" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-[28px] bg-white/5" />
        ))}
      </div>
    </div>
  );
}
