"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ComparisonSummary } from "@/components/ComparisonSummary";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/FilterBar";
import { PLATFORMS } from "@/lib/types";
import type { ComparedProduct, SearchFilters, SortOption } from "@/lib/types";
import { useLocation } from "@/lib/hooks/useLocation";
import type { PlatformSearchOutcome } from "@/lib/pricing/compare";

const DEFAULT_FILTERS: SearchFilters = {
  inStockOnly: false,
  underPrice: null,
  platforms: [],
  deliveryUnderMinutes: null,
};

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { location, hydrated } = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ComparedProduct[]>([]);
  const [platformStatus, setPlatformStatus] = useState<PlatformSearchOutcome[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("cheapest");

  useEffect(() => {
    if (!query || !hydrated) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ q: query, location: location.label });
    if (location.city) params.set("city", location.city);
    if (location.pincode) params.set("pincode", location.pincode);

    fetch(`/api/search?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Something went wrong.");
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products ?? []);
        setPlatformStatus(data.platformStatus ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, hydrated, location.label, location.city, location.pincode]);

  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (filters.inStockOnly) {
      list = list.filter((p) => p.results.some((r) => r.availability));
    }
    if (filters.underPrice != null) {
      list = list.filter((p) => p.summary.cheapest && p.summary.cheapest.price < filters.underPrice!);
    }
    if (filters.deliveryUnderMinutes != null) {
      list = list.filter((p) =>
        p.results.some((r) => r.availability && (r.deliveryEtaMinutes ?? Infinity) <= filters.deliveryUnderMinutes!)
      );
    }
    if (filters.platforms.length > 0) {
      list = list.filter((p) => p.results.some((r) => filters.platforms.includes(r.platform)));
    }

    list.sort((a, b) => {
      if (sort === "cheapest") {
        return (a.summary.cheapest?.price ?? Infinity) - (b.summary.cheapest?.price ?? Infinity);
      }
      if (sort === "fastest") {
        return (a.summary.fastest?.etaMinutes ?? Infinity) - (b.summary.fastest?.etaMinutes ?? Infinity);
      }
      // discount: use the best discountPercent among a product's results
      const aDiscount = Math.max(0, ...a.results.map((r) => r.discountPercent ?? 0));
      const bDiscount = Math.max(0, ...b.results.map((r) => r.discountPercent ?? 0));
      return bDiscount - aDiscount;
    });

    return list;
  }, [products, filters, sort]);

  const failedPlatforms = platformStatus.filter((p) => p.status !== "ok");

  return (
    <div className="flex min-h-screen flex-col">
      <Header compactSearch={<SearchBar initialQuery={query} size="compact" />} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-zinc-900">
            Results for &quot;{query}&quot;
          </h1>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-zinc-500">
            <MapPin size={14} /> {location.label}
          </p>
        </div>

        {failedPlatforms.length > 0 && (
          <div className="mb-5 space-y-1.5">
            {failedPlatforms.map((p) => (
              <div
                key={p.platform}
                className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
              >
                <AlertTriangle size={14} />
                <span className="font-medium">{PLATFORMS[p.platform].name}</span>
                <span className="text-amber-700">{p.message ?? "Temporarily unavailable"}</span>
              </div>
            ))}
          </div>
        )}

        {loading && <LoadingSkeleton />}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && <EmptyState query={query} />}

        {!loading && !error && products.length > 0 && (
          <>
            <ComparisonSummary product={products[0]} />
            <FilterBar filters={filters} onFiltersChange={setFilters} sort={sort} onSortChange={setSort} />
            {visibleProducts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-500">
                No products match your filters.
              </p>
            ) : (
              <div className="space-y-4">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SearchPageInner />
    </Suspense>
  );
}
