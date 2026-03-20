import { NextRequest, NextResponse } from "next/server";
import { JsonRpcProvider, Contract } from "ethers";
import { STATIC_PRICE_PAYLOAD, CoinGeckoTokenData } from "@/lib/price-response";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NAV_ORACLE_ABI = [
  "function getLatestNAV() external view returns (uint128 nav, uint64 timestamp)",
] as const;

const ERC20_ABI = [
  "function totalSupply() external view returns (uint256)",
] as const;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const rpcUrl = process.env.RPC_URL;
  const navOracleAddress = process.env.NAV_ORACLE_ADDRESS;
  const tokenAddress = process.env.OCEAN_TOKEN_ADDRESS;

  if (!rpcUrl) console.error("[price] Missing env var: RPC_URL");
  if (!navOracleAddress)
    console.error("[price] Missing env var: NAV_ORACLE_ADDRESS");
  if (!tokenAddress)
    console.error("[price] Missing env var: OCEAN_TOKEN_ADDRESS");
  if (!rpcUrl || !navOracleAddress || !tokenAddress) {
    return NextResponse.json({ success: false }, { status: 500 });
  }

  const provider = new JsonRpcProvider(rpcUrl);

  const navOracle = new Contract(navOracleAddress, NAV_ORACLE_ABI, provider);
  const token = new Contract(tokenAddress, ERC20_ABI, provider);

  const [{ nav }, totalSupply]: [{ nav: bigint }, bigint] = await Promise.all([
    navOracle.getLatestNAV(),
    token.totalSupply(),
  ]);

  // price = NAV / totalSupply (both 10^18; divide in 10^6 precision to match
  // the CoinGeckoTokenData unit convention where $1.00 → "1000000").
  // Multiply first to preserve
  // 10^6 precision before the integer division.
  const PRICE_PRECISION = BigInt(10) ** BigInt(6);
  const price = (nav * PRICE_PRECISION) / totalSupply;

  // marketCap = price × totalSupply = NAV (exact, no rounding).
  // Expressed in 10^6 units: divide NAV wei by 10^12.
  const marketCap = nav / BigInt(10) ** BigInt(12);

  const data: CoinGeckoTokenData = {
    price: price.toString(),
    marketCap: marketCap.toString(),
    tradingVolume: null,
    fdv: null,
    totalSupply: totalSupply.toString(),
    maxSupply: null,
    circulatingSupply: null,
    metadata: STATIC_PRICE_PAYLOAD.metadata,
    tokenName: STATIC_PRICE_PAYLOAD.tokenName,
    tokenTicker: STATIC_PRICE_PAYLOAD.tokenTicker,
    description: STATIC_PRICE_PAYLOAD.description,
  };

  return NextResponse.json(
    { success: true, id, data },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
