import { NextRequest, NextResponse } from "next/server";
import { STATIC_PRICE_PAYLOAD } from "@/lib/price-response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json(
    {
      success: true,
      id,
      data: STATIC_PRICE_PAYLOAD,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
