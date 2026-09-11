import { PLATFORMS } from "@/lib/types";
import type { ComparedProduct } from "@/lib/types";

export function ComparisonSummary({ product }: { product: ComparedProduct }) {
  const { cheapest, fastest, highest, savings } = product.summary;
  if (!cheapest) return null;

  const cards = [
    { label: "Best price", value: `₹${cheapest.price}`, sub: PLATFORMS[cheapest.platform].name },
    fastest && { label: "Fastest delivery", value: `${fastest.etaMinutes} min`, sub: PLATFORMS[fastest.platform].name },
    highest && { label: "Highest price", value: `₹${highest.price}`, sub: PLATFORMS[highest.platform].name },
    savings != null && savings > 0 && { label: "You save", value: `₹${savings}`, sub: "vs. highest" },
  ].filter(Boolean) as { label: string; value: string; sub: string }[];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{c.label}</p>
          <p className="mt-1 text-xl font-bold text-zinc-900">{c.value}</p>
          <p className="text-xs text-zinc-500">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
