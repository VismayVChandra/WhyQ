import type { Location, Platform, RawPlatformProduct } from "@/lib/types";

/**
 * Every platform integration (real or mock) implements this interface.
 * The rest of the app only ever talks to `ShoppingProvider`, never to a
 * concrete platform SDK/API — that keeps adding/removing platforms a
 * provider-layer change instead of a frontend change.
 */
export interface ShoppingProvider {
  readonly platform: Platform;

  /** Resolve arbitrary location input to something the platform's API accepts. */
  searchProducts(query: string, location: Location): Promise<RawPlatformProduct[]>;
}

/**
 * Thrown by a provider when the platform can't be reached or errors out.
 * Callers should catch this per-provider so one platform failing doesn't
 * fail the whole search (see lib/pricing/compare.ts).
 */
export class ProviderError extends Error {
  constructor(
    public readonly platform: Platform,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
