"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export function AlertForm({ productId, currentBest }: { productId: string; currentBest: number }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(Math.max(1, currentBest - 5).toString());
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const targetPrice = parseFloat(target);
    if (!targetPrice || targetPrice <= 0) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, targetPrice }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 flex items-center gap-1 text-xs font-medium text-zinc-400 transition hover:text-zinc-600"
      >
        <Bell size={13} /> Set a price alert
      </button>
    );
  }

  if (status === "done") {
    return <p className="mt-2 text-xs font-medium text-brand-600">You&apos;ll be watching this price.</p>;
  }

  return (
    <form onSubmit={submit} className="mt-2 flex items-center gap-2">
      <span className="text-xs text-zinc-500">Alert me below</span>
      <input
        type="number"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="w-20 rounded-md border border-zinc-200 px-2 py-1 text-xs outline-none focus:border-brand-400"
        min={1}
      />
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Create alert"}
      </button>
      {status === "error" && <span className="text-xs text-red-500">Couldn&apos;t save.</span>}
    </form>
  );
}
