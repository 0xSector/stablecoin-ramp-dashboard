"use client";

import { useState } from "react";

interface RampModel {
  id: string;
  name: string;
  costRange: string;
  costLevel: string;
  description: string;
  howItWorks: string;
  providers: string[];
  bestFor: string;
  pros: string[];
  cons: string[];
}

interface RampModelsProps {
  models: RampModel[];
}

const costLevelColors: Record<string, { bg: string; text: string }> = {
  "Lowest": { bg: "bg-green-100", text: "text-green-800" },
  "Low": { bg: "bg-green-50", text: "text-green-700" },
  "Medium": { bg: "bg-yellow-50", text: "text-yellow-700" },
  "High": { bg: "bg-orange-50", text: "text-orange-700" },
  "Low to High": { bg: "bg-purple-100", text: "text-purple-800" },
};

export default function RampModels({ models }: RampModelsProps) {
  const [selectedModel, setSelectedModel] = useState<RampModel | null>(null);

  return (
    <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Ramp Types</h2>
        <p className="text-sm text-slate-400">
          Different methods to convert between fiat and stablecoins
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Model
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Providers
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Best For
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {models.map((model) => {
              const colors = costLevelColors[model.costLevel] || { bg: "bg-slate-700", text: "text-slate-700" };
              return (
                <tr
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className="hover:bg-slate-900 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">
                      {model.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.text}`}>
                        {model.costLevel}
                      </span>
                      <span className="text-sm font-medium text-slate-300 mt-1">
                        {model.costRange}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-400 max-w-xs truncate">
                      {model.description}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {model.providers.slice(0, 3).map((provider) => (
                        <span
                          key={provider}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-slate-700 text-xs text-slate-300"
                        >
                          {provider}
                        </span>
                      ))}
                      {model.providers.length > 3 && (
                        <span className="text-xs text-slate-400">
                          +{model.providers.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-400 max-w-[200px] truncate">
                      {model.bestFor}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-slate-200 bg-slate-900">
        <p className="text-xs text-slate-400 text-center">
          Click a row for detailed information about each ramp type
        </p>
      </div>

      {/* Detail Modal */}
      {selectedModel && (
        <ModelDetailModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  );
}

function ModelDetailModal({
  model,
  onClose,
}: {
  model: RampModel;
  onClose: () => void;
}) {
  const colors = costLevelColors[model.costLevel] || { bg: "bg-slate-700", text: "text-slate-700" };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{model.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                {model.costLevel}
              </span>
              <span className="text-sm text-slate-400">{model.costRange}</span>
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
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-sm text-slate-400">{model.description}</p>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
              How It Works
            </h3>
            <p className="text-sm text-slate-400">{model.howItWorks}</p>
          </div>

          {/* Best For */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
              Best For
            </h3>
            <p className="text-sm text-slate-400">{model.bestFor}</p>
          </div>

          {/* Providers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
              Example Providers
            </h3>
            <div className="flex flex-wrap gap-2">
              {model.providers.map((provider) => (
                <span
                  key={provider}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700 text-sm text-slate-300"
                >
                  {provider}
                </span>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">
                Pros
              </h3>
              <ul className="space-y-1">
                {model.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">
                Cons
              </h3>
              <ul className="space-y-1">
                {model.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
