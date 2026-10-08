import React from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import { CampusMapCanvas } from './CampusMapCanvas';
import { MapPin, ChevronRight, Eye } from 'lucide-react';

export const CampusMapPreview: React.FC = () => {
  const { setActiveTab } = useSmartBin();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Campus Map</h3>
            <p className="text-xs text-slate-500">Live locations across Blocks A, B, C & D</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('map')}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>Full Interactive Map</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-200">
        <CampusMapCanvas interactive={true} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-emerald-600" />
          Click any pin on the map to view instant fill telemetry or dispatch staff
        </span>
        <button
          onClick={() => setActiveTab('map')}
          className="text-emerald-700 font-semibold hover:underline hidden sm:inline cursor-pointer"
        >
          Open Map View →
        </button>
      </div>
    </div>
  );
};
