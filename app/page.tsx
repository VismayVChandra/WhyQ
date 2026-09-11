import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { PLATFORMS } from "@/lib/types";

const TRENDING = ["Amul Taaza Milk 1L", "Maggi Noodles", "Coca-Cola 750ml", "Bread", "Eggs"];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 pb-24 pt-20 text-center sm:pt-28">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
            Compare. Save.{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              Buy Smarter.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-500 sm:text-lg">
            Find the best price for your groceries across India&apos;s quick-commerce platforms.
          </p>
        </div>

        <div className="mt-10 w-full animate-fade-in" style={{ animationDelay: "80ms" }}>
          <SearchBar />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-400">
          <span>Try:</span>
          {TRENDING.map((t) => (
            <a
              key={t}
              href={`/search?q=${encodeURIComponent(t)}`}
              className="rounded-full border border-zinc-200 px-3 py-1 text-zinc-600 transition hover:border-brand-300 hover:text-brand-700"
            >
              {t}
            </a>
          ))}
        </div>

        <div className="mt-16 animate-fade-in" style={{ animationDelay: "160ms" }}>
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-400">
            Compare prices across
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Object.values(PLATFORMS).map((p) => (
              <span
                key={p.id}
                className="rounded-full px-4 py-2 text-sm font-semibold shadow-sm"
                style={{ backgroundColor: p.color, color: p.accent }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-20 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {[
            { title: "One search, every app", body: "No more switching between four apps to check prices." },
            { title: "Real-time comparison", body: "Live prices, delivery time and stock across platforms." },
            { title: "Built on trust", body: "Never fabricated prices — just what platforms actually show." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
              <h3 className="mb-1.5 font-semibold text-zinc-900">{f.title}</h3>
              <p className="text-sm text-zinc-500">{f.body}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-zinc-100 py-6 text-center text-xs text-zinc-400">
        WhyQ is an independent price comparison tool. Not affiliated with Blinkit, Zepto, Swiggy
        Instamart or BigBasket.
      </footer>
    </div>
  );
}
