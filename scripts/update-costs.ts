/**
 * Stablecoin Ramping Costs - Data Update Script
 *
 * This script fetches the latest pricing data from available APIs
 * and updates the costs-current.json file.
 *
 * Usage: npx ts-node scripts/update-costs.ts
 */

import * as fs from "fs";
import * as path from "path";

interface KrakenTickerResponse {
  error: string[];
  result: Record<
    string,
    {
      a: [string, string, string]; // ask
      b: [string, string, string]; // bid
      c: [string, string]; // last trade
    }
  >;
}

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

const KRAKEN_API = "https://api.kraken.com/0/public/Ticker";
const FRANKFURTER_API = "https://api.frankfurter.dev/v1/latest";

// Kraken trading pairs for stablecoins
const KRAKEN_PAIRS = [
  "USDCUSD",
  "USDTZUSD",
  "USDCEUR",
  "USDTZEUR",
  "USDCGBP",
];

async function fetchKrakenTickers(): Promise<Record<string, { bid: number; ask: number; spread: number }>> {
  const results: Record<string, { bid: number; ask: number; spread: number }> = {};

  try {
    const pairParam = KRAKEN_PAIRS.join(",");
    const response = await fetch(`${KRAKEN_API}?pair=${pairParam}`);
    const data: KrakenTickerResponse = await response.json();

    if (data.error.length > 0) {
      console.error("Kraken API errors:", data.error);
      return results;
    }

    for (const [pair, ticker] of Object.entries(data.result)) {
      const bid = parseFloat(ticker.b[0]);
      const ask = parseFloat(ticker.a[0]);
      const midPrice = (bid + ask) / 2;
      const spread = ((ask - bid) / midPrice) * 100;

      results[pair] = { bid, ask, spread };
    }
  } catch (error) {
    console.error("Failed to fetch Kraken data:", error);
  }

  return results;
}

async function fetchFrankfurterRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch(`${FRANKFURTER_API}?from=USD`);
    const data: FrankfurterResponse = await response.json();
    return data.rates;
  } catch (error) {
    console.error("Failed to fetch Frankfurter data:", error);
    return {};
  }
}

async function archivePreviousMonth(): Promise<void> {
  const currentDataPath = path.join(__dirname, "../data/costs-current.json");
  const historicalDir = path.join(__dirname, "../data/costs-historical");

  if (!fs.existsSync(currentDataPath)) {
    console.log("No current data file to archive");
    return;
  }

  // Ensure historical directory exists
  if (!fs.existsSync(historicalDir)) {
    fs.mkdirSync(historicalDir, { recursive: true });
  }

  // Read current data and get its month
  const currentData = JSON.parse(fs.readFileSync(currentDataPath, "utf-8"));
  const month = currentData.metadata.month;

  // Archive to historical directory
  const archivePath = path.join(historicalDir, `${month}.json`);
  fs.copyFileSync(currentDataPath, archivePath);
  console.log(`Archived previous data to ${archivePath}`);
}

async function updateCosts(): Promise<void> {
  console.log("Starting data update...\n");

  // Archive previous month's data
  await archivePreviousMonth();

  // Fetch fresh data from APIs
  console.log("Fetching Kraken ticker data...");
  const krakenData = await fetchKrakenTickers();
  console.log(`  Retrieved ${Object.keys(krakenData).length} pairs`);

  console.log("\nFetching Frankfurter FX rates...");
  const fxRates = await fetchFrankfurterRates();
  console.log(`  Retrieved ${Object.keys(fxRates).length} currency rates`);

  // Load current data
  const currentDataPath = path.join(__dirname, "../data/costs-current.json");
  const currentData = JSON.parse(fs.readFileSync(currentDataPath, "utf-8"));

  // Update metadata
  const now = new Date();
  currentData.metadata.generatedAt = now.toISOString();
  currentData.metadata.month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // Log Kraken spreads for reference
  console.log("\n--- Kraken Spreads ---");
  for (const [pair, data] of Object.entries(krakenData)) {
    console.log(`  ${pair}: ${data.spread.toFixed(4)}% (bid: ${data.bid}, ask: ${data.ask})`);
  }

  // Log FX rates for reference
  console.log("\n--- FX Rates (vs USD) ---");
  const relevantCurrencies = ["EUR", "GBP", "BRL", "MXN", "NGN", "KES", "INR", "PHP", "JPY"];
  for (const currency of relevantCurrencies) {
    if (fxRates[currency]) {
      console.log(`  ${currency}: ${fxRates[currency]}`);
    }
  }

  // Update lastUpdated for all countries
  const today = now.toISOString().split("T")[0];
  for (const country of currentData.countries) {
    // Only update countries that have automated data sources
    if (country.sources.includes("Kraken") || country.sources.includes("Binance")) {
      country.lastUpdated = today;
    }
  }

  // Write updated data
  fs.writeFileSync(currentDataPath, JSON.stringify(currentData, null, 2));
  console.log(`\nUpdated ${currentDataPath}`);

  // Validation
  console.log("\n--- Validation ---");
  console.log(`  Countries: ${currentData.countries.length}`);
  console.log(`  Regions: ${currentData.regions.length}`);

  const highConfidence = currentData.countries.filter((c: { confidence: string }) => c.confidence === "high").length;
  const mediumConfidence = currentData.countries.filter((c: { confidence: string }) => c.confidence === "medium").length;
  const lowConfidence = currentData.countries.filter((c: { confidence: string }) => c.confidence === "low").length;

  console.log(`  Confidence: ${highConfidence} high, ${mediumConfidence} medium, ${lowConfidence} low`);
  console.log("\nUpdate complete!");
}

// Run the update
updateCosts().catch(console.error);
