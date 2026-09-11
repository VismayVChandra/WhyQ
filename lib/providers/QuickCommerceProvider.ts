import type { Location, Platform, RawPlatformProduct } from "@/lib/types";
import { ProviderError, type ShoppingProvider } from "@/lib/providers/ShoppingProvider";

/**
 * STUB. Not implemented — no verified API documentation/credentials were
 * available at build time (see lib/providers/README.md).
 *
 * This class deliberately throws instead of returning fabricated data. Once
 * you have real API docs + a QUICKCOMMERCE_API_KEY, implement `searchProducts`
 * against the documented request/response shape (do not guess the shape).
 */
export class QuickCommerceProvider implements ShoppingProvider {
  constructor(public readonly platform: Platform) {}

  async searchProducts(_query: string, _location: Location): Promise<RawPlatformProduct[]> {
    const apiKey = process.env.QUICKCOMMERCE_API_KEY;
    if (!apiKey) {
      throw new ProviderError(
        this.platform,
        "QUICKCOMMERCE_API_KEY is not set — add it to .env.local to enable this provider."
      );
    }
    throw new ProviderError(
      this.platform,
      "QuickCommerceProvider is not implemented yet: no verified API documentation was available. " +
        "Implement lib/providers/QuickCommerceProvider.ts against real, documented endpoints — see lib/providers/README.md."
    );
  }
}
