"use client";

import { RampCost, getCostColor, COST_TIERS } from "@/lib/types";
import { formatPercent, formatDate, getConfidenceBadgeClass } from "@/lib/utils";

interface CountryDetailProps {
  country: RampCost;
  onClose: () => void;
}

export default function CountryDetail({ country, onClose }: CountryDetailProps) {
  const getFlagEmoji = (countryCode: string): string => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const CostRow = ({
    label,
    value,
    description,
  }: {
    label: string;
    value: number | null;
    description?: string;
  }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-600 last:border-0">
      <div>
        <span className="text-sm text-slate-300">{label}</span>
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getCostColor(value) }}
        />
        <span className="text-sm font-medium text-white">
          {formatPercent(value)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getFlagEmoji(country.countryCode)}</span>
            <div>
              <h2 className="text-xl font-bold text-white">
                {country.country}
              </h2>
              <p className="text-sm text-slate-400">
                {country.region} • {country.currency}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* On-Ramp Costs */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              On-Ramp Costs (Fiat → Stablecoin)
            </h3>
            <div className="bg-slate-700 rounded-lg p-4">
              <CostRow
                label="Bank Transfer"
                value={country.onRamp.bank}
                description="ACH, wire, or local bank transfer"
              />
              <CostRow
                label="Card Payment"
                value={country.onRamp.card}
                description="Debit or credit card"
              />
              <CostRow
                label="P2P"
                value={country.onRamp.p2p}
                description="Peer-to-peer marketplace spread"
              />
            </div>
          </div>

          {/* Off-Ramp Costs */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Off-Ramp Costs (Stablecoin → Fiat)
            </h3>
            <div className="bg-slate-700 rounded-lg p-4">
              <CostRow
                label="Bank Payout"
                value={country.offRamp.bank}
                description="Direct bank transfer"
              />
              <CostRow
                label="P2P"
                value={country.offRamp.p2p}
                description="Peer-to-peer sale"
              />
            </div>
          </div>

          {/* FX Spread */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              FX Spread
            </h3>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-slate-300">
                    vs Mid-Market Rate
                  </span>
                  <p className="text-xs text-slate-500">
                    {country.fxSpread.currencyType} currency
                  </p>
                </div>
                <span className="text-sm font-medium text-white">
                  {formatPercent(country.fxSpread.vsMidMarket)}
                </span>
              </div>
            </div>
          </div>

          {/* Data Quality */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Data Quality
            </h3>
            <div className="bg-slate-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Confidence</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceBadgeClass(
                    country.confidence
                  )}`}
                >
                  {country.confidence}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Last Updated</span>
                <span className="text-sm text-white">
                  {formatDate(country.lastUpdated)}
                </span>
              </div>
              <div>
                <span className="text-sm text-slate-300">Sources</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {country.sources.map((source) => (
                    <span
                      key={source}
                      className="inline-flex items-center px-2 py-0.5 rounded bg-slate-600 text-xs text-slate-300"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cost Legend */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Cost Tier Legend
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(COST_TIERS).map(([key, tier]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-full h-2 rounded"
                    style={{ backgroundColor: tier.color }}
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    {tier.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
