export interface RampCost {
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  region: Region;
  currency: string;

  onRamp: {
    bank: number | null; // percentage, e.g., 0.3 for 0.3%
    card: number | null;
    p2p: number | null;
  };

  offRamp: {
    bank: number | null;
    p2p: number | null;
  };

  fxSpread: {
    vsMidMarket: number; // percentage spread vs mid-market
    currencyType: "G10" | "non-G10";
  };

  sources: string[]; // e.g., ["Binance", "Yellow Card"]
  lastUpdated: string; // ISO date
  confidence: "high" | "medium" | "low"; // data quality indicator
}

export interface RegionalSummary {
  region: Region;
  avgOnRampBank: number;
  avgOnRampCard: number;
  avgOffRamp: number;
  avgP2PSpread: number;
  countries: string[];
}

export type Region =
  | "North America"
  | "EU/UK"
  | "Latin America"
  | "Sub-Saharan Africa"
  | "MENA"
  | "South Asia"
  | "Southeast Asia"
  | "East Asia"
  | "Oceania";

export interface CostData {
  metadata: {
    version: string;
    generatedAt: string;
    month: string;
  };
  countries: RampCost[];
  regions: RegionalSummary[];
}

export type ViewMode = "onramp" | "offramp" | "p2p";
export type FundingMethod = "bank" | "card";

export interface FilterState {
  viewMode: ViewMode;
  fundingMethod: FundingMethod;
  selectedRegion: Region | "all";
}

// Cost tier thresholds for map coloring
export const COST_TIERS = {
  excellent: { max: 0.5, color: "#22c55e", label: "< 0.5%" },
  good: { max: 1, color: "#84cc16", label: "0.5-1%" },
  moderate: { max: 2.5, color: "#eab308", label: "1-2.5%" },
  high: { max: 5, color: "#f97316", label: "2.5-5%" },
  veryHigh: { max: Infinity, color: "#ef4444", label: "> 5%" },
} as const;

export function getCostTier(cost: number | null): keyof typeof COST_TIERS | null {
  if (cost === null) return null;
  if (cost < COST_TIERS.excellent.max) return "excellent";
  if (cost < COST_TIERS.good.max) return "good";
  if (cost < COST_TIERS.moderate.max) return "moderate";
  if (cost < COST_TIERS.high.max) return "high";
  return "veryHigh";
}

export function getCostColor(cost: number | null): string {
  const tier = getCostTier(cost);
  if (!tier) return "#d1d5db"; // gray for no data
  return COST_TIERS[tier].color;
}
