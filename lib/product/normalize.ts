import type { NormalizedProduct, NormalizedQuantity, RawPlatformProduct } from "@/lib/types";

/**
 * Words that carry no product-identity information but vary a lot between
 * platforms' free-text names ("Bottle", "Pouch", "Pack of", marketing
 * filler). Stripped before building the match key so e.g. "Coca-Cola Soft
 * Drink 750 ml" and "Coca Cola 750ml" collapse to the same key.
 */
const NOISE_WORDS = [
  "pouch",
  "bottle",
  "pack of",
  "pack",
  "combo",
  "jar",
  "tin",
  "box",
  "sachet",
  "pieces",
  "piece",
  "fresh",
  "original",
  "soft drink",
];

interface QuantityMatch {
  value: number;
  unit: "g" | "kg" | "ml" | "l" | "pcs";
}

/** Base dimension used for matching: mass (grams), volume (ml), or count. */
type BaseDimension = "mass" | "volume" | "count";

function toBase(q: QuantityMatch): { dimension: BaseDimension; amount: number } {
  switch (q.unit) {
    case "g":
      return { dimension: "mass", amount: q.value };
    case "kg":
      return { dimension: "mass", amount: q.value * 1000 };
    case "ml":
      return { dimension: "volume", amount: q.value };
    case "l":
      return { dimension: "volume", amount: q.value * 1000 };
    case "pcs":
      return { dimension: "count", amount: q.value };
  }
}

/**
 * Parses free-text quantity strings ("70g", "1000 ml", "1.25 L", "6 pcs")
 * into a value + unit. Returns null if nothing recognizable is found —
 * callers should treat that product as unmatchable-by-quantity rather than
 * guessing.
 */
export function parseQuantityText(text: string): QuantityMatch | null {
  const cleaned = text.trim().toLowerCase();

  const pieceMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(pcs|pieces|piece|pc)\b/);
  if (pieceMatch) {
    return { value: parseFloat(pieceMatch[1]), unit: "pcs" };
  }

  const unitMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(kg|g|gm|gms|l|ltr|litre|liter|ml)\b/);
  if (unitMatch) {
    const value = parseFloat(unitMatch[1]);
    const rawUnit = unitMatch[2];
    switch (rawUnit) {
      case "g":
      case "gm":
      case "gms":
        return { value, unit: "g" };
      case "kg":
        return { value, unit: "kg" };
      case "ml":
        return { value, unit: "ml" };
      case "l":
      case "ltr":
      case "litre":
      case "liter":
        return { value, unit: "l" };
    }
  }

  return null;
}

/** Formats a base amount + dimension into a human-friendly display quantity. */
function toDisplayQuantity(dimension: BaseDimension, amount: number): NormalizedQuantity {
  if (dimension === "count") {
    return { value: amount, unit: "pcs", display: `${amount} pcs` };
  }
  if (dimension === "mass") {
    if (amount >= 1000) {
      const kg = round(amount / 1000);
      return { value: kg, unit: "kg", display: `${kg} kg` };
    }
    return { value: amount, unit: "g", display: `${amount} g` };
  }
  // volume
  if (amount >= 1000) {
    const l = round(amount / 1000);
    return { value: l, unit: "l", display: `${l} L` };
  }
  return { value: amount, unit: "ml", display: `${amount} ml` };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Collapses punctuation variance that isn't product-identity information:
 * "&" vs "and", hyphens vs spaces (e.g. "Coca-Cola" vs "Coca Cola"). Without
 * this, brand-substring removal in `coreProductName` silently fails whenever
 * a platform spells the same brand slightly differently, leaving stray
 * brand text behind that then blocks two listings of the same product from
 * matching each other.
 */
function normalizePunctuation(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripNoiseWords(name: string): string {
  let result = normalizePunctuation(name);
  for (const word of NOISE_WORDS) {
    result = result.replaceAll(word, " ");
  }
  return result;
}

/** Removes the quantity substring and non-alphanumerics, collapses whitespace. */
function coreProductName(rawName: string, brand: string | null): string {
  let name = stripNoiseWords(rawName);
  if (brand) {
    name = name.replaceAll(normalizePunctuation(brand), " ");
  }
  name = name.replace(/\d+(?:\.\d+)?\s*(kg|g|gm|gms|l|ltr|litre|liter|ml|pcs|pieces|piece|pc)\b/g, " ");
  name = name.replace(/[^a-z0-9\s]/g, " ");
  name = name.replace(/\s+/g, " ").trim();
  return name;
}

export function normalizeProduct(raw: RawPlatformProduct): NormalizedProduct {
  const brand = raw.brand?.trim() || null;
  const parsedQuantity = parseQuantityText(raw.quantityText) ?? { value: 0, unit: "g" as const };
  const base = toBase(parsedQuantity);
  const quantity = toDisplayQuantity(base.dimension, base.amount);

  const name = coreProductName(raw.rawName, brand);
  const discountPercent =
    raw.mrp && raw.mrp > raw.price ? round(((raw.mrp - raw.price) / raw.mrp) * 100) : null;

  // Identity key: base dimension + rounded base amount ONLY. Deliberately
  // exact, never fuzzy — this is what guarantees different sizes/variants
  // (iPhone 128GB vs 256GB, Coke 750ml vs 1.25L) never merge. Rounding the
  // base amount (not the display value) is what keeps "1000 ml" and "1 L"
  // together while keeping "750 ml" and "1.25 L" apart.
  //
  // Brand is deliberately NOT part of this exact key: platforms disagree on
  // how to write it ("Maggi" vs "Nestle Maggi", "Head & Shoulders" vs "Head
  // and Shoulders"), so brand is matched together with the product name via
  // word-overlap clustering in lib/product/match.ts instead — that's what
  // still keeps genuinely different same-size products (different brand or
  // different item) from being merged, without a hand-maintained alias list.
  const matchKey = [base.dimension, Math.round(base.amount)].join("|");

  // Display/match name. When the core name strips down to nothing (e.g.
  // "Coca-Cola 750 ml" has no words left besides brand+quantity), fall back
  // to "<brand> <quantity display>" rather than the raw platform text — that
  // fallback is derived purely from already-normalized fields, so it comes
  // out identical across platforms and still clusters correctly in
  // match.ts. Falling back to the raw per-platform name here would
  // reintroduce exactly the phrasing differences normalization is meant to
  // remove, since match.ts clusters using this field.
  const displayName = titleCase(name) || [brand, quantity.display].filter(Boolean).join(" ");

  return {
    platform: raw.platform,
    platformProductId: raw.platformProductId,
    brand,
    name: displayName,
    quantity,
    variant: null,
    price: raw.price,
    mrp: raw.mrp ?? null,
    discountPercent,
    imageUrl: raw.imageUrl ?? null,
    availability: raw.availability,
    deliveryEtaMinutes: raw.deliveryEtaMinutes ?? null,
    productUrl: raw.productUrl,
    matchKey,
  };
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
