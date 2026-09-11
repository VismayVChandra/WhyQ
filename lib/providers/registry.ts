import type { Platform } from "@/lib/types";
import { PLATFORMS } from "@/lib/types";
import type { ShoppingProvider } from "@/lib/providers/ShoppingProvider";
import { MockProvider } from "@/lib/providers/MockProvider";
import { QuickCommerceProvider } from "@/lib/providers/QuickCommerceProvider";

/**
 * Central place that decides, per platform, which provider implementation
 * backs it. Swap a platform from mock to live by changing one line here —
 * nothing else in the app (routes, components, matching, caching) needs to
 * know or change.
 */
function buildProvider(platform: Platform): ShoppingProvider {
  const useRealApi = Boolean(process.env.QUICKCOMMERCE_API_KEY);
  return useRealApi ? new QuickCommerceProvider(platform) : new MockProvider(platform);
}

export function getAllProviders(): ShoppingProvider[] {
  return (Object.keys(PLATFORMS) as Platform[]).map(buildProvider);
}

export function getProvider(platform: Platform): ShoppingProvider {
  return buildProvider(platform);
}
