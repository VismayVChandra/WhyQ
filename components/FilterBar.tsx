"use client";

import { PLATFORMS } from "@/lib/types";
import type { Platform, SearchFilters, SortOption } from "@/lib/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "cheapest", label: "Cheapest" },
  { value: "fastest", label: "Fastest delivery" },
  { value: "discount", label: "Highest discount" },
];

export function FilterBar({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
}: {
  filters: SearchFilters;
  onFiltersChange: (f: SearchFilters) => void;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
}) {
  function togglePlatform(p: Platform) {
    const platforms = filters.platforms.includes(p)
      ? filters.platforms.filter((x) => x !== p)
      : [...filters.platforms, p];
    onFiltersChange({ ...filters, platforms });
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 outline-none focus:border-brand-400"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            Sort: {o.label}
          </option>
        ))}
      </select>

      <Chip
        active={filters.inStockOnly}
        onClick={() => onFiltersChange({ ...filters, inStockOnly: !filters.inStockOnly })}
      >
        In stock
      </Chip>
      <Chip
        active={filters.underPrice === 100}
        onClick={() =>
          onFiltersChange({ ...filters, underPrice: filters.underPrice === 100 ? null : 100 })
        }
      >
        Under ₹100
      </Chip>
      <Chip
        active={filters.deliveryUnderMinutes === 15}
        onClick={() =>
          onFiltersChange({
            ...filters,
            deliveryUnderMinutes: filters.deliveryUnderMinutes === 15 ? null : 15,
          })
        }
      >
        Delivery under 15 min
      </Chip>

      <div className="mx-1 h-5 w-px bg-zinc-200" />

      {Object.values(PLATFORMS).map((p) => (
        <Chip key={p.id} active={filters.platforms.includes(p.id)} onClick={() => togglePlatform(p.id)}>
          {p.name}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
      }`}
    >
      {children}
    </button>
  );
}
