"use client";

import { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { RampCost, FilterState, getCostColor, COST_TIERS } from "@/lib/types";
import { getCostValue } from "@/lib/utils";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map ISO 3166-1 alpha-2 to alpha-3 for matching with TopoJSON
const countryCodeMap: Record<string, string> = {
  US: "USA", CA: "CAN", GB: "GBR", DE: "DEU", FR: "FRA", NL: "NLD", ES: "ESP", CH: "CHE",
  BR: "BRA", MX: "MEX", AR: "ARG", CO: "COL", PE: "PER", VE: "VEN",
  NG: "NGA", KE: "KEN", ZA: "ZAF", GH: "GHA", TZ: "TZA", UG: "UGA",
  TR: "TUR", EG: "EGY", AE: "ARE", SA: "SAU",
  IN: "IND", PK: "PAK", BD: "BGD",
  PH: "PHL", ID: "IDN", TH: "THA", VN: "VNM", MY: "MYS", SG: "SGP",
  JP: "JPN", KR: "KOR", HK: "HKG",
  AU: "AUS", NZ: "NZL",
};

interface CostMapProps {
  data: RampCost[];
  filters: FilterState;
  onCountrySelect: (country: RampCost) => void;
}

export default function CostMap({ data, filters, onCountrySelect }: CostMapProps) {
  const costByCountry = useMemo(() => {
    const map = new Map<string, { cost: number | null; country: RampCost }>();
    data.forEach((country) => {
      const alpha3 = countryCodeMap[country.countryCode];
      if (alpha3) {
        const cost = getCostValue(country, filters.viewMode, filters.fundingMethod);
        map.set(alpha3, { cost, country });
      }
    });
    return map;
  }, [data, filters]);

  const getCountryColor = (geo: { properties: { name: string }; id: string }) => {
    const countryData = costByCountry.get(geo.id);
    if (!countryData) return "#e2e8f0"; // slate-200 for no data
    return getCostColor(countryData.cost);
  };

  const handleCountryClick = (geo: { id: string }) => {
    const countryData = costByCountry.get(geo.id);
    if (countryData) {
      onCountrySelect(countryData.country);
    }
  };

  const getViewLabel = () => {
    switch (filters.viewMode) {
      case "onramp":
        return filters.fundingMethod === "bank" ? "Bank On-Ramp" : "Card On-Ramp";
      case "offramp":
        return "Off-Ramp";
      case "p2p":
        return "P2P Spread";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Global Cost Map</h2>
          <p className="text-sm text-slate-500">
            Showing: {getViewLabel()} costs
          </p>
        </div>
      </div>

      <div className="relative aspect-[2/1] min-h-[300px]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 30],
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const hasData = costByCountry.has(geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryColor(geo)}
                      stroke="#fff"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: hasData ? "#64748b" : "#e2e8f0",
                          outline: "none",
                          cursor: hasData ? "pointer" : "default",
                        },
                        pressed: { outline: "none" },
                      }}
                      onClick={() => handleCountryClick(geo)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {Object.entries(COST_TIERS).map(([key, tier]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: tier.color }}
              />
              <span className="text-xs text-slate-600">{tier.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slate-200" />
            <span className="text-xs text-slate-600">No data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
