import React, { useState } from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import { SmartBin, CampusBlock, BinType } from '../types/smartbin';
import {
  Search,
  Filter,
  Trash2,
  CheckCircle,
  AlertCircle,
  AlertOctagon,
  WifiOff,
  LayoutGrid,
  Table as TableIcon,
  User,
  Clock,
  Sparkles,
  ArrowUpDown,
  Zap,
} from 'lucide-react';

interface AllBinsViewProps {
  initialStatusFilter?: 'ALL' | 'NORMAL' | 'WARNING' | 'COLLECTION' | 'OFFLINE';
}

export const AllBinsView: React.FC<AllBinsViewProps> = ({ initialStatusFilter = 'ALL' }) => {
  const {
    visibleBins,
    thresholds,
    setSelectedBin,
    setCollectingBin,
    updateBinFill,
    toggleBinOnline,
    currentUser,
  } = useSmartBin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NORMAL' | 'WARNING' | 'COLLECTION' | 'OFFLINE'>(
    initialStatusFilter
  );
  const [blockFilter, setBlockFilter] = useState<CampusBlock | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<BinType | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'fill-desc' | 'fill-asc' | 'id' | 'block'>('fill-desc');

  const getBinStatus = (bin: SmartBin) => {
    if (!bin.isOnline) return 'OFFLINE';
    if (bin.fillLevel >= thresholds.collectionThreshold) return 'COLLECTION';
    if (bin.fillLevel >= thresholds.warningThreshold) return 'WARNING';
    return 'NORMAL';
  };

  const filteredBins = visibleBins
    .filter((bin) => {
      // Status filter
      const status = getBinStatus(bin);
      if (statusFilter !== 'ALL' && status !== statusFilter) return false;

      // Block filter
      if (blockFilter !== 'ALL' && bin.block !== blockFilter) return false;

      // Waste Type filter
      if (typeFilter !== 'ALL' && bin.binType !== typeFilter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchId = bin.id.toLowerCase().includes(q);
        const matchLoc = bin.location.toLowerCase().includes(q);
        const matchStaff = bin.assignedStaffName.toLowerCase().includes(q);
        const matchType = bin.binType.toLowerCase().includes(q);
        return matchId || matchLoc || matchStaff || matchType;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'fill-desc') return b.fillLevel - a.fillLevel;
      if (sortBy === 'fill-asc') return a.fillLevel - b.fillLevel;
      if (sortBy === 'id') return a.id.localeCompare(b.id);
      if (sortBy === 'block') return a.block.localeCompare(b.block);
      return 0;
    });

  return (
    <div className="space-y-5">
      {/* Search & Filter Controls Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>All Campus Bins</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredBins.length} of {visibleBins.length} visible
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {currentUser.role === 'ADMIN'
                ? 'Complete inventory of all 50 IoT waste nodes across college grounds'
                : `Showing bins assigned to your territory: ${currentUser.assignedBlock}`}
            </p>
          </div>

          {/* View toggle (Grid / Table) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded flex items-center gap-1 transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs font-semibold text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid Cards"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden md:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded flex items-center gap-1 transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white shadow-2xs font-semibold text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
                <span className="hidden md:inline">Table</span>
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-2 font-medium focus:outline-emerald-500 cursor-pointer"
            >
              <option value="fill-desc">Sort: Highest Fill First</option>
              <option value="fill-asc">Sort: Lowest Fill First</option>
              <option value="id">Sort: Bin ID (A–Z)</option>
              <option value="block">Sort: By Block</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Bin ID (e.g. BIN-024), Location (Canteen), Staff (Rahul), or Type..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-emerald-500 focus:border-emerald-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Tabs matching the brief */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Status:</span>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({visibleBins.length})
          </button>

          <button
            onClick={() => setStatusFilter('NORMAL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              statusFilter === 'NORMAL'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Normal (0–{thresholds.warningThreshold - 1}%)
          </button>

          <button
            onClick={() => setStatusFilter('WARNING')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              statusFilter === 'WARNING'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Warning ({thresholds.warningThreshold}–{thresholds.collectionThreshold - 1}%)
          </button>

          <button
            onClick={() => setStatusFilter('COLLECTION')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              statusFilter === 'COLLECTION'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            Collection Required ({thresholds.collectionThreshold}%+)
          </button>

          <button
            onClick={() => setStatusFilter('OFFLINE')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              statusFilter === 'OFFLINE'
                ? 'bg-slate-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <WifiOff className="w-3 h-3 text-slate-400" />
            Offline
          </button>
        </div>

        {/* Secondary Block Filters (only for Admin or Multi-block floater) */}
        {currentUser.role === 'ADMIN' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Block:</span>
            {(['ALL', 'Block A', 'Block B', 'Block C', 'Block D'] as const).map((block) => (
              <button
                key={block}
                onClick={() => setBlockFilter(block)}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                  blockFilter === block
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {block === 'ALL' ? 'All Blocks' : block}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid or Table Results View */}
      {filteredBins.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Trash2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Bins Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try relaxing your search query or status filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setBlockFilter('ALL');
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBins.map((bin) => {
            const status = getBinStatus(bin);
            const isCritical = status === 'COLLECTION';
            const isWarning = status === 'WARNING';
            const isOffline = status === 'OFFLINE';

            return (
              <div
                key={bin.id}
                onClick={() => setSelectedBin(bin)}
                className={`bg-white rounded-xl p-4 border transition hover:shadow-md cursor-pointer flex flex-col justify-between group ${
                  isCritical
                    ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400'
                    : isWarning
                    ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                    : isOffline
                    ? 'border-slate-300 bg-slate-50/40'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  {/* Card Header: Bin ID, Block, Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
                          isCritical
                            ? 'bg-rose-500 text-white'
                            : isWarning
                            ? 'bg-amber-500 text-white'
                            : isOffline
                            ? 'bg-slate-600 text-slate-200'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                          {bin.id}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-500">{bin.block}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800'
                          : isOffline
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />}
                      {status === 'COLLECTION'
                        ? 'COLLECTION'
                        : status === 'WARNING'
                        ? 'WARNING'
                        : status === 'OFFLINE'
                        ? 'OFFLINE'
                        : 'NORMAL'}
                    </span>
                  </div>

                  {/* Location & Floor */}
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-800">{bin.location}</p>
                    <p className="text-[11px] text-slate-400">
                      {bin.floor} • {bin.binType}
                    </p>
                  </div>

                  {/* Fill Level Meter & Sensor Distance */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Current Fill:</span>
                      <span
                        className={
                          isCritical
                            ? 'text-rose-600 font-extrabold text-sm'
                            : isWarning
                            ? 'text-amber-600 font-bold'
                            : isOffline
                            ? 'text-slate-400'
                            : 'text-emerald-600 font-bold'
                        }
                      >
                        {bin.isOnline ? `${bin.fillLevel}%` : 'Offline'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCritical
                            ? 'bg-rose-600'
                            : isWarning
                            ? 'bg-amber-500'
                            : isOffline
                            ? 'bg-slate-400'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Sensor Dist: {bin.sensorDistanceCm} cm</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {bin.lastUpdated}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: Assigned Staff & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 min-w-0">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] font-medium truncate">{bin.assignedStaffName}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCollectingBin(bin);
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition shadow-2xs cursor-pointer"
                    >
                      Empty
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add 10% fill simulation
                        updateBinFill(bin.id, (bin.fillLevel + 15) % 105);
                      }}
                      title="Simulate +15% trash drop"
                      className="p-1 hover:bg-slate-100 text-slate-500 hover:text-emerald-700 rounded transition cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW matching section 10 */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Bin ID</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Block / Floor</th>
                  <th className="py-3 px-4">Waste Type</th>
                  <th className="py-3 px-4">Fill Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBins.map((bin) => {
                  const status = getBinStatus(bin);
                  const isCritical = status === 'COLLECTION';
                  const isWarning = status === 'WARNING';
                  const isOffline = status === 'OFFLINE';

                  return (
                    <tr
                      key={bin.id}
                      onClick={() => setSelectedBin(bin)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        {bin.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {bin.location}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-medium">{bin.block}</span>
                        <span className="text-slate-400"> • {bin.floor}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {bin.binType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full ${
                                isCritical ? 'bg-rose-600' : isWarning ? 'bg-amber-500' : isOffline ? 'bg-slate-400' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${bin.fillLevel}%` }}
                            />
                          </div>
                          <span
                            className={`font-bold ${
                              isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : isOffline ? 'text-slate-400' : 'text-emerald-700'
                            }`}
                          >
                            {bin.isOnline ? `${bin.fillLevel}%` : 'Off'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isCritical
                              ? 'bg-rose-100 text-rose-800'
                              : isWarning
                              ? 'bg-amber-100 text-amber-800'
                              : isOffline
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {status === 'COLLECTION'
                            ? '🔴 Collection'
                            : status === 'WARNING'
                            ? '🟡 Warning'
                            : status === 'OFFLINE'
                            ? '⚫ Offline'
                            : '🟢 Normal'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {bin.assignedStaffName}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedBin(bin)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => setCollectingBin(bin)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] cursor-pointer"
                          >
                            Empty
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
