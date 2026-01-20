"use client";

import { ViewMode, Region, FilterState } from "@/lib/types";

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  regions: Region[];
}

export default function FilterControls({
  filters,
  onFilterChange,
  regions,
}: FilterControlsProps) {
  const viewModes: { value: ViewMode; label: string }[] = [
    { value: "onramp", label: "On-Ramp" },
    { value: "offramp", label: "Off-Ramp" },
    { value: "p2p", label: "P2P" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* View Mode Toggle */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            View
          </label>
          <div className="flex rounded-lg overflow-hidden border border-slate-300">
            {viewModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() =>
                  onFilterChange({ ...filters, viewMode: mode.value })
                }
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  filters.viewMode === mode.value
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Region Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Region
          </label>
          <select
            value={filters.selectedRegion}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                selectedRegion: e.target.value as Region | "all",
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
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
  );
}
