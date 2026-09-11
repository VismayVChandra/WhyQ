import type {
  ComparedProduct,
  ComparisonSummary,
  Location,
  MatchedProduct,
  NormalizedProduct,
  Platform,
} from "@/lib/types";
import { getAllProviders } from "@/lib/providers/registry";
import { ProviderError } from "@/lib/providers/ShoppingProvider";
import { normalizeProduct } from "@/lib/product/normalize";
import { matchProducts } from "@/lib/product/match";

export interface PlatformSearchOutcome {
  platform: Platform;
  status: "ok" | "unavailable" | "timeout";
  message?: string;
}

export interface SearchOutcome {
  products: ComparedProduct[];
  platformStatus: PlatformSearchOutcome[];
}

const PROVIDER_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

/**
 * Queries every registered platform provider in parallel. A single
 * platform failing (error or timeout) is isolated and reported in
 * `platformStatus` — it never fails the overall search (spec section 16).
 */
export async function searchAllPlatforms(query: string, location: Location): Promise<SearchOutcome> {
  const providers = getAllProviders();
  const platformStatus: PlatformSearchOutcome[] = [];
  const normalized: NormalizedProduct[] = [];

  const results = await Promise.allSettled(
    providers.map((provider) => withTimeout(provider.searchProducts(query, location), PROVIDER_TIMEOUT_MS))
  );

  results.forEach((result, i) => {
    const platform = providers[i].platform;
    if (result.status === "fulfilled") {
      platformStatus.push({ platform, status: "ok" });
      for (const raw of result.value) {
        normalized.push(normalizeProduct(raw));
      }
    } else {
      const reason = result.reason;
      const isTimeout = reason instanceof Error && reason.message === "timeout";
      platformStatus.push({
        platform,
        status: isTimeout ? "timeout" : "unavailable",
        message:
          reason instanceof ProviderError
            ? reason.message
            : isTimeout
              ? "Couldn't retrieve results from this platform."
              : "Temporarily unavailable",
      });
    }
  });

  const matched = matchProducts(normalized);
  const products = matched.map(withComparisonSummary).sort(byBestPrice);

  return { products, platformStatus };
}

function withComparisonSummary(matched: MatchedProduct): ComparedProduct {
  return { ...matched, summary: computeSummary(matched) };
}

export function computeSummary(matched: MatchedProduct): ComparisonSummary {
  const available = matched.results.filter((r) => r.availability);
  if (available.length === 0) {
    return { cheapest: null, fastest: null, highest: null, savings: null };
  }

  const cheapestResult = available.reduce((a, b) => (b.price < a.price ? b : a));
  const highestResult = available.reduce((a, b) => (b.price > a.price ? b : a));
  const withEta = available.filter((r) => r.deliveryEtaMinutes != null);
  const fastestResult =
    withEta.length > 0
      ? withEta.reduce((a, b) => (b.deliveryEtaMinutes! < a.deliveryEtaMinutes! ? b : a))
      : null;

  return {
    cheapest: { platform: cheapestResult.platform, price: cheapestResult.price },
    fastest: fastestResult
      ? { platform: fastestResult.platform, etaMinutes: fastestResult.deliveryEtaMinutes! }
      : null,
    highest: { platform: highestResult.platform, price: highestResult.price },
    savings: round(highestResult.price - cheapestResult.price),
  };
}

function byBestPrice(a: ComparedProduct, b: ComparedProduct): number {
  const aPrice = a.summary.cheapest?.price ?? Infinity;
  const bPrice = b.summary.cheapest?.price ?? Infinity;
  return aPrice - bPrice;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
