import React, { useState } from 'react';
import { SmartBinProvider, useSmartBin } from './context/SmartBinContext';
import { Header } from './components/Header';
import { CampusOverviewMetrics } from './components/CampusOverviewMetrics';
import { CampusMapPreview } from './components/CampusMapPreview';
import { RecentAlerts } from './components/RecentAlerts';
import { AllBinsView } from './components/AllBinsView';
import { CampusMapView } from './components/CampusMapView';
import { StaffManagementView } from './components/StaffManagementView';
import { ReportsAndAnalyticsView } from './components/ReportsAndAnalyticsView';
import { AiRouteOptimizerView } from './components/AiRouteOptimizerView';
import { BinDetailsModal } from './components/BinDetailsModal';
import { CollectionModal } from './components/CollectionModal';
import { IotHardwareLabModal } from './components/IotHardwareLabModal';
import { SettingsModal } from './components/SettingsModal';
import { BottomNavigation } from './components/BottomNavigation';
import {
  Smartphone,
  Monitor,
  Sparkles,
  Bot,
  BarChart3,
  Flame,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Leaf,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useSmartBin();
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);
  const [reportSubTab, setReportSubTab] = useState<'analytics' | 'ai'>('analytics');

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-24 sm:pb-28">
      {/* Global Header */}
      <Header />

      {/* Viewport & Device Display Mode Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation tabs for desktop */}
        <div className="hidden md:flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/90 shadow-2xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'home'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home Dashboard
          </button>
          <button
            onClick={() => setActiveTab('bins')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'bins'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            All Bins (50)
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Campus Map
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Staff & Areas
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Reports & AI</span>
          </button>
        </div>

        {/* Poster Mobile Mode Switcher */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              deviceFrameMode
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle smartphone chassis frame preview matching the poster layout"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>{deviceFrameMode ? 'Smartphone Frame On' : 'Simulate Mobile Poster Frame'}</span>
          </button>
        </div>
      </div>

      {/* Main Container - either standard full responsive or framed phone simulation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        {deviceFrameMode ? (
          /* Phone Frame Container simulating the exact poster mockup */
          <div className="flex justify-center py-4">
            <div className="w-full max-w-[420px] bg-slate-900 p-3.5 rounded-[48px] shadow-2xl border-4 border-slate-800 relative">
              {/* Phone speaker & camera notch */}
              <div className="w-32 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Inside phone screen */}
              <div className="bg-slate-50 rounded-[36px] overflow-hidden p-3.5 space-y-4 max-h-[760px] overflow-y-auto">
                {activeTab === 'home' && (
                  <div className="space-y-4">
                    <CampusOverviewMetrics />
                    <CampusMapPreview />
                    <RecentAlerts />
                  </div>
                )}
                {activeTab === 'bins' && <AllBinsView />}
                {activeTab === 'map' && <CampusMapView />}
                {activeTab === 'staff' && <StaffManagementView />}
                {activeTab === 'reports' && (
                  <div className="space-y-4">
                    <div className="flex bg-slate-200 p-1 rounded-xl text-xs">
                      <button
                        onClick={() => setReportSubTab('analytics')}
                        className={`flex-1 py-1 rounded-lg font-bold ${
                          reportSubTab === 'analytics' ? 'bg-white shadow-2xs' : 'text-slate-600'
                        }`}
                      >
                        Analytics
                      </button>
                      <button
                        onClick={() => setReportSubTab('ai')}
                        className={`flex-1 py-1 rounded-lg font-bold ${
                          reportSubTab === 'ai' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-600'
                        }`}
                      >
                        AI Route & Predict
                      </button>
                    </div>
                    {reportSubTab === 'analytics' ? <ReportsAndAnalyticsView /> : <AiRouteOptimizerView />}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Standard Full-Width Responsive Dashboard View */
          <div className="space-y-6">
            {activeTab === 'home' && (
              <div className="space-y-6">
                {/* 4 Metric Cards */}
                <CampusOverviewMetrics />

                {/* Main 2-column split: Campus Map Preview (Left) and Recent Alerts (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7">
                    <CampusMapPreview />
                  </div>
                  <div className="lg:col-span-5">
                    <RecentAlerts />
                  </div>
                </div>

                {/* Quick Academic presentation reference card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        SmartBin IoT & AI Campus Sanitation System
                      </h4>
                      <p className="text-xs text-slate-500">
                        Ultrasonic sensing (HC-SR04) • Role-based access • Priority route optimization
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('map')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      Explore 50 Bins
                    </button>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Route Engine</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bins' && <AllBinsView />}

            {activeTab === 'map' && <CampusMapView />}

            {activeTab === 'staff' && <StaffManagementView />}

            {activeTab === 'reports' && (
              <div className="space-y-5">
                {/* Sub-tab switcher for Reports & AI Module */}
                <div className="bg-white p-1.5 rounded-xl border border-slate-200 inline-flex items-center gap-1 shadow-2xs">
                  <button
                    onClick={() => setReportSubTab('analytics')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      reportSubTab === 'analytics'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>Campus Reports & Audit Trail</span>
                  </button>
                  <button
                    onClick={() => setReportSubTab('ai')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      reportSubTab === 'ai'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>AI Fill Prediction & Route Optimizer</span>
                  </button>
                </div>

                {reportSubTab === 'analytics' ? (
                  <ReportsAndAnalyticsView />
                ) : (
                  <AiRouteOptimizerView />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Global Modals */}
      <BinDetailsModal />
      <CollectionModal />
      <IotHardwareLabModal />
      <SettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <SmartBinProvider>
      <MainContent />
    </SmartBinProvider>
  );
}
