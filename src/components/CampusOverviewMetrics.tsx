import React from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import { Trash2, CheckCircle2, AlertCircle, AlertOctagon, WifiOff, ArrowRight } from 'lucide-react';

interface CampusOverviewMetricsProps {
  onFilterSelect?: (status: 'ALL' | 'NORMAL' | 'WARNING' | 'COLLECTION' | 'OFFLINE') => void;
}

export const CampusOverviewMetrics: React.FC<CampusOverviewMetricsProps> = ({ onFilterSelect }) => {
  const { counts, setActiveTab, thresholds } = useSmartBin();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Campus Overview</h3>
            <p className="text-xs text-slate-500">Live IoT fill telemetry across all college blocks</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('bins')}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of the 4 Main Metrics matching the poster */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Bins */}
        <div
          onClick={() => {
            onFilterSelect?.('ALL');
            setActiveTab('bins');
          }}
          className="bg-slate-50 hover:bg-slate-100/80 transition p-4 rounded-xl border border-slate-200/80 cursor-pointer text-center group"
        >
          <div className="flex items-center justify-center mb-1">
            <Trash2 className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xs font-medium text-slate-500">Total Bins</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{counts.total}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Campus-wide</p>
        </div>

        {/* Normal */}
        <div
          onClick={() => {
            onFilterSelect?.('NORMAL');
            setActiveTab('bins');
          }}
          className="bg-emerald-50/70 hover:bg-emerald-100/70 transition p-4 rounded-xl border border-emerald-200/80 cursor-pointer text-center group"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs shadow-emerald-400"></span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xs font-medium text-emerald-900">Normal</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">{counts.normal}</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">0–{thresholds.warningThreshold - 1}% fill</p>
        </div>

        {/* Warning */}
        <div
          onClick={() => {
            onFilterSelect?.('WARNING');
            setActiveTab('bins');
          }}
          className="bg-amber-50/70 hover:bg-amber-100/70 transition p-4 rounded-xl border border-amber-200/80 cursor-pointer text-center group"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs shadow-amber-400"></span>
            <AlertCircle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xs font-medium text-amber-900">Warning</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1">{counts.warning}</p>
          <p className="text-[10px] text-amber-600 mt-0.5">
            {thresholds.warningThreshold}–{thresholds.collectionThreshold - 1}% fill
          </p>
        </div>

        {/* Collection Required */}
        <div
          onClick={() => {
            onFilterSelect?.('COLLECTION');
            setActiveTab('bins');
          }}
          className="bg-rose-50/80 hover:bg-rose-100/80 transition p-4 rounded-xl border border-rose-200/90 cursor-pointer text-center group relative overflow-hidden"
        >
          {counts.collection > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="w-3 h-3 rounded-full bg-rose-600 shadow-xs shadow-rose-400"></span>
            <AlertOctagon className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xs font-medium text-rose-900">Collection</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-700 mt-1">{counts.collection}</p>
          <p className="text-[10px] text-rose-600 mt-0.5">
            {thresholds.collectionThreshold}–100% full
          </p>
        </div>
      </div>

      {/* Offline Alert Strip if any bin is offline */}
      {counts.offline > 0 && (
        <div
          onClick={() => {
            onFilterSelect?.('OFFLINE');
            setActiveTab('bins');
          }}
          className="mt-3 p-2.5 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">{counts.offline} Sensor Node{counts.offline > 1 ? 's' : ''} Offline</span>
            <span className="text-slate-400 hidden sm:inline">• Sensor heartbeat missing &gt;15 min</span>
          </div>
          <span className="text-amber-400 font-medium hover:underline text-[11px]">Inspect →</span>
        </div>
      )}
    </div>
  );
};
