export function LoadingSkeleton({ platformCount = 4 }: { platformCount?: number }) {
  return (
    <div className="animate-fade-in">
      <p className="mb-4 text-sm text-zinc-500">Comparing prices across {platformCount} platforms…</p>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="skeleton h-14 w-14 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3 rounded" />
                <div className="skeleton h-3 w-1/5 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: platformCount }).map((__, j) => (
                <div key={j} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
