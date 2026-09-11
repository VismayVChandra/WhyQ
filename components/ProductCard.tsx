"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { ComparedProduct } from "@/lib/types";
import { PlatformResult } from "@/components/PlatformResult";
import { PriceHistory } from "@/components/PriceHistory";
import { AlertForm } from "@/components/AlertForm";

export function ProductCard({ product }: { product: ComparedProduct }) {
  const [showHistory, setShowHistory] = useState(false);
  const { cheapest, savings } = product.summary;

  return (
    <div className="animate-fade-in rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.canonicalName}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-xl bg-zinc-50 object-cover"
              unoptimized
            />
          ) : (
            <div className="h-14 w-14 shrink-0 rounded-xl bg-zinc-100" />
          )}
          <div>
            <h3 className="font-semibold text-zinc-900">{product.canonicalName}</h3>
            <p className="text-sm text-zinc-500">{product.quantity.display}</p>
          </div>
        </div>
        {cheapest && (
          <div className="text-right">
            <p className="text-xl font-bold text-brand-700">₹{cheapest.price}</p>
            {savings != null && savings > 0 && (
              <p className="text-xs font-medium text-brand-600">You save ₹{savings}</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {product.results.map((r) => (
          <PlatformResult
            key={r.platform}
            result={r}
            isCheapest={cheapest?.platform === r.platform && r.price === cheapest.price}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setShowHistory((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-zinc-400 transition hover:text-zinc-600"
        >
          <ChevronDown size={14} className={`transition-transform ${showHistory ? "rotate-180" : ""}`} />
          Price history
        </button>
        {cheapest && <AlertForm productId={product.id} currentBest={cheapest.price} />}
      </div>
      {showHistory && (
        <div className="mt-3">
          <PriceHistory productId={product.id} />
        </div>
      )}
    </div>
  );
}
