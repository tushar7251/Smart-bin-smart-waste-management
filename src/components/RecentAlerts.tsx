import React from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import { Bell, Trash2, ChevronRight, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface RecentAlertsProps {
  onViewAll?: () => void;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({ onViewAll }) => {
  const { visibleBins, thresholds, setSelectedBin, setActiveTab, setCollectingBin } = useSmartBin();

  // Bins requiring attention (Warning or Collection), sorted by highest fill level
  const alertBins = visibleBins
    .filter((b) => !b.isOnline || b.fillLevel >= thresholds.warningThreshold)
    .sort((a, b) => b.fillLevel - a.fillLevel)
    .slice(0, 6);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Alerts</h3>
            <p className="text-xs text-slate-500">Live priority bins requiring clearance or monitoring</p>
          </div>
        </div>

        <button
          onClick={() => {
            onViewAll?.();
            setActiveTab('bins');
          }}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {alertBins.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
          <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-semibold text-slate-800">All Campus Bins Healthy</p>
          <p className="text-xs text-slate-500 mt-0.5">No overflow alerts detected in this zone.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {alertBins.map((bin) => {
            const isCritical = bin.isOnline && bin.fillLevel >= thresholds.collectionThreshold;
            const isWarning = bin.isOnline && bin.fillLevel >= thresholds.warningThreshold;

            return (
              <div
                key={bin.id}
                onClick={() => setSelectedBin(bin)}
                className="py-3 px-3 -mx-3 hover:bg-slate-50 rounded-xl transition flex items-center justify-between gap-3 cursor-pointer group"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105 ${
                      !bin.isOnline
                        ? 'bg-slate-700 text-slate-200'
                        : isCritical
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{bin.id}</h4>
                      {isCritical && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {bin.block} • {bin.location}
                    </p>
                  </div>
                </div>

                {/* Right: Fill percentage badge & arrow */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-sm sm:text-base font-extrabold ${
                        !bin.isOnline
                          ? 'text-slate-500'
                          : isCritical
                          ? 'text-rose-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {bin.isOnline ? `${bin.fillLevel}%` : 'Offline'}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {bin.isOnline ? (isCritical ? 'Collection Req.' : 'Prepare') : 'No Signal'}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCollectingBin(bin);
                    }}
                    title="Quick empty"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
