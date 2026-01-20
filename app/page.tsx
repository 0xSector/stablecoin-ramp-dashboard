"use client";

import { useState } from "react";
import Header from "./components/Header";
import RegionTable from "./components/RegionTable";
import CostMap from "./components/CostMap";
import TrendChart from "./components/TrendChart";
import CountryDetail from "./components/CountryDetail";
import RampModels from "./components/RampModels";
import { RampCost, Region, CostData } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import costData from "@/data/costs-current.json";
import rampModelsData from "@/data/ramp-models.json";

type TabView = "table" | "map" | "trends" | "models";

export default function Home() {
  const data = costData as CostData;

  const [activeTab, setActiveTab] = useState<TabView>("models");
  const [selectedCountry, setSelectedCountry] = useState<RampCost | null>(null);

  const regions = data.regions.map((r) => r.region) as Region[];

  const tabs: { id: TabView; label: string }[] = [
    { id: "models", label: "Ramp Types" },
    { id: "table", label: "Comparison Table" },
    { id: "map", label: "Cost Map" },
    { id: "trends", label: "Trends" },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
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
            label="Countries"
            value={data.countries.length.toString()}
            sublabel={`across ${data.regions.length} regions`}
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-1">
          <nav className="flex gap-1" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === "models" && (
            <RampModels models={rampModelsData.models} />
          )}
          {activeTab === "table" && (
            <RegionTable
              data={data.countries}
              onCountrySelect={setSelectedCountry}
            />
          )}
          {activeTab === "map" && (
            <CostMap
              data={data.countries}
              regions={regions}
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
              className="text-emerald-400 hover:underline"
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
  accent,
}: {
  label: string;
  value: string;
  sublabel?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-lg shadow-sm border p-4 ${
      accent
        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400 text-white"
        : "bg-slate-800 border-slate-700"
    }`}>
      <p className={`text-sm ${accent ? "text-emerald-100" : "text-slate-400"}`}>{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent ? "text-white" : "text-white"}`}>{value}</p>
      {sublabel && <p className={`text-xs mt-1 ${accent ? "text-emerald-100" : "text-slate-500"}`}>{sublabel}</p>}
    </div>
  );
}
