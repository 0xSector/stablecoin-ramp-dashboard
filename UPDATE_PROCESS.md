# Monthly Data Update Process

This document describes how to update the stablecoin ramping costs data.

## Overview

The dashboard uses a hybrid data collection approach:
1. **Automated**: API calls to exchanges (Kraken, Binance) and FX providers (Frankfurter)
2. **Manual**: Reference checks against ramp provider widgets and reports

## Quick Update

```bash
# Run the update script
npx ts-node scripts/update-costs.ts

# Commit and deploy
git add data/
git commit -m "chore: monthly data update $(date +%Y-%m)"
git push
```

## Detailed Process

### 1. Automated Data Collection

The `scripts/update-costs.ts` script:
- Archives the previous month's data to `data/costs-historical/`
- Fetches Kraken ticker data for stablecoin pairs
- Fetches Frankfurter FX rates
- Updates the `lastUpdated` timestamp
- Logs spreads for manual verification

Run it with:
```bash
npx ts-node scripts/update-costs.ts
```

### 2. Manual Data Verification

After running the automated script, manually verify:

#### CEX Rates (5-10 min)
1. Visit [Kraken](https://www.kraken.com/prices) - verify USD/EUR/GBP stablecoin rates
2. Visit [Binance Convert](https://www.binance.com/en/convert) - spot check BRL, TRY, NGN rates

#### Ramp Provider Rates (10-15 min)
1. **MoonPay Widget**: Visit a site using MoonPay, check card rates for:
   - US (expect 3-5%)
   - UK (expect 3-5%)
   - Brazil (expect 5-7%)

2. **Yellow Card**: Visit [yellowcard.io](https://yellowcard.io)
   - Check Nigeria NGN rates
   - Check Kenya KES rates
   - Check South Africa ZAR rates

3. **Transak Widget**: Spot check a few countries

#### P2P Spreads (5-10 min)
1. Visit [Binance P2P](https://p2p.binance.com)
2. Check USDT buy/sell spread for:
   - Nigeria (NGN)
   - India (INR)
   - Argentina (ARS)
   - Brazil (BRL)

### 3. Update Data File

If manual checks reveal significant changes:

1. Open `data/costs-current.json`
2. Update the relevant country entries
3. Update the `sources` array if new sources were used
4. Update `confidence` level if data quality changed
5. Update `lastUpdated` to today's date

### 4. Validate Data

Run a quick sanity check:

```bash
# Build the project to catch any JSON errors
npm run build

# Start dev server and visually inspect
npm run dev
```

Check that:
- [ ] All countries display on the map
- [ ] Cost tiers look reasonable (no $0 or 100% values)
- [ ] Table sorting works correctly
- [ ] Trend chart renders properly

### 5. Commit and Deploy

```bash
git add data/
git add DATA_SOURCES.md  # if updated
git commit -m "chore: monthly data update $(date +%Y-%m)"
git push origin main
```

Vercel will automatically deploy from the main branch.

## Data Sources Reference

### Tier 1: Automated (Monthly)
| Source | Data | Endpoint |
|--------|------|----------|
| Kraken | CEX spreads (G10 currencies) | api.kraken.com/0/public/Ticker |
| Frankfurter | Mid-market FX rates | api.frankfurter.dev/v1/latest |

### Tier 2: Manual Reference
| Source | Data | How to Check |
|--------|------|--------------|
| MoonPay | Card on-ramp costs | Use widget on partner site |
| Transak | Card on-ramp costs | Use widget on partner site |
| Yellow Card | Africa ramp costs | yellowcard.io pricing |
| Binance P2P | P2P spreads | p2p.binance.com |

### Tier 3: Static Reference
| Source | Data |
|--------|------|
| Bluechip Report | Regional cost baselines, P2P spread ranges |

## Troubleshooting

### API Rate Limits
- Kraken: Public endpoints rarely rate limit
- Frankfurter: No rate limits (updates daily at 16:00 CET)

### Data Quality Issues
- If a country shows N/A for all costs, check if the `onRamp`/`offRamp` objects have null values
- If confidence is "low", consider adding more sources or marking for re-verification

### Build Errors
- JSON syntax errors: Run `npx jsonlint data/costs-current.json`
- TypeScript errors: Check that the data structure matches `lib/types.ts`

## Schedule

Recommended: **First week of each month**

1. Run automated update
2. Manual verification (30-45 min)
3. Commit and deploy
4. Quick visual QA on production site
