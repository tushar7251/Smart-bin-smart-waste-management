import React from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import { X, Sliders, CheckCircle2, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, thresholds, updateThresholds } = useSmartBin();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Configurable Bin Thresholds</h3>
              <p className="text-xs text-slate-400">Section 5 • Dynamic Alert Threshold System</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Configure the trigger limits for campus waste monitoring. Threshold adjustments immediately re-evaluate status and counts dynamically across all 50 bins.
          </p>

          {/* Warning Threshold Slider */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between font-bold text-amber-950">
              <span>🟡 Warning Threshold:</span>
              <span className="text-base text-amber-700">{thresholds.warningThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="85"
              step="1"
              value={thresholds.warningThreshold}
              onChange={(e) => updateThresholds({ warningThreshold: Number(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-amber-800">
              <span>50%</span>
              <span>Default: 70%</span>
              <span>85%</span>
            </div>
            <p className="text-[11px] text-amber-800 pt-1">
              Bins reaching this fill level trigger a warning alert and pre-notification for staff.
            </p>
          </div>

          {/* Collection Threshold Slider */}
          <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between font-bold text-rose-950">
              <span>🔴 Collection Required Threshold:</span>
              <span className="text-base text-rose-700">{thresholds.collectionThreshold}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="98"
              step="1"
              value={thresholds.collectionThreshold}
              onChange={(e) => updateThresholds({ collectionThreshold: Number(e.target.value) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-rose-800">
              <span>80%</span>
              <span>Default: 90%</span>
              <span>98%</span>
            </div>
            <p className="text-[11px] text-rose-800 pt-1">
              Bins at or above this fill level trigger critical collection alerts & dispatch priority.
            </p>
          </div>

          {/* Sensor Offline Timeout */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>⚫ Sensor Heartbeat Offline Timeout:</span>
              <span className="text-base text-slate-700">{thresholds.offlineTimeoutMinutes} mins</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={thresholds.offlineTimeoutMinutes}
              onChange={(e) => updateThresholds({ offlineTimeoutMinutes: Number(e.target.value) })}
              className="w-full accent-slate-700 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Flags sensor node as offline if no ultrasonic telemetry is received within this duration.
            </p>
          </div>

          <button
            onClick={() => updateThresholds({ warningThreshold: 70, collectionThreshold: 90, offlineTimeoutMinutes: 15 })}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-center cursor-pointer transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Defaults (70% / 90%)</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
