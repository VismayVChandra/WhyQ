# Adding a real platform provider

The app currently runs entirely on `MockProvider` (see `mockData.ts`). To wire up
a real platform:

1. Get official API access/documentation for the platform (Blinkit, Zepto,
   Swiggy Instamart, BigBasket, or a licensed aggregator). **Do not** reverse
   engineer or scrape private endpoints — see rule 17 (Security) in the product
   spec. If no public/partner API exists for a platform, it cannot be
   integrated legitimately; leave it on mock data.
2. Create `lib/providers/<Platform>Provider.ts` implementing `ShoppingProvider`
   (see `ShoppingProvider.ts`). It must:
   - Call the platform's documented endpoints only, exactly as documented.
   - Read its API key from `process.env.<PLATFORM>_API_KEY` — never hard-code it,
     never reference it from client components.
   - Throw `ProviderError` on failure instead of swallowing errors, so the
     comparison engine can report a clean "platform unavailable" state.
3. Register the provider in `lib/providers/registry.ts`.
4. Add the required env var to `.env.example` and document it here.
5. Test the provider in isolation before wiring it into `/api/search`.

`QuickCommerceProvider.ts` is left as a documented stub: fill it in only once
you have verified, real API documentation for a specific aggregator. Never
invent request/response shapes — if the documented shape differs from what's
assumed elsewhere in this codebase, the docs win and the codebase should be
updated to match.
