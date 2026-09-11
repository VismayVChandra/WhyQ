import { Trophy, Clock } from "lucide-react";
import { PLATFORMS } from "@/lib/types";
import type { NormalizedProduct } from "@/lib/types";

export function PlatformResult({ result, isCheapest }: { result: NormalizedProduct; isCheapest: boolean }) {
  const info = PLATFORMS[result.platform];

  return (
    <div
      className={`flex flex-col rounded-xl border p-3 transition ${
        isCheapest ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200" : "border-zinc-100 bg-zinc-50"
      }`}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span
          className="rounded-md px-2 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: info.color, color: info.accent }}
        >
          {info.name}
        </span>
        {isCheapest && <Trophy size={15} className="text-brand-600" />}
      </div>

      {result.availability ? (
        <>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-zinc-900">₹{result.price}</span>
            {result.mrp && result.mrp > result.price && (
              <span className="text-xs text-zinc-400 line-through">₹{result.mrp}</span>
            )}
          </div>
          {result.deliveryEtaMinutes != null && (
            <span className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
              <Clock size={12} /> {result.deliveryEtaMinutes} min
            </span>
          )}
          <a
            href={result.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 rounded-lg py-1.5 text-center text-sm font-medium transition ${
              isCheapest
                ? "bg-brand-600 text-white hover:bg-brand-700"
                : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-100"
            }`}
          >
            Buy on {info.name}
          </a>
        </>
      ) : (
        <p className="mt-2 text-sm font-medium text-zinc-400">Currently unavailable</p>
      )}
    </div>
  );
}
