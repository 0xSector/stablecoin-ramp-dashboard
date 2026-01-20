"use client";

import { useState, useMemo } from "react";
import { RampCost, getCostColor } from "@/lib/types";
import { formatPercent, getBestRate, getConfidenceBadgeClass } from "@/lib/utils";

interface RegionTableProps {
  data: RampCost[];
  onCountrySelect: (country: RampCost) => void;
}

type SortColumn = "country" | "region" | "bankOnRamp" | "cardOnRamp" | "offRamp" | "p2p" | "bestRate";
type SortDirection = "asc" | "desc";

export default function RegionTable({ data, onCountrySelect }: RegionTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("bankOnRamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aVal: string | number | null;
      let bVal: string | number | null;

      switch (sortColumn) {
        case "country":
          aVal = a.country;
          bVal = b.country;
          break;
        case "region":
          aVal = a.region;
          bVal = b.region;
          break;
        case "bankOnRamp":
          aVal = a.onRamp.bank;
          bVal = b.onRamp.bank;
          break;
        case "cardOnRamp":
          aVal = a.onRamp.card;
          bVal = b.onRamp.card;
          break;
        case "offRamp":
          aVal = a.offRamp.bank;
          bVal = b.offRamp.bank;
          break;
        case "p2p":
          aVal = a.onRamp.p2p;
          bVal = b.onRamp.p2p;
          break;
        case "bestRate":
          aVal = getBestRate(a)?.value ?? null;
          bVal = getBestRate(b)?.value ?? null;
          break;
        default:
          return 0;
      }

      // Handle nulls
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      // Compare
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortHeader = ({ column, children }: { column: SortColumn; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortColumn === column && (
          <span className="text-slate-500">
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  );

  const CostCell = ({ value }: { value: number | null }) => {
    const color = getCostColor(value);
    return (
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm text-white">{formatPercent(value)}</span>
        </div>
      </td>
    );
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">
          Regional Comparison
        </h2>
        <p className="text-sm text-slate-500">
          {data.length} countries • Click a row for details
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900">
            <tr>
              <SortHeader column="country">Country</SortHeader>
              <SortHeader column="region">Region</SortHeader>
              <SortHeader column="bankOnRamp">Bank On-ramp</SortHeader>
              <SortHeader column="cardOnRamp">Card On-ramp</SortHeader>
              <SortHeader column="offRamp">Off-ramp</SortHeader>
              <SortHeader column="p2p">P2P Spread</SortHeader>
              <SortHeader column="bestRate">Best Rate</SortHeader>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {sortedData.map((country) => {
              const bestRate = getBestRate(country);
              return (
                <tr
                  key={country.countryCode}
                  onClick={() => onCountrySelect(country)}
                  className="hover:bg-slate-900 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getFlagEmoji(country.countryCode)}</span>
                      <span className="text-sm font-medium text-white">
                        {country.country}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                    {country.region}
                  </td>
                  <CostCell value={country.onRamp.bank} />
                  <CostCell value={country.onRamp.card} />
                  <CostCell value={country.offRamp.bank} />
                  <CostCell value={country.onRamp.p2p} />
                  <td className="px-4 py-3 whitespace-nowrap">
                    {bestRate ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getCostColor(bestRate.value) }}
                        />
                        <span className="text-sm font-medium text-white">
                          {formatPercent(bestRate.value)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                    {country.sources.slice(0, 2).join(", ")}
                    {country.sources.length > 2 && "..."}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConfidenceBadgeClass(
                        country.confidence
                      )}`}
                    >
                      {country.confidence}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
