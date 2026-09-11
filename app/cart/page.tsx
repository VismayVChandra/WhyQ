"use client";

import { useState } from "react";
import { Plus, Trash2, Trophy } from "lucide-react";
import { Header } from "@/components/Header";
import { useLocation } from "@/lib/hooks/useLocation";
import { computeCartTotals } from "@/lib/pricing/cart";
import { PLATFORMS } from "@/lib/types";
import type { CartPlatformTotal, ComparedProduct } from "@/lib/types";

export default function CartPage() {
  const { location, hydrated } = useLocation();
  const [items, setItems] = useState<string[]>(["Milk", "Bread", "Eggs", "Maggi", "Coke"]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState<CartPlatformTotal[] | null>(null);

  function addItem(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, trimmed]);
    setDraft("");
    setTotals(null);
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
    setTotals(null);
  }

  async function compareCart() {
    if (!hydrated || items.length === 0) return;
    setLoading(true);
    try {
      const results = await Promise.all(
        items.map(async (query) => {
          const params = new URLSearchParams({ q: query, location: location.label });
          if (location.city) params.set("city", location.city);
          if (location.pincode) params.set("pincode", location.pincode);
          const res = await fetch(`/api/search?${params.toString()}`);
          if (!res.ok) return null;
          const data = await res.json();
          const products: ComparedProduct[] = data.products ?? [];
          // Pick the variant carried by the most platforms (the "standard"
          // size, e.g. 1L milk), not just the globally cheapest match — a
          // rare small pack that's cheapest but only sold by one platform
          // would otherwise make every other platform look like it's
          // missing the item, when it actually stocks a different size.
          const bestMatch = [...products].sort((a, b) => {
            const coverage = b.results.length - a.results.length;
            if (coverage !== 0) return coverage;
            return (a.summary.cheapest?.price ?? Infinity) - (b.summary.cheapest?.price ?? Infinity);
          })[0];
          return bestMatch ?? null;
        })
      );
      setTotals(computeCartTotals(results, items));
    } finally {
      setLoading(false);
    }
  }

  // "Cheapest overall" only means something when comparing complete
  // baskets — a platform missing 3 of 5 items will almost always have the
  // smallest raw total, which would be a misleading "cheapest" claim (spec
  // section 10: never present an incomplete total as if it were complete).
  // So the headline comparison only considers platforms that stock every
  // item; other platforms still show their (explicitly partial) total.
  const completeTotals = totals?.filter((t) => t.itemCount === items.length) ?? [];
  const cheapest = completeTotals.length
    ? completeTotals.reduce((a, b) => (b.total < a.total ? b : a))
    : null;
  const mostExpensive = completeTotals.length
    ? completeTotals.reduce((a, b) => (b.total > a.total ? b : a))
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="mb-1 text-xl font-bold text-zinc-900">Compare your shopping list</h1>
        <p className="mb-6 text-sm text-zinc-500">
          Add every item you need, then see which platform is cheapest overall.
        </p>

        <div className="mb-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <ul className="mb-3 space-y-2">
            {items.map((item, idx) => (
              <li
                key={`${item}-${idx}`}
                className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
              >
                {item}
                <button onClick={() => removeItem(idx)} className="text-zinc-400 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
            {items.length === 0 && (
              <p className="py-4 text-center text-sm text-zinc-400">Your list is empty.</p>
            )}
          </ul>

          <form onSubmit={addItem} className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add an item, e.g. Shampoo"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              <Plus size={15} /> Add
            </button>
          </form>
        </div>

        <button
          onClick={compareCart}
          disabled={loading || items.length === 0}
          className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Comparing…" : "Compare across platforms"}
        </button>

        {totals && (
          <div className="mt-6 animate-fade-in space-y-2.5">
            {cheapest && mostExpensive && mostExpensive.total > cheapest.total && (
              <p className="rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700">
                {PLATFORMS[cheapest.platform].name} is ₹{Math.round((mostExpensive.total - cheapest.total) * 100) / 100}{" "}
                cheaper than the most expensive option (comparing platforms that stock every item).
              </p>
            )}
            {!cheapest && (
              <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
                No single platform stocks every item on your list, so totals below are partial — see
                each platform&apos;s missing items before comparing.
              </p>
            )}
            {totals
              .slice()
              .sort((a, b) => b.total - a.total)
              .reverse()
              .map((t) => (
                <div
                  key={t.platform}
                  className={`flex items-center justify-between rounded-xl border p-4 ${
                    cheapest?.platform === t.platform
                      ? "border-brand-300 bg-brand-50"
                      : "border-zinc-100 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                      {t.platform === cheapest?.platform && <Trophy size={15} className="text-brand-600" />}
                      {PLATFORMS[t.platform].name}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {t.itemCount} of {items.length} items available
                      {t.missingItems.length > 0 && ` · missing: ${t.missingItems.join(", ")}`}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-zinc-900">
                    ₹{t.total}
                    {t.itemCount < items.length && (
                      <span className="ml-1 text-xs font-normal text-zinc-400">partial</span>
                    )}
                  </span>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
