import type { CartPlatformTotal, ComparedProduct, Platform } from "@/lib/types";
import { PLATFORMS } from "@/lib/types";

/**
 * Cart comparison (spec section 10): given one matched product per cart
 * line (or null if unmatched/not found), computes a per-platform total.
 * A platform's total only includes items it actually stocks — missing
 * items are surfaced explicitly rather than silently dropped from the sum,
 * so a low total is never mistaken for a complete one.
 *
 * Pure and client-safe: no provider/Supabase imports, so it can run in the
 * browser against already-fetched search results (see app/cart/page.tsx).
 */
export function computeCartTotals(
  items: (ComparedProduct | null)[],
  queries: string[]
): CartPlatformTotal[] {
  const platforms = Object.keys(PLATFORMS) as Platform[];
  const round = (n: number) => Math.round(n * 100) / 100;

  return platforms.map((platform) => {
    let total = 0;
    let itemCount = 0;
    const missingItems: string[] = [];

    items.forEach((item, idx) => {
      if (!item) {
        missingItems.push(queries[idx]);
        return;
      }
      const result = item.results.find((r) => r.platform === platform && r.availability);
      if (result) {
        total += result.price;
        itemCount += 1;
      } else {
        missingItems.push(queries[idx]);
      }
    });

    return { platform, total: round(total), missingItems, itemCount };
  });
}
