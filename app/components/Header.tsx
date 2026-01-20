"use client";

interface HeaderProps {
  lastUpdated: string;
}

export default function Header({ lastUpdated }: HeaderProps) {
  return (
    <header className="bg-slate-900 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Stablecoin Ramping Costs
            </h1>
            <p className="mt-1 text-slate-400 text-sm sm:text-base">
              Global on-ramp and off-ramp cost tracker
            </p>
          </div>
          <div className="text-sm text-slate-400">
            <span>Last updated: </span>
            <span className="text-slate-300">{lastUpdated}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
