'use client';

import React, { useState } from 'react';
import { ModuleAnalysis, DeterministicBatchStats } from '@/lib/types';
import { BarChart3, AlertCircle, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

interface BottleneckChartProps {
  stats: DeterministicBatchStats;
  onSelectStage?: (stageName: string) => void;
}

export const BottleneckChart: React.FC<BottleneckChartProps> = ({ stats, onSelectStage }) => {
  const [selectedStageId, setSelectedStageId] = useState<string | null>(
    stats.bottlenecks.length > 0 ? stats.bottlenecks[0].stageId : null
  );
  const [viewMode, setViewMode] = useState<'completion' | 'stuck'>('completion');

  const selectedModule = stats.moduleBreakdowns.find((m) => m.stageId === selectedStageId) || stats.moduleBreakdowns[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-5 shadow-lg space-y-4">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">
              Tingkat Penyelesaian Modul & Deteksi Bottleneck
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Grafik progres kelulusan per tahapan kurikulum untuk mengidentifikasi modul yang menjadi titik macet.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('completion')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
              viewMode === 'completion'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            % Ketercapaian
          </button>
          <button
            type="button"
            onClick={() => setViewMode('stuck')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
              viewMode === 'stuck'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Jumlah Peserta Macet
          </button>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Bar Visualizations */}
        <div className="lg:col-span-8 space-y-3">
          {stats.moduleBreakdowns.map((module: ModuleAnalysis) => {
            const isSelected = module.stageId === selectedStageId;
            const isStuckBottleneck = module.isBottleneck;

            return (
              <div
                key={module.stageId}
                onClick={() => {
                  setSelectedStageId(module.stageId);
                  if (onSelectStage) onSelectStage(module.stageName);
                }}
                className={`p-2.5 rounded-lg border transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] flex items-center justify-center shrink-0">
                      {module.order}
                    </span>
                    <span className="font-medium text-slate-200 truncate">
                      {module.stageName}
                    </span>
                    {isStuckBottleneck && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-600/60 flex items-center gap-1 shrink-0">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        Bottleneck ({module.stuckCount} macet)
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-xs text-right shrink-0">
                    {viewMode === 'completion' ? (
                      <span className="font-semibold text-slate-200">
                        {module.completedPercent}%{' '}
                        <span className="text-[11px] text-slate-400 font-normal">
                          ({module.completedCount}/{stats.totalRegistered})
                        </span>
                      </span>
                    ) : (
                      <span
                        className={`font-semibold ${
                          module.stuckCount > 0 ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      >
                        {module.stuckCount} orang macet
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Track */}
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                  {/* Completed portion */}
                  <div
                    style={{ width: `${Math.min(100, module.completedPercent)}%` }}
                    className={`h-full transition-all duration-500 ${
                      isStuckBottleneck
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-indigo-500 to-blue-500'
                    }`}
                  />
                  {/* Stuck portion highlight */}
                  {module.stuckCount > 0 && (
                    <div
                      style={{
                        width: `${Math.min(
                          100 - module.completedPercent,
                          (module.stuckCount / stats.totalRegistered) * 100
                        )}%`,
                      }}
                      className="h-full bg-rose-500 animate-pulse"
                      title={`${module.stuckCount} peserta terhenti`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Module Diagnostic Card */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Detail Diagnostik Modul
          </div>

          {selectedModule ? (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {selectedModule.stageName}
                </h4>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                      selectedModule.isBottleneck
                        ? 'bg-amber-950 text-amber-300 border border-amber-600/50'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                    }`}
                  >
                    {selectedModule.isBottleneck ? (
                      <>
                        <AlertCircle className="w-3 h-3 text-amber-400" /> Titik Hambatan Belajar
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Aliran Belajar Normal
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Tuntas / Selesai</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {selectedModule.completedCount} Peserta
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    ({selectedModule.completedPercent}%)
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Peserta Macet</span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      selectedModule.stuckCount > 0 ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    {selectedModule.stuckCount} Peserta
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Drop-off: {selectedModule.dropOffRatePercent}%
                  </span>
                </div>
              </div>

              {/* Coordinator Diagnostic Note */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
                <span className="font-semibold text-slate-300 block">
                  Analisis Hambatan Koordinator:
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {selectedModule.isBottleneck
                    ? `Modul ini memiliki ${selectedModule.stuckCount} peserta yang terhenti lebih dari 7 hari. Direkomendasikan penyediaan video tutorial singkat, asistensi praktikum sinkronous, atau remedial terstruktur.`
                    : `Tingkat kelulusan modul ini stabil (${selectedModule.completedPercent}%). Tidak terdeteksi anomali kegagalan massal.`}
                </p>
              </div>

              {onSelectStage && selectedModule.stuckCount > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectStage(selectedModule.stageName)}
                  className="w-full py-2 px-3 text-xs font-medium rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Filter Peserta Macet di Tabel &rarr;
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Pilih modul pada grafik untuk melihat rincian.</p>
          )}
        </div>
      </div>
    </div>
  );
};
