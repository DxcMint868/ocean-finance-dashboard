import { NextResponse } from "next/server";
import { STATIC_PRICE_PAYLOAD } from "@/lib/price-response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: STATIC_PRICE_PAYLOAD,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
