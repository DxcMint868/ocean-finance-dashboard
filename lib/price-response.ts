interface Metadata {
  categories?: string[];
  websites?: string;
  description?: string;
  repos?: {
    github: string[];
    bitbucket: string[];
  };
  chatLink?: string[];
  telegram?: string;
  twitter?: string;
}

export interface CoinGeckoTokenData {
  // Derived on-chain: price = NAV / totalSupply (NAV-per-token, book value).
  // Unit: 10^6 (i.e. $1.00 → "1000000"). Switch to a market-price feed once
  // secondary liquidity exists.
  price: string;

  // Derived on-chain: marketCap = price × totalSupply = NAV.
  // Unit: 10^6 (same as price).
  marketCap: string;

  // null — requires an on-chain trade-event indexer to compute. Not yet built.
  tradingVolume: null;

  // null - no hard cap on token supply
  fdv: null;

  // Unit: 10^18 (raw token wei).
  totalSupply: string;

  // null — no hard cap on token supply.
  maxSupply: null;

  // null — requires an indexer to subtract tokens locked in vesting vaults
  // from totalSupply. Not implemented yet.
  circulatingSupply: null;

  metadata: Metadata;
  tokenName: string;
  tokenTicker: string;
  description: string;
}

export const STATIC_PRICE_PAYLOAD: CoinGeckoTokenData = {
  price: "1000000",
  marketCap: "250000000000000",
  tradingVolume: null,
  fdv: null,
  totalSupply: "300000000000000000000000000",
  maxSupply: null,
  circulatingSupply: null,
  metadata: {
    categories: [],
    websites: "",
    description: "",
    repos: {
      github: [],
      bitbucket: [],
    },
    chatLink: [],
    telegram: "",
    twitter: "",
  },
  tokenName: "Ocean Finance",
  tokenTicker: "OCEAN",
  description: "",
};
