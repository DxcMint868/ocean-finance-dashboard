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
  price: string;
  marketCap: string;
  tradingVolume: string;
  fdv: string;
  totalSupply: string;
  maxSupply: string | null;
  circulatingSupply: string;
  metadata: Metadata;
  tokenName: string;
  tokenTicker: string;
  description: string;
}

// price, marketCap, tradingVolume, fdv — 10^6 decimals
// totalSupply, maxSupply, circulatingSupply    — 10^18 decimals
export const STATIC_PRICE_PAYLOAD: CoinGeckoTokenData = {
  price: "1000000",
  marketCap: "250000000000000",
  tradingVolume: "18500000000000",
  fdv: "300000000000000",
  totalSupply: "300000000000000000000000000",
  maxSupply: null,
  circulatingSupply: "250000000000000000000000000",
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
