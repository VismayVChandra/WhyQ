"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({
  initialQuery = "",
  size = "large",
}: {
  initialQuery?: string;
  size?: "large" | "compact";
}) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const large = size === "large";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full items-center gap-2 rounded-2xl border border-zinc-200 bg-white shadow-sm transition focus-within:border-brand-400 focus-within:shadow-md ${
        large ? "p-2" : "p-1.5"
      }`}
    >
      <Search className={`ml-2 shrink-0 text-zinc-400 ${large ? "h-5 w-5" : "h-4 w-4"}`} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What are you looking for?"
        className={`w-full min-w-0 bg-transparent outline-none placeholder:text-zinc-400 ${
          large ? "py-2.5 text-base" : "py-1 text-sm"
        }`}
      />
      <button
        type="submit"
        className={`shrink-0 rounded-xl bg-brand-600 font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98] ${
          large ? "px-5 py-2.5" : "px-3.5 py-1.5 text-sm"
        }`}
      >
        Search
      </button>
    </form>
  );
}
