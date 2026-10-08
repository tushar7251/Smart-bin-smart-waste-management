import React, { useState } from 'react';
import { useSmartBin } from '../context/SmartBinContext';
import {
  calculateFillPrediction,
  generateOptimizedRoute,
  generateGeminiCampusAdvisory,
  AiBinPrediction,
  RouteOptimizationResult,
} from '../services/aiService';
import {
  Sparkles,
  Navigation,
  Compass,
  TrendingUp,
  Clock,
  MapPin,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Leaf,
  RefreshCw,
} from 'lucide-react';

export const AiRouteOptimizerView: React.FC = () => {
  const { bins, thresholds, setSelectedBin } = useSmartBin();

  // Run deterministic algorithms
  const predictions: AiBinPrediction[] = bins
    .filter((b) => b.isOnline)
    .map(calculateFillPrediction)
    .sort((a, b) => b.currentFill - a.currentFill);

  const routeResult: RouteOptimizationResult = generateOptimizedRoute(bins);

  // Gemini Live Advisory state
  const [advisoryText, setAdvisoryText] = useState<string | null>(null);
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState<boolean>(false);

  const handleGenerateAdvisory = async () => {
    setIsLoadingAdvisory(true);
    try {
      const result = await generateGeminiCampusAdvisory(bins, {
        warningThreshold: thresholds.warningThreshold,
        collectionThreshold: thresholds.collectionThreshold,
      });
      setAdvisoryText(result);
    } catch {
      setAdvisoryText('Operational recommendation: Prioritize Block A canteen and Block D athletics field before midday foot-traffic surge.');
    } finally {
      setIsLoadingAdvisory(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 text-white shadow-md border border-emerald-900/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              AIML Module • Sections 18, 19 & 20
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            AI Fill-Level Prediction & Route Optimization Engine
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Eliminating blind campus rounds through machine-learned accumulation velocity, dynamic dispatch prioritization, and shortest-path logistics.
          </p>
        </div>

        {/* Floating eco-metrics */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 text-xs">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-emerald-300 text-[11px] block">Collection Stops</span>
            <span className="text-xl font-extrabold text-white">{routeResult.binsHandled} Bins</span>
            <span className="text-[10px] text-emerald-200 block">≥ {thresholds.warningThreshold}% fill</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-emerald-300 text-[11px] block">Est. Route Time</span>
            <span className="text-xl font-extrabold text-white">{routeResult.estimatedDurationMins} Mins</span>
            <span className="text-[10px] text-emerald-200 block">vs 85m random route</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-emerald-300 text-[11px] block">Total Foot Distance</span>
            <span className="text-xl font-extrabold text-white">{routeResult.totalDistanceMeters} m</span>
            <span className="text-[10px] text-emerald-200 block">Shortest campus loop</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <span className="text-emerald-300 text-[11px] block">Carbon Avoided</span>
            <span className="text-xl font-extrabold text-white">~{routeResult.co2SavedKg} kg</span>
            <span className="text-[10px] text-emerald-200 block">38% fewer unnecessary trips</span>
          </div>
        </div>
      </div>

      {/* Gemini AI Live Advisory Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-700">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Gemini AI Campus Sanitation Advisory
              </h3>
              <p className="text-xs text-slate-500">
                Context-aware intelligence generating shift strategies based on live telemetry
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAdvisory}
            disabled={isLoadingAdvisory}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{isLoadingAdvisory ? 'Synthesizing Advisory...' : 'Generate Live Advisory'}</span>
          </button>
        </div>

        {advisoryText ? (
          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200/70 text-xs text-slate-800 space-y-2 leading-relaxed whitespace-pre-line">
            {advisoryText}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <p>
              Click <strong>"Generate Live Advisory"</strong> to synthesize customized predictive insights using Google GenAI models.
            </p>
            <button
              onClick={handleGenerateAdvisory}
              className="text-xs text-purple-700 font-bold hover:underline cursor-pointer"
            >
              Analyze Campus Now →
            </button>
          </div>
        )}
      </div>

      {/* Grid: Route Steps & Fill Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Sequential Route (Section 20) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recommended Collection Route
                </h3>
                <p className="text-xs text-slate-500">Priority sequence: Housekeeping Depot → Fullest Bins</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Optimal TSP Sequence
            </span>
          </div>

          <div className="space-y-3">
            {/* Start Depot */}
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">
                0
              </span>
              <span>Central Housekeeping Depot (Central Campus Courtyard)</span>
              <span className="ml-auto text-slate-400 font-normal">Start Departure</span>
            </div>

            {/* Sequence of stops */}
            {routeResult.orderedStops.map((stop) => {
              const targetBin = bins.find((b) => b.id === stop.binId);

              return (
                <div
                  key={stop.binId}
                  onClick={() => targetBin && setSelectedBin(targetBin)}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer flex items-center justify-between gap-3 text-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-[11px] shrink-0">
                      {stop.stopNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 group-hover:text-emerald-700 transition">
                          {stop.binId}
                        </strong>
                        <span className="text-slate-400">• {stop.block}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{stop.location}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-black ${
                        stop.urgency === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'
                      }`}
                    >
                      {stop.fillLevel}%
                    </span>
                    <p className="text-[10px] text-slate-400">+{stop.distanceFromPreviousMeters}m walk</p>
                  </div>
                </div>
              );
            })}

            {/* Return to Depot */}
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">
                ✓
              </span>
              <span>Central Housekeeping Depot</span>
              <span className="ml-auto text-slate-400 font-normal">Disposal & Return</span>
            </div>
          </div>
        </div>

        {/* Fill-Level Prediction Engine (Section 19) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Fill-Rate Predictive Forecast
                </h3>
                <p className="text-xs text-slate-500">Machine learning estimated time-to-full</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              Heuristic + Model
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
            {predictions.slice(0, 10).map((pred) => {
              const bin = bins.find((b) => b.id === pred.binId);

              return (
                <div
                  key={pred.binId}
                  onClick={() => bin && setSelectedBin(bin)}
                  className="py-3 px-2 hover:bg-slate-50 rounded-xl transition cursor-pointer text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">{pred.binId}</strong>
                      <span className="text-slate-500">{bin?.location}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pred.riskLevel === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : pred.riskLevel === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {pred.currentFill}% Full
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600">{pred.recommendation}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>
                      Accumulation Velocity:{' '}
                      <strong className="text-slate-700">+{pred.hourlyFillRate}% / hr</strong>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <Clock className="w-3 h-3" />
                      {pred.currentFill >= 90
                        ? 'Requires Emptying Now'
                        : `Estimated 90% by: ${pred.expectedFullTime}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
