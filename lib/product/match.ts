import type { MatchedProduct, NormalizedProduct } from "@/lib/types";

const SIMILARITY_THRESHOLD = 0.5;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** Brand + core name combined into one token set. Brand isn't part of the
 *  strict identity key (see normalize.ts) because platforms spell it
 *  differently ("Maggi" vs "Nestle Maggi") — folding it in here, alongside
 *  the name, lets that kind of variance wash out through overlap instead of
 *  blocking the match outright. */
function identityTokens(item: NormalizedProduct): Set<string> {
  return new Set([...tokenize(item.brand ?? ""), ...tokenize(item.name)]);
}

/** Overlap relative to the smaller set, so "maggi" vs "nestle maggi" (a
 *  strict subset) counts as a full match even though the sets differ in
 *  size. Two empty sets are treated as matching — there's no signal left to
 *  disagree, so the (dimension, amount) identity bucket alone decides. One
 *  empty and one non-empty set does NOT match: a leftover word is exactly
 *  the kind of thing that distinguishes "Coke 750ml" from "Coke Zero Sugar
 *  750ml", so it's treated as a real variant/brand signal. */
function overlapRatio(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const token of a) if (b.has(token)) shared++;
  return shared / Math.min(a.size, b.size);
}

function clusterBySimilarity(items: NormalizedProduct[]): NormalizedProduct[][] {
  const tokens = items.map(identityTokens);
  const parent = items.map((_, i) => i);

  function find(i: number): number {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  }
  function union(a: number, b: number) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (overlapRatio(tokens[i], tokens[j]) >= SIMILARITY_THRESHOLD) {
        union(i, j);
      }
    }
  }

  const groups = new Map<number, NormalizedProduct[]>();
  items.forEach((item, i) => {
    const root = find(i);
    const existing = groups.get(root);
    if (existing) existing.push(item);
    else groups.set(root, [item]);
  });
  return [...groups.values()];
}

/**
 * Groups normalized products from different platforms into matched
 * products, in two stages:
 *
 * 1. Exact identity bucket — quantity dimension + rounded base amount
 *    (NormalizedProduct.matchKey). This must stay exact: different
 *    sizes/variants must never merge (spec section 6).
 * 2. Within a bucket, cluster by brand+name word overlap. This absorbs
 *    platform-specific phrasing ("Amul Taaza Toned Milk" vs "Amul Taaza
 *    Milk", "Maggi" vs "Nestle Maggi", word order, extra descriptors)
 *    without a hand-maintained list of every such variant, while still
 *    keeping genuinely different products at the same size (different
 *    brand, or a real variant like "Zero Sugar") apart.
 */
export function matchProducts(products: NormalizedProduct[]): MatchedProduct[] {
  const buckets = new Map<string, NormalizedProduct[]>();
  for (const product of products) {
    const existing = buckets.get(product.matchKey);
    if (existing) existing.push(product);
    else buckets.set(product.matchKey, [product]);
  }

  const matched: MatchedProduct[] = [];
  for (const [identityKey, items] of buckets) {
    const clusters = clusterBySimilarity(items);
    clusters.forEach((cluster, index) => {
      // Shortest name = least likely to carry a platform-specific
      // descriptor, so it's the best canonical display name.
      const canonical = [...cluster].sort((a, b) => a.name.length - b.name.length)[0];
      matched.push({
        id: `${identityKey}::${index}`,
        canonicalName: canonical.name,
        brand: canonical.brand,
        quantity: canonical.quantity,
        imageUrl: cluster.find((r) => r.imageUrl)?.imageUrl ?? null,
        results: cluster.sort((a, b) => a.price - b.price),
      });
    });
  }

  return matched;
}
