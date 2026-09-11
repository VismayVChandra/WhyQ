"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { LocationSelector } from "@/components/LocationSelector";
import { useLocation } from "@/lib/hooks/useLocation";

export function Header({ compactSearch }: { compactSearch?: React.ReactNode }) {
  const { location, setLocation, hydrated } = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 text-lg font-bold text-zinc-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
            Q
          </span>
          WhyQ
        </Link>

        {compactSearch && <div className="hidden flex-1 sm:block">{compactSearch}</div>}

        <div className="ml-auto flex items-center gap-2">
          {hydrated && <LocationSelector location={location} onChange={setLocation} />}
          <Link
            href="/cart"
            className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Compare list</span>
          </Link>
        </div>
      </div>
      {compactSearch && <div className="px-4 pb-3 sm:hidden">{compactSearch}</div>}
    </header>
  );
}
