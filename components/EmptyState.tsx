import { SearchX } from "lucide-react";

export function EmptyState({ query }: { query: string }) {
  return (
    <div className="animate-fade-in rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
      <SearchX className="mx-auto mb-3 h-9 w-9 text-zinc-300" />
      <p className="font-medium text-zinc-700">We couldn&apos;t find &quot;{query}&quot;.</p>
      <p className="mt-1 text-sm text-zinc-500">Try:</p>
      <ul className="mt-2 space-y-0.5 text-sm text-zinc-500">
        <li>A simpler product name</li>
        <li>Brand + product name</li>
        <li>Different spelling</li>
      </ul>
    </div>
  );
}
