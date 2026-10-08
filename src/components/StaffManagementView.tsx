import React, { useState } from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import { StaffMember, CampusBlock } from '../types/smartbin';
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Phone,
  Mail,
  Clock,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  X,
  Layers,
} from 'lucide-react';

export const StaffManagementView: React.FC = () => {
  const { staff, bins, addStaff, updateStaff, currentUser, setCurrentUser, availableUsers } = useSmartBin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    assignedArea: 'Block A' as CampusBlock,
    shift: '8 AM – 4 PM',
    status: 'Active' as const,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addStaff({
      ...formData,
      avatarColor: 'bg-emerald-600',
    });
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      employeeId: '',
      assignedArea: 'Block A',
      shift: '8 AM – 4 PM',
      status: 'Active',
    });
  };

  const handleAreaReassign = (staffId: string, newArea: CampusBlock) => {
    updateStaff(staffId, { assignedArea: newArea });
    setEditingStaff(null);
  };

  return (
    <div className="space-y-5">
      {/* Header & Access Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Housekeeping Staff & Area Allocation</h2>
              <p className="text-xs text-slate-500">
                Manage campus custodial personnel, shifts, and assigned university blocks
              </p>
            </div>
          </div>
        </div>

        {currentUser.role === 'ADMIN' ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Staff Member</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Staff View (Area Management Restricted to Head of Housekeeping)</span>
          </div>
        )}
      </div>

      {/* Role Comparison Banner (Matching Poster: "Two Access Levels") */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-2xl p-5 text-white shadow-sm border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          Two Access Levels Architecture (Section 12 & 13)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Admin Role */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 text-sm">Role 1: Admin / Head of Housekeeping</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Full Access
              </span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                View all 50 campus bins across all blocks
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Manage staff roster & assign campus areas
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                View analytics, AI fill forecast & collection history
              </li>
            </ul>
          </div>

          {/* Staff Role */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-300 text-sm">Role 2: Housekeeping Staff</span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Area-Limited Access
              </span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                View only bins in assigned campus zone
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Receive instant alerts for assigned area
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Mark bins as collected & maintain personal audit trail
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Staff Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => {
          const assignedBins = bins.filter((b) => b.block === member.assignedArea);
          const criticalBins = assignedBins.filter((b) => b.isOnline && b.fillLevel >= 90);

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div>
                {/* Top: Avatar, Name, Employee ID */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-sm ${member.avatarColor}`}
                    >
                      {member.name.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{member.name}</h4>
                      <p className="text-[11px] font-mono text-slate-400">ID: {member.employeeId}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      member.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : member.status === 'On Duty'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                {/* Details & Area */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Assigned Area:
                    </span>
                    <strong className="text-slate-900 font-bold">{member.assignedArea}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Shift:
                    </span>
                    <span className="text-slate-700 font-medium">{member.shift}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      Phone:
                    </span>
                    <span className="text-slate-700 font-medium">{member.phone}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      Email:
                    </span>
                    <span className="text-slate-700 font-medium truncate max-w-[140px]">
                      {member.email}
                    </span>
                  </div>
                </div>

                {/* Bins in Care & Pending Status */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Bins Monitored</span>
                    <span className="font-extrabold text-slate-800 text-sm">{assignedBins.length}</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <span className="text-[10px] text-emerald-800 block">Collections Done</span>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      {member.collectionsCompletedToday}
                    </span>
                  </div>
                </div>

                {criticalBins.length > 0 && (
                  <div className="mt-2 p-2 bg-rose-50 text-rose-800 rounded-lg text-[11px] font-semibold flex items-center justify-between">
                    <span>⚠️ {criticalBins.length} Bins Require Emptying</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                {currentUser.role === 'ADMIN' && (
                  <button
                    onClick={() => setEditingStaff(member)}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition text-center cursor-pointer"
                  >
                    Reassign Area
                  </button>
                )}

                {/* Direct Persona test switch button */}
                <button
                  onClick={() => {
                    const matchedUser = availableUsers.find((u) => u.employeeId === member.employeeId);
                    if (matchedUser) {
                      setCurrentUser(matchedUser);
                    } else {
                      setCurrentUser({
                        id: member.id,
                        name: member.name,
                        role: 'STAFF',
                        title: `Housekeeping Lead – ${member.assignedArea}`,
                        assignedBlock: member.assignedArea,
                        employeeId: member.employeeId,
                      });
                    }
                  }}
                  className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg transition text-center cursor-pointer"
                >
                  Test Role View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reassign Area Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">
                Reassign Area: {editingStaff.name}
              </h4>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Select the university campus block this housekeeping member will supervise:
            </p>
            <div className="space-y-2">
              {(['Block A', 'Block B', 'Block C', 'Block D'] as const).map((block) => (
                <button
                  key={block}
                  onClick={() => handleAreaReassign(editingStaff.id, block)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                    editingStaff.assignedArea === block
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{block}</span>
                  {editingStaff.assignedArea === block && (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-slate-900">Add New Housekeeping Personnel</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="HK006"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Area</label>
                  <select
                    value={formData.assignedArea}
                    onChange={(e) => setFormData({ ...formData, assignedArea: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Shift</label>
                  <input
                    type="text"
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    placeholder="8 AM – 4 PM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@campus.edu"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
