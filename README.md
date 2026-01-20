# Stablecoin Ramping Costs Dashboard

A public dashboard tracking global stablecoin on-ramp and off-ramp costs across regions and funding methods.

## Features

- **Comparison Table**: Sortable table with costs by country (bank, card, P2P)
- **Interactive Map**: Choropleth visualization of global ramping costs
- **Trend Charts**: Historical cost trends by region
- **Country Details**: Detailed breakdown with data sources and confidence levels

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: react-simple-maps
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
stablecoin-ramp-dashboard/
├── app/
│   ├── components/
│   │   ├── CostMap.tsx        # Choropleth map
│   │   ├── CountryDetail.tsx  # Detail modal
│   │   ├── FilterControls.tsx # View/region filters
│   │   ├── Header.tsx
│   │   ├── RegionTable.tsx    # Main comparison table
│   │   └── TrendChart.tsx     # Line chart
│   ├── api/costs/route.ts     # API endpoint
│   ├── layout.tsx
│   └── page.tsx
├── data/
│   ├── costs-current.json     # Current month data
│   ├── costs-historical/      # Monthly archives
│   └── countries.json         # Country metadata
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   └── utils.ts               # Helper functions
├── scripts/
│   └── update-costs.ts        # Monthly update script
├── DATA_SOURCES.md            # API research & recommendations
└── UPDATE_PROCESS.md          # Monthly update instructions
```

## Data Sources

### Automated (Free APIs)
- **Kraken**: CEX prices for G10 fiat/stablecoin pairs
- **Frankfurter**: Mid-market FX rates (ECB data)

### Manual Reference
- **MoonPay/Transak**: Card-funded ramp costs (via widgets)
- **Yellow Card**: African market rates
- **Binance P2P**: P2P spread data

### Static Reference
- **Bluechip Report**: Regional cost baselines

See [DATA_SOURCES.md](./DATA_SOURCES.md) for full API documentation.

## Monthly Updates

The data is updated monthly. See [UPDATE_PROCESS.md](./UPDATE_PROCESS.md) for instructions.

Quick update:
```bash
npx ts-node scripts/update-costs.ts
git add data/ && git commit -m "chore: monthly update" && git push
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy

The dashboard uses static generation, so it's fast and free to host.

### Manual

```bash
npm run build
npm start
```

## Cost Tier Legend

| Color | Range | Description |
|-------|-------|-------------|
| Green | < 0.5% | Excellent |
| Light Green | 0.5-1% | Good |
| Yellow | 1-2.5% | Moderate |
| Orange | 2.5-5% | High |
| Red | > 5% | Very High |

## License

MIT
