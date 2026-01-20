"use client";

import { useState } from "react";
import Header from "./components/Header";
import FilterControls from "./components/FilterControls";
import RegionTable from "./components/RegionTable";
import CostMap from "./components/CostMap";
import TrendChart from "./components/TrendChart";
import CountryDetail from "./components/CountryDetail";
import { RampCost, FilterState, Region, CostData } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import costData from "@/data/costs-current.json";

type TabView = "table" | "map" | "trends";

export default function Home() {
  const data = costData as CostData;

  const [activeTab, setActiveTab] = useState<TabView>("table");
  const [filters, setFilters] = useState<FilterState>({
    viewMode: "onramp",
    fundingMethod: "bank",
    selectedRegion: "all",
  });
  const [selectedCountry, setSelectedCountry] = useState<RampCost | null>(null);

  const regions = data.regions.map((r) => r.region) as Region[];

  const tabs: { id: TabView; label: string }[] = [
    { id: "table", label: "Comparison Table" },
    { id: "map", label: "Cost Map" },
    { id: "trends", label: "Trends" },
  ];

  return (
    <div className="min-h-screen">
      <Header lastUpdated={formatDate(data.metadata.generatedAt)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Best Bank Rate"
            value="0%"
            sublabel="United States (Coinbase)"
          />
          <StatCard
            label="Highest Region"
            value={`${data.regions.find(r => r.region === "Sub-Saharan Africa")?.avgOnRampBank.toFixed(1)}%`}
            sublabel="Sub-Saharan Africa avg"
          />
          <StatCard
            label="Card Premium"
            value={`+${(data.regions.reduce((sum, r) => sum + r.avgOnRampCard, 0) / data.regions.length - data.regions.reduce((sum, r) => sum + r.avgOnRampBank, 0) / data.regions.length).toFixed(1)}%`}
            sublabel="vs bank transfer"
          />
          <StatCard
            label="P2P Markets"
            value={data.countries.filter(c => c.onRamp.p2p !== null).length.toString()}
            sublabel={`of ${data.countries.length} countries`}
          />
        </div>

        {/* Filter Controls */}
        <FilterControls
          filters={filters}
          onFilterChange={setFilters}
          regions={regions}
        />

        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === "table" && (
            <RegionTable
              data={data.countries}
              filters={filters}
              onCountrySelect={setSelectedCountry}
            />
          )}
          {activeTab === "map" && (
            <CostMap
              data={data.countries}
              filters={filters}
              onCountrySelect={setSelectedCountry}
            />
          )}
          {activeTab === "trends" && (
            <TrendChart regions={data.regions} />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-slate-500">
          <p>
            Data sourced from exchange APIs and the{" "}
            <a
              href="https://bluechip.org"
              className="text-slate-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bluechip Report
            </a>
            . Updated monthly.
          </p>
          <p className="mt-2">
            Built with Next.js
          </p>
        </footer>
      </main>

      {/* Country Detail Modal */}
      {selectedCountry && (
        <CountryDetail
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      {sublabel && <p className="text-xs text-slate-400 mt-1">{sublabel}</p>}
    </div>
  );
}
