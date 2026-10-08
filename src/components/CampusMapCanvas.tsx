import React, { useState } from 'react';
import { SmartBin, CampusBlock } from '../types/smartbin';
import { useSmartBin } from '../context/SmartBinContext';
import {
  MapPin,
  Trash2,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

interface CampusMapCanvasProps {
  interactive?: boolean;
  selectedBlock?: CampusBlock | 'ALL';
  onBinClick?: (bin: SmartBin) => void;
  showRouteLine?: boolean;
}

export const CampusMapCanvas: React.FC<CampusMapCanvasProps> = ({
  interactive = true,
  selectedBlock = 'ALL',
  onBinClick,
  showRouteLine = false,
}) => {
  const { visibleBins, thresholds, setSelectedBin, setCollectingBin } = useSmartBin();
  const [hoveredBin, setHoveredBin] = useState<SmartBin | null>(null);
  const [activeMarker, setActiveMarker] = useState<SmartBin | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Filter bins if a specific block is active
  const filteredBins = visibleBins.filter((b) => {
    if (selectedBlock !== 'ALL' && b.block !== selectedBlock) return false;
    return true;
  });

  const getMarkerColor = (bin: SmartBin) => {
    if (!bin.isOnline) return { bg: '#475569', border: '#1e293b', text: '#cbd5e1', pulse: false };
    if (bin.fillLevel >= thresholds.collectionThreshold)
      return { bg: '#e11d48', border: '#9f1239', text: '#ffffff', pulse: true };
    if (bin.fillLevel >= thresholds.warningThreshold)
      return { bg: '#f59e0b', border: '#b45309', text: '#ffffff', pulse: false };
    return { bg: '#10b981', border: '#047857', text: '#ffffff', pulse: false };
  };

  const handleMarkerClick = (bin: SmartBin) => {
    setActiveMarker(bin);
    if (onBinClick) {
      onBinClick(bin);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-emerald-950/90 border border-slate-300 shadow-inner select-none">
      {/* Zoom / Map Controls */}
      {interactive && (
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 bg-white/90 backdrop-blur-md rounded-lg p-1 shadow-md border border-slate-200">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.1))}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition cursor-pointer"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-3 border border-slate-700 shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-400"></span>
          <span>Normal (0–{thresholds.warningThreshold - 1}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-400"></span>
          <span>Warning ({thresholds.warningThreshold}–{thresholds.collectionThreshold - 1}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
          <span className="font-semibold text-rose-300">Collection ({thresholds.collectionThreshold}%+)</span>
        </div>
      </div>

      {/* SVG Campus Architectural Map */}
      <div
        className="w-full transition-transform duration-300 origin-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-auto block"
          style={{ maxHeight: '560px', minHeight: '380px' }}
        >
          <defs>
            {/* Campus Lawn Texture */}
            <pattern id="campusGrass" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#d1fae5" />
              <circle cx="5" cy="5" r="1.5" fill="#a7f3d0" />
              <circle cx="15" cy="15" r="1.5" fill="#a7f3d0" />
            </pattern>

            <filter id="shadowBuilding" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="3" dy="5" stdDeviation="4" floodOpacity="0.15" />
            </filter>

            <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <linearGradient id="blockAGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
          </defs>

          {/* Base Campus Terrain / Grass */}
          <rect width="1000" height="650" fill="url(#campusGrass)" />

          {/* Paved Outer Ring Road */}
          <path
            d="M 60,60 H 940 V 590 H 60 Z"
            fill="none"
            stroke="url(#roadGrad)"
            strokeWidth="38"
            strokeLinejoin="round"
          />
          <path
            d="M 60,60 H 940 V 590 H 60 Z"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="12,12"
            strokeLinejoin="round"
          />

          {/* Main Diagonal Pathways connecting blocks to Central Plaza */}
          <path
            d="M 280,200 L 450,290 M 720,200 L 550,290 M 280,450 L 450,360 M 720,450 L 550,360"
            stroke="#e2e8f0"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M 500,60 V 590 M 60,325 H 940"
            stroke="#e2e8f0"
            strokeWidth="30"
            strokeLinecap="round"
          />

          {/* Central Courtyard & Plaza */}
          <circle cx="500" cy="325" r="110" fill="#e2e8f0" filter="url(#shadowBuilding)" />
          <circle cx="500" cy="325" r="85" fill="#a7f3d0" />
          <circle cx="500" cy="325" r="50" fill="#bae6fd" stroke="#38bdf8" strokeWidth="4" />
          <circle cx="500" cy="325" r="18" fill="#0284c7" />

          {/* Campus Decorative Trees */}
          {[
            [120, 180], [380, 110], [420, 200], [580, 200], [620, 110], [880, 180],
            [120, 460], [380, 530], [420, 440], [580, 440], [620, 530], [880, 460],
            [480, 210], [520, 210], [480, 430], [520, 430],
          ].map(([tx, ty], i) => (
            <g key={`tree-${i}`}>
              <circle cx={tx + 2} cy={ty + 3} r="14" fill="#065f46" opacity="0.3" />
              <circle cx={tx} cy={ty} r="13" fill="#10b981" />
              <circle cx={tx - 3} cy={ty - 3} r="7" fill="#34d399" />
            </g>
          ))}

          {/* --- BLOCK A (Academic Block & Canteen) - Top Left --- */}
          <g filter="url(#shadowBuilding)">
            <rect x="110" y="90" width="310" height="170" rx="12" fill="url(#blockAGrad)" stroke="#059669" strokeWidth="3" />
            {/* Inner wings & architectural partitions */}
            <rect x="130" y="110" width="120" height="60" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="270" y="110" width="130" height="60" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="130" y="185" width="270" height="55" rx="6" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.5" />
            {/* Canteen label */}
            <text x="265" y="218" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#b45309">
              ☕ Canteen & Food Plaza
            </text>
            {/* Block A Header Pill matching poster */}
            <rect x="125" y="80" width="110" height="26" rx="6" fill="#064e3b" />
            <text x="180" y="98" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ffffff">
              Block A
            </text>
            <text x="290" y="98" fontSize="11" fontWeight="600" fill="#047857">
              Academic & Central Lobby
            </text>
          </g>

          {/* --- BLOCK B (Science, Tech & Labs) - Top Right --- */}
          <g filter="url(#shadowBuilding)">
            <rect x="580" y="90" width="310" height="170" rx="12" fill="url(#blockAGrad)" stroke="#0284c7" strokeWidth="3" />
            <rect x="600" y="110" width="130" height="60" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="745" y="110" width="125" height="60" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="600" y="185" width="270" height="55" rx="6" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1.5" />
            <text x="735" y="218" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0369a1">
              🔬 Robotics & Computing Labs
            </text>
            {/* Block B Header Pill */}
            <rect x="595" y="80" width="110" height="26" rx="6" fill="#0c4a6e" />
            <text x="650" y="98" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ffffff">
              Block B
            </text>
            <text x="760" y="98" fontSize="11" fontWeight="600" fill="#0284c7">
              Science & Engineering
            </text>
          </g>

          {/* --- BLOCK C (Library & Admin Complex) - Bottom Left --- */}
          <g filter="url(#shadowBuilding)">
            <rect x="110" y="380" width="310" height="180" rx="12" fill="url(#blockAGrad)" stroke="#7c3aed" strokeWidth="3" />
            <rect x="130" y="405" width="130" height="65" rx="6" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="1.5" />
            <rect x="275" y="405" width="125" height="65" rx="6" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="1.5" />
            <rect x="130" y="485" width="270" height="55" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="195" y="442" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6d28d9">
              📚 Central Library
            </text>
            <text x="337" y="442" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6d28d9">
              🏛️ Admin Affairs
            </text>
            <text x="265" y="518" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#475569">
              Student Union & Council Lounge
            </text>
            {/* Block C Header Pill */}
            <rect x="125" y="370" width="110" height="26" rx="6" fill="#4c1d95" />
            <text x="180" y="388" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ffffff">
              Block C
            </text>
            <text x="290" y="388" fontSize="11" fontWeight="600" fill="#7c3aed">
              Library & Administration
            </text>
          </g>

          {/* --- BLOCK D (Sports Arena & Hostels) - Bottom Right --- */}
          <g filter="url(#shadowBuilding)">
            <rect x="580" y="380" width="310" height="180" rx="12" fill="url(#blockAGrad)" stroke="#ea580c" strokeWidth="3" />
            {/* Sports running track visual */}
            <rect x="600" y="405" width="140" height="70" rx="18" fill="#fed7aa" stroke="#fb923c" strokeWidth="2" />
            <rect x="620" y="420" width="100" height="40" rx="10" fill="#22c55e" />
            <text x="670" y="445" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">
              ⚽ Field
            </text>
            <rect x="755" y="405" width="115" height="70" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="812" y="445" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#c2410c">
              🏢 Hostels & Mess
            </text>
            <rect x="600" y="490" width="270" height="50" rx="6" fill="#ffedd5" stroke="#fed7aa" strokeWidth="1.5" />
            <text x="735" y="520" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#9a3412">
              Auditorium & Indoor Badminton Hall
            </text>
            {/* Block D Header Pill */}
            <rect x="595" y="370" width="110" height="26" rx="6" fill="#7c2d12" />
            <text x="650" y="388" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ffffff">
              Block D
            </text>
            <text x="760" y="388" fontSize="11" fontWeight="600" fill="#ea580c">
              Sports, Hostels & Dining
            </text>
          </g>

          {/* Optional Collection Route Optimization Path connecting warning/critical bins */}
          {showRouteLine && (
            <path
              d="M 500,325 L 240,221 L 280,169 L 680,169 L 780,143 L 720,481 L 500,325"
              fill="none"
              stroke="#e11d48"
              strokeWidth="4"
              strokeDasharray="8,6"
              className="animate-pulse"
            />
          )}

          {/* --- BIN MARKERS ON MAP --- */}
          {filteredBins.map((bin) => {
            // Convert percentage coordinate to SVG coordinate
            const cx = (bin.mapX / 100) * 1000;
            const cy = (bin.mapY / 100) * 650;
            const style = getMarkerColor(bin);
            const isCritical = bin.isOnline && bin.fillLevel >= thresholds.collectionThreshold;
            const isSelected = activeMarker?.id === bin.id;

            return (
              <g
                key={bin.id}
                onClick={() => handleMarkerClick(bin)}
                onMouseEnter={() => setHoveredBin(bin)}
                onMouseLeave={() => setHoveredBin(null)}
                className="cursor-pointer transition-transform duration-150"
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                {/* Pulse ring for critical bins */}
                {isCritical && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="24"
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="2.5"
                    opacity="0.75"
                    className="animate-ping"
                  />
                )}

                {/* Outer shadow base */}
                <circle cx={cx} cy={cy + 3} r="14" fill="#0f172a" opacity="0.3" />

                {/* Marker circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 16 : 13}
                  fill={style.bg}
                  stroke={isSelected ? '#ffffff' : style.border}
                  strokeWidth={isSelected ? 3.5 : 2}
                  className="transition-all hover:scale-125"
                />

                {/* Bin icon inside marker */}
                <path
                  d={`M ${cx - 5} ${cy - 5} h 10 v 10 h -10 z`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {/* Bin ID Label Tag matching design poster (🟢 BIN-001 / 🔴 BIN-024) */}
                <g transform={`translate(${cx}, ${cy - 18})`}>
                  <rect
                    x="-28"
                    y="-14"
                    width="56"
                    height="16"
                    rx="4"
                    fill={isCritical ? '#9f1239' : '#0f172a'}
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x="0"
                    y="-2"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill="#ffffff"
                  >
                    {bin.id}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Marker Quick Details Modal when a bin is clicked */}
      {activeMarker && (
        <div className="absolute top-4 left-4 z-30 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  !activeMarker.isOnline
                    ? 'bg-slate-500'
                    : activeMarker.fillLevel >= thresholds.collectionThreshold
                    ? 'bg-rose-600 animate-pulse'
                    : activeMarker.fillLevel >= thresholds.warningThreshold
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <h4 className="font-extrabold text-base text-slate-900">{activeMarker.id}</h4>
            </div>
            <button
              onClick={() => setActiveMarker(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-slate-800">
                {activeMarker.block} → {activeMarker.location}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Fill Level:</span>
              <span
                className={`font-extrabold ${
                  activeMarker.fillLevel >= thresholds.collectionThreshold
                    ? 'text-rose-600 text-sm'
                    : activeMarker.fillLevel >= thresholds.warningThreshold
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {activeMarker.isOnline ? `${activeMarker.fillLevel}%` : 'Offline'}
              </span>
            </div>

            {/* Fill Level Meter Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  activeMarker.fillLevel >= thresholds.collectionThreshold
                    ? 'bg-rose-600'
                    : activeMarker.fillLevel >= thresholds.warningThreshold
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${activeMarker.fillLevel}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Status:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  !activeMarker.isOnline
                    ? 'bg-slate-200 text-slate-700'
                    : activeMarker.fillLevel >= thresholds.collectionThreshold
                    ? 'bg-rose-100 text-rose-800'
                    : activeMarker.fillLevel >= thresholds.warningThreshold
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {!activeMarker.isOnline
                  ? 'Sensor Offline'
                  : activeMarker.fillLevel >= thresholds.collectionThreshold
                  ? 'Collection Required'
                  : activeMarker.fillLevel >= thresholds.warningThreshold
                  ? 'Warning'
                  : 'Normal'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last Updated:</span>
              <span className="text-slate-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {activeMarker.lastUpdated}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Assigned Staff:</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <User className="w-3 h-3 text-emerald-600" />
                {activeMarker.assignedStaffName}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedBin(activeMarker);
                setActiveMarker(null);
              }}
              className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition text-center cursor-pointer"
            >
              View Details
            </button>
            <button
              onClick={() => {
                setCollectingBin(activeMarker);
                setActiveMarker(null);
              }}
              className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition text-center shadow-xs cursor-pointer"
            >
              Collect Now
            </button>
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {hoveredBin && !activeMarker && (
        <div
          className="absolute z-30 pointer-events-none bg-slate-900/95 text-white px-2.5 py-1.5 rounded-lg text-xs shadow-xl border border-slate-700 transition"
          style={{
            left: `${Math.min(80, hoveredBin.mapX)}%`,
            top: `${Math.max(10, hoveredBin.mapY - 8)}%`,
          }}
        >
          <div className="font-bold flex items-center gap-1.5">
            <span>{hoveredBin.id}</span>
            <span className="text-slate-400">({hoveredBin.location})</span>
          </div>
          <div className="text-[11px] text-emerald-300">
            Fill: {hoveredBin.fillLevel}% • {hoveredBin.assignedStaffName}
          </div>
        </div>
      )}
    </div>
  );
};
