"use client";

import { useEffect, useState } from "react";
import type { Platform, PriceHistoryPoint } from "@/lib/types";
import { PLATFORMS } from "@/lib/types";

export function PriceHistory({ productId }: { productId: string }) {
  const [points, setPoints] = useState<PriceHistoryPoint[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/price-history?productId=${encodeURIComponent(productId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPoints(data.points ?? []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (error) {
    return <p className="text-xs text-zinc-400">Couldn&apos;t load price history.</p>;
  }

  if (points === null) {
    return <div className="skeleton h-16 rounded-lg" />;
  }

  if (points.length < 2) {
    return (
      <p className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-500">
        Price history will appear as more data is collected.
      </p>
    );
  }

  const byPlatform = points.reduce<Record<string, PriceHistoryPoint[]>>((acc, p) => {
    (acc[p.platform] ??= []).push(p);
    return acc;
  }, {});

  const allPrices = points.map((p) => p.price);
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);

  return (
    <div className="space-y-2 rounded-lg bg-zinc-50 p-3">
      {Object.entries(byPlatform).map(([platform, series]) => (
        <MiniSparkline key={platform} platform={platform as Platform} series={series} min={min} max={max} />
      ))}
    </div>
  );
}

function MiniSparkline({
  platform,
  series,
  min,
  max,
}: {
  platform: Platform;
  series: PriceHistoryPoint[];
  min: number;
  max: number;
}) {
  const width = 200;
  const height = 32;
  const range = Math.max(max - min, 1);
  const points = series
    .map((p, i) => {
      const x = (i / Math.max(series.length - 1, 1)) * width;
      const y = height - ((p.price - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex items-center gap-3">
      <span
        className="w-20 shrink-0 rounded px-1.5 py-0.5 text-center text-[11px] font-semibold"
        style={{ backgroundColor: PLATFORMS[platform].color, color: PLATFORMS[platform].accent }}
      >
        {PLATFORMS[platform].name}
      </span>
      <svg width={width} height={height} className="overflow-visible">
        <polyline points={points} fill="none" stroke="#2fae4c" strokeWidth={1.5} />
      </svg>
      <span className="ml-auto text-xs font-medium text-zinc-600">
        ₹{series[series.length - 1].price}
      </span>
    </div>
  );
}
