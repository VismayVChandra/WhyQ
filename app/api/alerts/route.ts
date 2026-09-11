import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/client";

/**
 * Creates a price alert row. No notification worker is wired up in the MVP
 * (spec section 14 explicitly allows this) — this just persists intent so
 * an email/push worker can be added later without a schema change.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.productId !== "string" || typeof body.targetPrice !== "number") {
    return NextResponse.json({ error: "productId and targetPrice are required." }, { status: 400 });
  }
  if (body.targetPrice <= 0) {
    return NextResponse.json({ error: "targetPrice must be positive." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Alerts require Supabase to be configured (see .env.example)." },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("price_alerts").insert({
    product_id: body.productId,
    target_price: body.targetPrice,
    platform: body.platform ?? null,
    email: typeof body.email === "string" ? body.email : null,
  });

  if (error) {
    return NextResponse.json({ error: "Couldn't create the alert." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
