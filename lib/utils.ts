import { RampCost, ViewMode, FundingMethod } from "./types";

export function formatPercent(value: number | null): string {
  if (value === null) return "N/A";
  return `${value.toFixed(2)}%`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getCostValue(
  country: RampCost,
  viewMode: ViewMode,
  fundingMethod: FundingMethod
): number | null {
  switch (viewMode) {
    case "onramp":
      return fundingMethod === "bank" ? country.onRamp.bank : country.onRamp.card;
    case "offramp":
      return country.offRamp.bank;
    case "p2p":
      return country.onRamp.p2p;
    default:
      return null;
  }
}

export function getBestRate(country: RampCost): { value: number; method: string } | null {
  const rates: { value: number; method: string }[] = [];

  if (country.onRamp.bank !== null) {
    rates.push({ value: country.onRamp.bank, method: "Bank On-ramp" });
  }
  if (country.onRamp.card !== null) {
    rates.push({ value: country.onRamp.card, method: "Card On-ramp" });
  }
  if (country.onRamp.p2p !== null) {
    rates.push({ value: country.onRamp.p2p, method: "P2P" });
  }

  if (rates.length === 0) return null;
  return rates.reduce((best, current) =>
    current.value < best.value ? current : best
  );
}

export function getConfidenceBadgeClass(confidence: RampCost["confidence"]): string {
  switch (confidence) {
    case "high":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-red-100 text-red-800";
  }
}

export function sortByColumn<T>(
  data: T[],
  column: keyof T,
  direction: "asc" | "desc"
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];

    // Handle null values
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;

    // Compare values
    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    // String comparison
    const aStr = String(aVal);
    const bStr = String(bVal);
    return direction === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
}
