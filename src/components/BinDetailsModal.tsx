import React, { useState } from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import { calculateFillPrediction } from '../services/aiService';
import {
  X,
  Trash2,
  Clock,
  User,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Wifi,
  WifiOff,
  Battery,
} from 'lucide-react';

export const BinDetailsModal: React.FC = () => {
  const {
    selectedBin,
    setSelectedBin,
    thresholds,
    setCollectingBin,
    updateBinFill,
    toggleBinOnline,
    collections,
  } = useSmartBin();

  const [testDistance, setTestDistance] = useState<number>(selectedBin?.sensorDistanceCm ?? 6);

  if (!selectedBin) return null;

  const prediction = calculateFillPrediction(selectedBin);

  const isCritical = selectedBin.isOnline && selectedBin.fillLevel >= thresholds.collectionThreshold;
  const isWarning = selectedBin.isOnline && selectedBin.fillLevel >= thresholds.warningThreshold && !isCritical;
  const isOffline = !selectedBin.isOnline;

  // Filter collections for this bin
  const binCollections = collections.filter((c) => c.binId === selectedBin.id);

  const handleSliderChange = (distance: number) => {
    setTestDistance(distance);
    // Formula: Fill % = ((Max - Current) / Max) * 100
    const calculatedFill = Math.max(0, Math.min(100, Math.round(((100 - distance) / 100) * 100)));
    updateBinFill(selectedBin.id, calculatedFill);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                isCritical
                  ? 'bg-rose-600'
                  : isWarning
                  ? 'bg-amber-500'
                  : isOffline
                  ? 'bg-slate-600'
                  : 'bg-emerald-600'
              }`}
            >
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold tracking-tight">{selectedBin.id}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isCritical
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : isWarning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : isOffline
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isOffline
                    ? 'SENSOR OFFLINE'
                    : isCritical
                    ? 'COLLECTION REQUIRED'
                    : isWarning
                    ? 'WARNING'
                    : 'NORMAL'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {selectedBin.block} • {selectedBin.location}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedBin(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Status & Gauge Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Fill Level Big Gauge */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-slate-500">Current Fill</span>
              <div className="relative my-2 w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={
                      isCritical
                        ? '#e11d48'
                        : isWarning
                        ? '#f59e0b'
                        : isOffline
                        ? '#64748b'
                        : '#10b981'
                    }
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (isOffline ? 0 : selectedBin.fillLevel) / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-2xl font-extrabold ${
                      isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-900'
                    }`}
                  >
                    {isOffline ? '--' : `${selectedBin.fillLevel}%`}
                  </span>
                  <span className="text-[10px] text-slate-400">Capacity</span>
                </div>
              </div>

              <span
                className={`text-xs font-bold ${
                  isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-700'
                }`}
              >
                {isOffline
                  ? 'No Telemetry'
                  : isCritical
                  ? 'Collection Required'
                  : isWarning
                  ? 'Warning'
                  : 'Normal Level'}
              </span>
            </div>

            {/* Metadata Card */}
            <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Bin ID</span>
                <span className="font-bold text-slate-800">{selectedBin.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Location</span>
                <span className="font-bold text-slate-800">{selectedBin.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Block & Floor</span>
                <span className="font-semibold text-slate-700">
                  {selectedBin.block} ({selectedBin.floor})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Assigned Staff</span>
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {selectedBin.assignedStaffName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Bin Type</span>
                <span className="font-semibold text-slate-700">{selectedBin.binType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Last Updated</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {selectedBin.lastUpdated}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Usable Height</span>
                <span className="font-semibold text-slate-700">{selectedBin.maxDistanceCm} cm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Sensor Distance</span>
                <span className="font-bold text-emerald-700">{selectedBin.sensorDistanceCm} cm to waste</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Installation Date</span>
                <span className="text-slate-600">{selectedBin.installDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Sensor Node Health</span>
                <span className="text-slate-700 flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedBin.batteryLevel}% Battery
                </span>
              </div>
            </div>
          </div>

          {/* Section 11: Fill Level History Graph (8AM, 10AM, 12PM, 2PM, 4PM) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Fill Level History Trend</span>
              </h4>
              <span className="text-xs text-slate-400">Intraday readings</span>
            </div>

            {/* Custom SVG Line & Points Chart */}
            <div className="relative pt-4 pb-2">
              <div className="h-44 w-full relative">
                <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="55" x2="480" y2="55" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="125" x2="480" y2="125" stroke="#cbd5e1" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="32" y="24" fontSize="10" fill="#94a3b8" textAnchor="end">100%</text>
                  <text x="32" y="59" fontSize="10" fill="#94a3b8" textAnchor="end">70%</text>
                  <text x="32" y="94" fontSize="10" fill="#94a3b8" textAnchor="end">35%</text>
                  <text x="32" y="128" fontSize="10" fill="#94a3b8" textAnchor="end">0%</text>

                  {/* Threshold warning line (70%) */}
                  <line x1="40" y1="55" x2="480" y2="55" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" />

                  {/* Threshold collection line (90%) */}
                  <line x1="40" y1="30" x2="480" y2="30" stroke="#e11d48" strokeWidth="1" strokeDasharray="4,4" />

                  {/* Polyline curve connecting history points */}
                  {selectedBin.history.length > 1 && (
                    <>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      <polygon
                        points={`
                          ${selectedBin.history
                            .map((h, i) => {
                              const x = 50 + (i / (selectedBin.history.length - 1)) * 420;
                              const y = 125 - (h.fill / 100) * 105;
                              return `${x},${y}`;
                            })
                            .join(' ')}
                          470,125 50,125
                        `}
                        fill="url(#areaGradient)"
                      />

                      <polyline
                        points={selectedBin.history
                          .map((h, i) => {
                            const x = 50 + (i / (selectedBin.history.length - 1)) * 420;
                            const y = 125 - (h.fill / 100) * 105;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}

                  {/* Dots & Labels */}
                  {selectedBin.history.map((h, i) => {
                    const x = 50 + (i / Math.max(1, selectedBin.history.length - 1)) * 420;
                    const y = 125 - (h.fill / 100) * 105;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="5" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                        <text
                          x={x}
                          y={y - 9}
                          fontSize="10"
                          fontWeight="bold"
                          fill="#0f172a"
                          textAnchor="middle"
                        >
                          {h.fill}%
                        </text>
                        <text
                          x={x}
                          y="138"
                          fontSize="9.5"
                          fill="#64748b"
                          textAnchor="middle"
                        >
                          {h.time}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Section 22: Ultrasonic Formula & Interactive Sensor Simulator */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  HC-SR04 Ultrasonic Telemetry Calculation
                </h4>
              </div>
              <button
                onClick={() => toggleBinOnline(selectedBin.id)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                {selectedBin.isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-rose-400" />}
                <span>{selectedBin.isOnline ? 'Online (Heartbeat OK)' : 'Offline (Simulate Reconnect)'}</span>
              </button>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 font-mono text-xs text-emerald-200">
              <p className="text-[11px] text-slate-400 mb-1 font-sans">Formula implemented:</p>
              <code>
                Fill % = ((Max_Distance - Current_Distance) / (Max_Distance - Min_Distance)) × 100
              </code>
              <p className="mt-1 text-slate-400 text-[11px] font-sans">
                = ((100cm - {selectedBin.sensorDistanceCm}cm) / 100cm) × 100 ={' '}
                <strong className="text-white">{selectedBin.fillLevel}%</strong>
              </p>
            </div>

            {/* Interactive distance slider */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Test Ultrasonic Sensor Distance:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {selectedBin.sensorDistanceCm} cm (Top sensor to waste surface)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedBin.sensorDistanceCm}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0 cm (Bin completely full 100%)</span>
                <span>50 cm (50%)</span>
                <span>100 cm (Bin empty 0%)</span>
              </div>
            </div>
          </div>

          {/* AI Prediction module for this bin (Section 19) */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-emerald-950">AI Predictive Accumulation</h4>
            </div>
            <p className="text-slate-700">{prediction.recommendation}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-slate-600">
              <span>
                Rate: <strong className="text-emerald-800">+{prediction.hourlyFillRate}% / hr</strong>
              </span>
              <span>
                Expected 90% Full:{' '}
                <strong className="text-emerald-800">{prediction.expectedFullTime}</strong>
              </span>
            </div>
          </div>

          {/* Collection History for this bin (Section 16) */}
          {binCollections.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Collection Audits ({binCollections.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {binCollections.map((col) => (
                  <div key={col.id} className="p-3 bg-white flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">
                        Cleared from {col.previousFillLevel}% by {col.staffName}
                      </p>
                      <p className="text-[11px] text-slate-400">{col.remarks}</p>
                    </div>
                    <div className="text-right text-slate-500">
                      <p className="font-medium text-slate-700">{col.collectionTime}</p>
                      <p className="text-[10px] text-slate-400">{col.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              // Quick drop to 0%
              updateBinFill(selectedBin.id, 0);
            }}
            className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            Quick Reset to 0%
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedBin(null)}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                const b = selectedBin;
                setSelectedBin(null);
                setCollectingBin(b);
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Start Collection Workflow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
