import React, { useState } from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import {
  X,
  CheckCircle2,
  Trash2,
  User,
  MapPin,
  Clock,
  Sparkles,
  AlertOctagon,
  FileText,
} from 'lucide-react';

export const CollectionModal: React.FC = () => {
  const { collectingBin, setCollectingBin, collectBin, currentUser } = useSmartBin();
  const [remarks, setRemarks] = useState('');
  const [step, setStep] = useState<'confirm' | 'progress'>('confirm');

  if (!collectingBin) return null;

  const collectorName =
    currentUser.role === 'STAFF' ? currentUser.name : collectingBin.assignedStaffName;

  const handleComplete = () => {
    setStep('progress');
    setTimeout(() => {
      collectBin(collectingBin.id, remarks || `Cleared by ${collectorName}. Heavy waste removed & liner refreshed.`);
      setCollectingBin(null);
      setStep('confirm');
      setRemarks('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center shadow-xs">
              <Trash2 className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Collection Dispatch Workflow</h3>
              <p className="text-xs text-emerald-300">Section 15 • Verified Campus Sanitation Trail</p>
            </div>
          </div>
          <button
            onClick={() => setCollectingBin(null)}
            className="p-1 text-emerald-300 hover:text-white rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Details */}
        <div className="p-6 space-y-4">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Target Node</span>
                <h4 className="text-xl font-black text-emerald-950 mt-0.5">{collectingBin.id}</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {collectingBin.block} • {collectingBin.location}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Previous Fill</span>
                <p className="text-2xl font-black text-rose-600 mt-0.5">{collectingBin.fillLevel}%</p>
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  Critical
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                Staff Assigned:
              </span>
              <strong className="text-slate-800">{collectorName}</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                Action Timestamp:
              </span>
              <strong className="text-slate-800">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Live Audit)
              </strong>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Target State Post-Empty:
              </span>
              <strong className="text-emerald-700">0% (Normal 🟢)</strong>
            </div>
          </div>

          {/* Remarks input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Housekeeping Remarks / Inspection Notes (Optional)
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Liners replaced; food compost segregated; bin sanitized"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-emerald-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => setCollectingBin(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={step === 'progress'}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{step === 'progress' ? 'Logging Collection...' : 'Mark as Collected (Reset to 0%)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
