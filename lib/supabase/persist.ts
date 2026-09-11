import type { ComparedProduct } from "@/lib/types";
import { getSupabaseServerClient } from "@/lib/supabase/client";

/**
 * Best-effort persistence of a search's matched products so price history
 * can accumulate over time (spec section 13). Called fire-and-forget from
 * the search API route — a failure here must never affect the search
 * response, since the app has to keep working on mock data / without
 * Supabase configured at all.
 */
export async function persistProductResults(products: ComparedProduct[]): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase || products.length === 0) return;

  const productRows = products.map((p) => ({
    id: p.id,
    canonical_name: p.canonicalName,
    brand: p.brand,
    quantity_value: p.quantity.value,
    quantity_unit: p.quantity.unit,
    image_url: p.imageUrl,
  }));
  await supabase.from("products").upsert(productRows);

  const resultRows = products.flatMap((p) =>
    p.results.map((r) => ({
      product_id: p.id,
      platform: r.platform,
      platform_product_id: r.platformProductId,
      price: r.price,
      mrp: r.mrp,
      discount_percent: r.discountPercent,
      availability: r.availability,
      delivery_eta_minutes: r.deliveryEtaMinutes,
      product_url: r.productUrl,
      fetched_at: new Date().toISOString(),
    }))
  );
  await supabase.from("product_results").upsert(resultRows, { onConflict: "product_id,platform" });

  const historyRows = products.flatMap((p) =>
    p.results.map((r) => ({
      product_id: p.id,
      platform: r.platform,
      price: r.price,
    }))
  );
  await supabase.from("price_history").insert(historyRows);
}
