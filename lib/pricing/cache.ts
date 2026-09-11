import type { SearchOutcome } from "@/lib/pricing/compare";

/**
 * In-memory, per-server-instance cache for search results. Keeps the app
 * from hammering every platform provider on every keystroke/search (spec
 * section 15). This is intentionally simple for the MVP: a Map with TTL.
 *
 * Caveat: on serverless platforms (Vercel) each function instance has its
 * own memory, so this cache is best-effort, not global — it still cuts
 * repeat-search load significantly within a warm instance. A shared cache
 * (Redis/Upstash) is a drop-in swap behind the same `getCached`/`setCached`
 * functions if that's needed later.
 */
const TTL_MS = 5 * 60 * 1000; // 5 minutes — prices/stock change frequently, do not raise casually.

interface CacheEntry {
  value: SearchOutcome;
  expiresAt: number;
}

const store = new Map<string, CacheEntry>();

export function cacheKey(query: string, locationLabel: string): string {
  return `${query.trim().toLowerCase()}::${locationLabel.trim().toLowerCase()}`;
}

export function getCached(key: string): SearchOutcome | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(key: string, value: SearchOutcome): void {
  store.set(key, { value, expiresAt: Date.now() + TTL_MS });
}
