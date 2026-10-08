import React, { useState } from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Award,
  PieChart,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ReportsAndAnalyticsView: React.FC = () => {
  const { bins, collections, thresholds, setSelectedBin } = useSmartBin();
  const [historyFilterStaff, setHistoryFilterStaff] = useState<string>('ALL');

  // Compute stats dynamically
  const totalBins = bins.length;
  const avgFill = Math.round(
    bins.reduce((acc, b) => acc + (b.isOnline ? b.fillLevel : 0), 0) / Math.max(1, bins.filter((b) => b.isOnline).length)
  );
  const collectionsToday = collections.length;
  const collectionsThisWeek = 46 + collectionsToday;
  const overflowEventsAvoided = 14 + collections.filter((c) => c.previousFillLevel >= 90).length;

  // Waste type distribution
  const wasteCounts: Record<string, number> = {};
  bins.forEach((b) => {
    wasteCounts[b.binType] = (wasteCounts[b.binType] || 0) + 1;
  });

  // Top 5 most filled bins right now
  const topFilledBins = [...bins].sort((a, b) => b.fillLevel - a.fillLevel).slice(0, 5);

  // Filter collections
  const filteredCollections = collections.filter((c) => {
    if (historyFilterStaff !== 'ALL' && c.staffName !== historyFilterStaff) return false;
    return true;
  });

  // Export collection history to CSV
  const handleExportCSV = () => {
    const headers = ['Collection ID', 'Bin ID', 'Location', 'Block', 'Collected By', 'Previous Fill %', 'Date', 'Time', 'Remarks'];
    const rows = filteredCollections.map((c) => [
      c.id,
      c.binId,
      `"${c.binLocation}"`,
      c.block,
      `"${c.staffName}"`,
      `${c.previousFillLevel}%`,
      c.date,
      c.collectionTime,
      `"${c.remarks || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartbin_collection_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Campus Waste Reports & Analytics</h2>
              <p className="text-xs text-slate-500">
                Institutional sanitation intelligence, audit logs, and segregation metrics
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Collection Audit (CSV)</span>
        </button>
      </div>

      {/* Basic statistics cards matching Section 17 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <p className="text-xs font-medium text-slate-500">Total Bins</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalBins}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Campus Network</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <p className="text-xs font-medium text-slate-500">Average Fill</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{avgFill}%</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Across All Blocks</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <p className="text-xs font-medium text-slate-500">Collections Today</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{collectionsToday}</p>
          <p className="text-[10px] text-blue-600 mt-0.5">Verified Pickups</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <p className="text-xs font-medium text-slate-500">Collections This Week</p>
          <p className="text-2xl font-black text-purple-700 mt-1">{collectionsThisWeek}</p>
          <p className="text-[10px] text-purple-600 mt-0.5">Target: 50+</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center col-span-2 sm:col-span-1">
          <p className="text-xs font-medium text-slate-500">Overflows Avoided</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{overflowEventsAvoided}</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Zero Overflow Goal</p>
        </div>
      </div>

      {/* Middle Row: Waste Category Breakdown & Most Frequently Filled Bins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waste Composition Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>Waste Segregation by Stream</span>
            </h3>
            <span className="text-xs text-slate-400">Total: {totalBins} Bins</span>
          </div>

          <div className="space-y-3">
            {Object.entries(wasteCounts).map(([type, count]) => {
              const pct = Math.round((count / totalBins) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{type}</span>
                    <span className="text-slate-500">
                      {count} bins ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        type.includes('Organic')
                          ? 'bg-amber-500'
                          : type.includes('Recyclable')
                          ? 'bg-emerald-500'
                          : type.includes('Paper')
                          ? 'bg-blue-500'
                          : type.includes('E-Waste')
                          ? 'bg-purple-500'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Filled Bins Ranking (Section 17) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-600" />
              <span>Most Frequently Filled Bins (Live Priority)</span>
            </h3>
            <span className="text-xs text-slate-400">Highest fill %</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topFilledBins.map((bin, index) => (
              <div
                key={bin.id}
                onClick={() => setSelectedBin(bin)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <strong className="text-xs text-slate-900">{bin.id}</strong>
                    <p className="text-[11px] text-slate-500">
                      {bin.block} • {bin.location}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-black ${
                      bin.fillLevel >= thresholds.collectionThreshold
                        ? 'text-rose-600'
                        : bin.fillLevel >= thresholds.warningThreshold
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    {bin.fillLevel}%
                  </span>
                  <p className="text-[10px] text-slate-400">{bin.assignedStaffName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collection History Audit Trail (Section 16) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Collection History Audit Trail (Section 16)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Verified records with timestamp, collector identity, and previous fill level
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">Filter Collector:</label>
            <select
              value={historyFilterStaff}
              onChange={(e) => setHistoryFilterStaff(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium"
            >
              <option value="ALL">All Custodial Staff</option>
              <option value="Rahul Sharma">Rahul Sharma</option>
              <option value="Amit Kumar">Amit Kumar</option>
              <option value="Priya Patel">Priya Patel</option>
              <option value="Sunita Devi">Sunita Devi</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Bin ID</th>
                <th className="py-3 px-4">Campus Location</th>
                <th className="py-3 px-4">Previous Fill</th>
                <th className="py-3 px-4">Collected By</th>
                <th className="py-3 px-4">Time & Date</th>
                <th className="py-3 px-4">Housekeeping Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCollections.map((col) => (
                <tr key={col.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-500">{col.id}</td>
                  <td className="py-3 px-4 font-black text-slate-900">{col.binId}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{col.binLocation}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                      {col.previousFillLevel}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">{col.staffName}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{col.collectionTime}</div>
                    <div className="text-[10px] text-slate-400">{col.date}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{col.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
