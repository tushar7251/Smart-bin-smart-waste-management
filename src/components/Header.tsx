import React, { useState } from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import {
  Bell,
  Trash2,
  Leaf,
  Cpu,
  Sliders,
  Zap,
  Coffee,
  RotateCcw,
  UserCheck,
  ChevronDown,
  X,
  AlertTriangle,
  Clock,
  CheckCircle,
  Download,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    availableUsers,
    unreadAlertCount,
    alerts,
    markAlertRead,
    markAllAlertsRead,
    setSelectedBin,
    bins,
    simulateSensorBurst,
    simulateLunchRush,
    resetDemoData,
    setIsIotLabOpen,
    setIsSettingsOpen,
  } = useSmartBin();

  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const relevantAlerts = currentUser.role === 'ADMIN'
    ? alerts
    : alerts.filter((a) => a.block === currentUser.assignedBlock);

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      {/* Top micro-bar: Branding tagline & role quick-switch */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wide text-emerald-400">SMARTBIN</span>
          <span className="text-emerald-500">•</span>
          <span className="hidden sm:inline text-emerald-200">Cleaner Campus | Smarter Monitoring | Greener Tomorrow</span>
          <span className="sm:hidden text-emerald-200">Smart Waste Management</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 bg-emerald-800/80 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-emerald-200">
            <Leaf className="w-3 h-3 text-emerald-400" />
            Small Steps, Big Impact
          </span>

          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Role: <strong className="underline decoration-emerald-400">{currentUser.name}</strong></span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Persona</p>
                </div>
                {availableUsers.map((u) => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col transition cursor-pointer ${
                        isSelected ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-800 font-medium">{u.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            u.role === 'ADMIN' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role === 'ADMIN' ? 'Head / Admin' : u.assignedBlock}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-normal">{u.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Greeting */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 relative">
            <Trash2 className="w-5 h-5" />
            <Leaf className="w-3.5 h-3.5 text-lime-300 absolute -top-1 -right-1" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>Smart<span className="text-emerald-600">Bin</span></span>
              </h1>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                IoT Live
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Smart Waste Management • University Campus</p>
          </div>
        </div>

        {/* Action Controls & Notification Bell */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Simulation controls */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={simulateSensorBurst}
              title="Simulate random wireless sensor telemetry packets arriving"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-white rounded transition shadow-2xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>IoT Pulse</span>
            </button>
            <button
              onClick={simulateLunchRush}
              title="Simulate lunch hour foot traffic rush in Canteen & Cafeterias"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-white rounded transition shadow-2xs cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5 text-orange-500" />
              <span>Lunch Rush</span>
            </button>
            <button
              onClick={resetDemoData}
              title="Reset campus bins to initial pristine poster state"
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white rounded transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* IoT Hardware Lab Button */}
          <button
            onClick={() => setIsIotLabOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">ESP32 Hardware Lab</span>
            <span className="sm:hidden">IoT</span>
          </button>

          {/* Download App ZIP Button */}
          <a
            href="/smartbin-app.zip"
            download="smartbin-app.zip"
            title="Download complete project ZIP source code"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Download ZIP</span>
            <span className="sm:hidden">ZIP</span>
          </a>

          {/* Settings button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Configure warning & collection thresholds"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAlertMenu(!showAlertMenu)}
              aria-label="Campus Alerts"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
                </span>
              )}
            </button>

            {showAlertMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-xs">Campus Waste Alerts</span>
                    <span className="bg-rose-500/20 text-rose-300 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {relevantAlerts.length} active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllAlertsRead}
                      className="text-[11px] text-slate-300 hover:text-white underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={() => setShowAlertMenu(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {relevantAlerts.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      All campus bins in normal range!
                    </div>
                  ) : (
                    relevantAlerts.map((alt) => (
                      <div
                        key={alt.id}
                        onClick={() => {
                          markAlertRead(alt.id);
                          const target = bins.find((b) => b.id === alt.binId);
                          if (target) setSelectedBin(target);
                          setShowAlertMenu(false);
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${
                          alt.read ? 'opacity-70 bg-white' : 'bg-rose-50/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            {alt.type === 'COLLECTION' ? (
                              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                            ) : alt.type === 'OFFLINE' ? (
                              <span className="w-2 h-2 rounded-full bg-slate-600" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                            )}
                            <span className="text-slate-900">{alt.binId}</span>
                            <span className="text-slate-500 font-normal">• {alt.block}</span>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              alt.type === 'COLLECTION'
                                ? 'bg-rose-100 text-rose-800'
                                : alt.type === 'OFFLINE'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {alt.type === 'OFFLINE' ? 'OFFLINE' : `${alt.fillLevel}%`}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-600 text-[11px] leading-snug">{alt.message}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alt.timestamp}
                          </span>
                          <span className="text-emerald-700 font-medium">Click to inspect →</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Greeting Banner matching the design poster exactly */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-slate-50 border-t border-slate-100 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600/10 border border-emerald-600/20 text-emerald-700 flex items-center justify-center font-bold text-sm">
              {currentUser.name.slice(0, 1)}
            </div>
            <div>
              <p className="text-xs text-slate-500">Good Morning,</p>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </h2>
            </div>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <p className="text-xs font-medium text-emerald-800 hidden sm:inline">
              Let's keep our campus clean! 🌱
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {currentUser.role === 'ADMIN' ? (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Full Campus Access (All 50 Bins)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
                Assigned Zone: {currentUser.assignedBlock}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
