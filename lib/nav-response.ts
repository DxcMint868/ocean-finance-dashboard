export interface NavApiPayload {
  nav: string; // bigint string (decimals: 18)
  timestamp: number;
  currency: string;
  status: "processed";
  source: string;
}

// Static stub until the statement-processing pipeline is wired into this route.
export const STATIC_NAV_PAYLOAD: NavApiPayload = {
  nav: "51711827000000000000000000",
  timestamp: 1770076800, // 2026-02-03T00:00:00Z
  currency: "USD",
  status: "processed",
  source: "statement-closing-balance-static-stub",
};
