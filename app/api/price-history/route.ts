import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/client";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Missing productId." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    // Supabase isn't configured — this is expected on mock-only setups.
    // Never fabricate history; just say none is available yet.
    return NextResponse.json({ points: [] });
  }

  const { data, error } = await supabase
    .from("price_history")
    .select("platform, price, recorded_at")
    .eq("product_id", productId)
    .order("recorded_at", { ascending: true })
    .limit(200);

  if (error) {
    return NextResponse.json({ points: [] });
  }

  const points = (data ?? []).map((row) => ({
    platform: row.platform,
    price: row.price,
    recordedAt: row.recorded_at,
  }));

  return NextResponse.json({ points });
}
