"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RegionalSummary } from "@/lib/types";

interface TrendChartProps {
  regions: RegionalSummary[];
}

// Sample trend data - in production this would come from historical files
const generateTrendData = (regions: RegionalSummary[]) => {
  const months = ["Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026"];

  return months.map((month, idx) => {
    const dataPoint: Record<string, string | number> = { month };

    // Simulate slight variations over time
    regions.forEach((region) => {
      const variation = 1 + (Math.random() - 0.5) * 0.1 * (3 - idx);
      dataPoint[region.region] = +(region.avgOnRampBank * variation).toFixed(2);
    });

    return dataPoint;
  });
};

const REGION_COLORS: Record<string, string> = {
  "North America": "#3b82f6",
  "EU/UK": "#8b5cf6",
  "Latin America": "#f59e0b",
  "Sub-Saharan Africa": "#ef4444",
  "MENA": "#10b981",
  "South Asia": "#f97316",
  "Southeast Asia": "#06b6d4",
  "East Asia": "#6366f1",
  "Oceania": "#84cc16",
};

export default function TrendChart({ regions }: TrendChartProps) {
  const trendData = generateTrendData(regions);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Cost Trends by Region
        </h2>
        <p className="text-sm text-slate-500">
          Bank on-ramp costs over time (%)
        </p>
      </div>

      <div className="p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={{ stroke: "#e2e8f0" }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value) => {
                  if (typeof value === "number") {
                    return [`${value.toFixed(2)}%`, ""];
                  }
                  return ["", ""];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                iconType="line"
              />
              {regions.map((region) => (
                <Line
                  key={region.region}
                  type="monotone"
                  dataKey={region.region}
                  stroke={REGION_COLORS[region.region] || "#64748b"}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-500 text-center">
          Historical data is simulated for demo. Real trends will populate as monthly updates accumulate.
        </p>
      </div>
    </div>
  );
}
