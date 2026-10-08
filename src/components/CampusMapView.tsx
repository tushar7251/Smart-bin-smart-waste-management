import React, { useState } from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import { CampusMapCanvas } from './CampusMapCanvas';
import { CampusBlock, SmartBin } from '../types/smartbin';
import {
  MapPin,
  Navigation,
  Sparkles,
  Layers,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
} from 'lucide-react';

export const CampusMapView: React.FC = () => {
  const { visibleBins, thresholds, setSelectedBin } = useSmartBin();
  const [selectedBlock, setSelectedBlock] = useState<CampusBlock | 'ALL'>('ALL');
  const [showRouteLine, setShowRouteLine] = useState(false);
  const [searchMapText, setSearchMapText] = useState('');

  const criticalCount = visibleBins.filter(
    (b) => b.isOnline && b.fillLevel >= thresholds.collectionThreshold
  ).length;

  const warningCount = visibleBins.filter(
    (b) => b.isOnline && b.fillLevel >= thresholds.warningThreshold && b.fillLevel < thresholds.collectionThreshold
  ).length;

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Campus Geo-Spatial Map</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time ultrasonic bin markers across Block A, Block B, Block C and Block D
          </p>
        </div>

        {/* Quick filter pills & AI route toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Block Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            {(['ALL', 'Block A', 'Block B', 'Block C', 'Block D'] as const).map((block) => (
              <button
                key={block}
                onClick={() => setSelectedBlock(block)}
                className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                  selectedBlock === block
                    ? 'bg-white shadow-2xs text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {block === 'ALL' ? 'All Blocks' : block}
              </button>
            ))}
          </div>

          {/* AI Route Line Overlay Toggle */}
          <button
            onClick={() => setShowRouteLine(!showRouteLine)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              showRouteLine
                ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>AI Collection Path</span>
          </button>
        </div>
      </div>

      {/* Campus Map Container */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs relative">
        <CampusMapCanvas
          interactive={true}
          selectedBlock={selectedBlock}
          showRouteLine={showRouteLine}
          onBinClick={(bin) => setSelectedBin(bin)}
        />
      </div>

      {/* Helpful Campus Guide Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-950">Green Nodes (Normal)</p>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              Fill &lt; {thresholds.warningThreshold}%. Monitored routinely on scheduled shifts.
            </p>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-950">Amber Nodes (Warning)</p>
            <p className="text-amber-800 text-[11px] mt-0.5">
              {warningCount} bins approaching capacity ({thresholds.warningThreshold}–{thresholds.collectionThreshold - 1}%). Staff pre-notified.
            </p>
          </div>
        </div>

        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5">
          <Flame className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-950">Red Pulsing (Collection)</p>
            <p className="text-rose-800 text-[11px] mt-0.5">
              {criticalCount} bins at critical threshold (≥ {thresholds.collectionThreshold}%). Click any to dispatch or empty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
