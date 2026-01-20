"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { RampCost, ViewMode, FundingMethod, Region, getCostColor, COST_TIERS } from "@/lib/types";
import { getCostValue } from "@/lib/utils";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map ISO 3166-1 alpha-2 to numeric codes for matching with TopoJSON
const countryCodeMap: Record<string, string> = {
  US: "840", CA: "124", GB: "826", DE: "276", FR: "250", NL: "528", ES: "724", CH: "756",
  BR: "076", MX: "484", AR: "032", CO: "170", PE: "604", VE: "862",
  NG: "566", KE: "404", ZA: "710", GH: "288", TZ: "834", UG: "800",
  TR: "792", EG: "818", AE: "784", SA: "682",
  IN: "356", PK: "586", BD: "050",
  PH: "608", ID: "360", TH: "764", VN: "704", MY: "458", SG: "702",
  JP: "392", KR: "410", HK: "344",
  AU: "036", NZ: "554",
};

interface CostMapProps {
  data: RampCost[];
  regions: Region[];
  onCountrySelect: (country: RampCost) => void;
}

export default function CostMap({ data, regions, onCountrySelect }: CostMapProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("onramp");
  const [fundingMethod, setFundingMethod] = useState<FundingMethod>("bank");
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");

  const filteredData = useMemo(() => {
    if (selectedRegion === "all") return data;
    return data.filter((country) => country.region === selectedRegion);
  }, [data, selectedRegion]);

  const costByCountry = useMemo(() => {
    const map = new Map<string, { cost: number | null; country: RampCost }>();
    filteredData.forEach((country) => {
      const numericCode = countryCodeMap[country.countryCode];
      if (numericCode) {
        const cost = getCostValue(country, viewMode, fundingMethod);
        map.set(numericCode, { cost, country });
      }
    });
    return map;
  }, [filteredData, viewMode, fundingMethod]);

  const getCountryColor = (geo: { properties: { name: string }; id: string }) => {
    const countryData = costByCountry.get(geo.id);
    if (!countryData) return "#334155";
    return getCostColor(countryData.cost);
  };

  const handleCountryClick = (geo: { id: string }) => {
    const countryData = costByCountry.get(geo.id);
    if (countryData) {
      onCountrySelect(countryData.country);
    }
  };

  const getViewLabel = () => {
    switch (viewMode) {
      case "onramp":
        return fundingMethod === "bank" ? "Bank On-Ramp" : "Card On-Ramp";
      case "offramp":
        return "Off-Ramp";
      case "p2p":
        return "P2P Spread";
    }
  };

  const viewModes: { value: ViewMode; label: string }[] = [
    { value: "onramp", label: "On-Ramp" },
    { value: "offramp", label: "Off-Ramp" },
    { value: "p2p", label: "P2P" },
  ];

  const fundingMethods: { value: FundingMethod; label: string }[] = [
    { value: "bank", label: "Bank" },
    { value: "card", label: "Card" },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* View Mode Toggle */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              View
            </label>
            <div className="flex rounded-lg overflow-hidden border border-slate-600">
              {viewModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setViewMode(mode.value)}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === mode.value
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Funding Method Toggle - Only show for on-ramp */}
          {viewMode === "onramp" && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Funding Method
              </label>
              <div className="flex rounded-lg overflow-hidden border border-slate-600">
                {fundingMethods.map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setFundingMethod(method.value)}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                      fundingMethod === method.value
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Region Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as Region | "all")}
              className="w-full rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-700"
            >
              <option value="all">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Global Cost Map</h2>
          <p className="text-sm text-slate-400">
            Showing: {getViewLabel()} costs
            {selectedRegion !== "all" && ` in ${selectedRegion}`}
          </p>
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
                            fill: hasData ? "#10b981" : "#475569",
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
        <div className="px-4 py-3 border-t border-slate-700 bg-slate-800">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {Object.entries(COST_TIERS).map(([key, tier]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: tier.color }}
                />
                <span className="text-xs text-slate-400">{tier.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-slate-200" />
              <span className="text-xs text-slate-400">No data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
