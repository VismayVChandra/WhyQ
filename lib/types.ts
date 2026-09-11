export type Platform = "blinkit" | "zepto" | "instamart" | "bigbasket";

export interface PlatformInfo {
  id: Platform;
  name: string;
  color: string;
  accent: string;
}

export const PLATFORMS: Record<Platform, PlatformInfo> = {
  blinkit: { id: "blinkit", name: "Blinkit", color: "#f8cb46", accent: "#1c1c1c" },
  zepto: { id: "zepto", name: "Zepto", color: "#8025fb", accent: "#ffffff" },
  instamart: { id: "instamart", name: "Instamart", color: "#fc8019", accent: "#ffffff" },
  bigbasket: { id: "bigbasket", name: "BigBasket", color: "#84c225", accent: "#ffffff" },
};

export interface Location {
  pincode?: string;
  city?: string;
  area?: string;
  lat?: number;
  lng?: number;
  label: string;
}

/** Raw result as returned by a single platform provider, before normalization. */
export interface RawPlatformProduct {
  platform: Platform;
  platformProductId: string;
  rawName: string;
  brand?: string;
  quantityText: string;
  price: number;
  mrp?: number;
  imageUrl?: string;
  availability: boolean;
  deliveryEtaMinutes?: number;
  productUrl: string;
}

/** Normalized quantity, e.g. "500 g" -> { value: 0.5, unit: "kg" }. */
export interface NormalizedQuantity {
  value: number;
  unit: "g" | "kg" | "ml" | "l" | "pcs";
  display: string;
}

/** A platform product after normalization, still tied to one platform. */
export interface NormalizedProduct {
  platform: Platform;
  platformProductId: string;
  brand: string | null;
  name: string;
  quantity: NormalizedQuantity;
  variant: string | null;
  price: number;
  mrp: number | null;
  discountPercent: number | null;
  imageUrl: string | null;
  availability: boolean;
  deliveryEtaMinutes: number | null;
  productUrl: string;
  matchKey: string;
}

/** A group of normalized products from different platforms judged to be the same item. */
export interface MatchedProduct {
  id: string;
  canonicalName: string;
  brand: string | null;
  quantity: NormalizedQuantity;
  imageUrl: string | null;
  results: NormalizedProduct[];
}

export interface ComparisonSummary {
  cheapest: { platform: Platform; price: number } | null;
  fastest: { platform: Platform; etaMinutes: number } | null;
  highest: { platform: Platform; price: number } | null;
  savings: number | null;
}

export interface ComparedProduct extends MatchedProduct {
  summary: ComparisonSummary;
}

export type SortOption = "cheapest" | "fastest" | "discount";

export interface SearchFilters {
  inStockOnly: boolean;
  underPrice: number | null;
  platforms: Platform[];
  deliveryUnderMinutes: number | null;
}

export interface PriceHistoryPoint {
  platform: Platform;
  price: number;
  recordedAt: string;
}

export interface CartItem {
  query: string;
  matchedProduct?: ComparedProduct;
}

export interface CartPlatformTotal {
  platform: Platform;
  total: number;
  missingItems: string[];
  itemCount: number;
}
