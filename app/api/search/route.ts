import { NextRequest, NextResponse } from "next/server";
import type { Location } from "@/lib/types";
import { searchAllPlatforms } from "@/lib/pricing/compare";
import { cacheKey, getCached, setCached } from "@/lib/pricing/cache";
import { getSupabaseServerClient } from "@/lib/supabase/client";
import { persistProductResults } from "@/lib/supabase/persist";

const MAX_QUERY_LENGTH = 100;
// Very small in-memory rate limiter: N requests per IP per window. Good
// enough to blunt accidental hammering in the MVP; swap for a shared store
// (Upstash/Redis) before scaling past a single instance.
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

function sanitizeQuery(raw: string): string {
  return raw.trim().slice(0, MAX_QUERY_LENGTH).replace(/[<>]/g, "");
}

function parseLocation(searchParams: URLSearchParams): Location {
  const label = searchParams.get("location") || searchParams.get("city") || searchParams.get("pincode");
  return {
    label: label ? sanitizeQuery(label) : "Unknown",
    city: searchParams.get("city") ?? undefined,
    pincode: searchParams.get("pincode") ?? undefined,
  };
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const searchParams = req.nextUrl.searchParams;
  const rawQuery = searchParams.get("q");
  if (!rawQuery || !rawQuery.trim()) {
    return NextResponse.json({ error: "Missing search query." }, { status: 400 });
  }

  const query = sanitizeQuery(rawQuery);
  const location = parseLocation(searchParams);

  const key = cacheKey(query, location.label);
  const cachedResult = getCached(key);
  if (cachedResult) {
    return NextResponse.json({ ...cachedResult, cached: true });
  }

  const result = await searchAllPlatforms(query, location);
  setCached(key, result);

  // Best-effort persistence — never let a Supabase hiccup fail the search.
  void persistSearch(query, location.label).catch(() => {});
  void persistProductResults(result.products).catch(() => {});

  return NextResponse.json({ ...result, cached: false });
}

async function persistSearch(query: string, locationLabel: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  await supabase.from("searches").insert({ query, location_label: locationLabel });
}
