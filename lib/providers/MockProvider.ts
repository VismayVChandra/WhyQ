import type { Location, Platform, RawPlatformProduct } from "@/lib/types";
import type { ShoppingProvider } from "@/lib/providers/ShoppingProvider";
import { queryMockCatalog, simulateLatency } from "@/lib/providers/mockData";

/**
 * Fully self-contained provider backed by a static in-memory catalog
 * (mockData.ts). Lets the whole app — UI, matching, comparison, caching —
 * be built and tested without any external API or credentials.
 */
export class MockProvider implements ShoppingProvider {
  constructor(public readonly platform: Platform) {}

  async searchProducts(query: string, _location: Location): Promise<RawPlatformProduct[]> {
    await simulateLatency();
    return queryMockCatalog(this.platform, query);
  }
}
