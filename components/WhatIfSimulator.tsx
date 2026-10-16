'use client';

import React, { useState } from 'react';
import { TrainingBatch, DeterministicBatchStats } from '@/lib/types';
import { calculateBatchStats } from '@/lib/engine/calculator';
import { SlidersHorizontal, ArrowRight, RotateCcw, Check, Sparkles } from 'lucide-react';

interface WhatIfSimulatorProps {
  batch: TrainingBatch;
  currentStats: DeterministicBatchStats;
  isOpen: boolean;
  onClose: () => void;
  onApplyToDashboard: (threshold: number, target: number) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  batch,
  currentStats,
  isOpen,
  onClose,
  onApplyToDashboard,
}) => {
  const [simulatedThreshold, setSimulatedThreshold] = useState<number>(batch.passingThreshold);
  const [simulatedTargetRate, setSimulatedTargetRate] = useState<number>(batch.targetPassingRate);

  if (!isOpen) return null;

  // Real-time deterministic calculation without altering base batch configuration
  const simStats = calculateBatchStats(batch, simulatedThreshold, simulatedTargetRate);

  const resetSimulation = () => {
    setSimulatedThreshold(batch.passingThreshold);
    setSimulatedTargetRate(batch.targetPassingRate);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-5 sm:p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Simulasi Bagaimana-Jika (What-If Analysis)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Uji skenario perubahan target dan ambang kelulusan peserta secara sementara untuk mengevaluasi dampak strategis tanpa mengubah data asli.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          {/* Slider 1: Passing Threshold per Student */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300">Ambang Kelulusan Peserta (Min % Selesai)</span>
              <span className="text-indigo-400 font-mono font-bold">{simulatedThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={simulatedThreshold}
              onChange={(e) => setSimulatedThreshold(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>50% (Longgar)</span>
              <span>75% (Standar)</span>
              <span>90% (Ketat)</span>
            </div>
          </div>

          {/* Slider 2: Cohort Target Passing Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300">Target Kelulusan Kohort Pelatihan</span>
              <span className="text-emerald-400 font-mono font-bold">{simulatedTargetRate}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              step="5"
              value={simulatedTargetRate}
              onChange={(e) => setSimulatedTargetRate(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>60%</span>
              <span>80% (Default)</span>
              <span>95%</span>
            </div>
          </div>
        </div>

        {/* Comparative Impact Matrix (Baseline vs Simulation) */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block font-mono">
            Perbandingan Deterministik: Baseline vs Skenario Baru
          </span>

          <div className="grid grid-cols-3 gap-3 text-xs">
            {/* Metric 1: Proyeksi Kelulusan */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Proyeksi Kelulusan</span>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-slate-400 line-through">{currentStats.projectedPassRate}%</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="text-sm sm:text-base font-bold text-white">
                  {simStats.projectedPassRate}%
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                {simStats.projectedPassCount} dari {simStats.totalRegistered} peserta
              </span>
            </div>

            {/* Metric 2: Selisih Target */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Selisih Target</span>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-slate-400 line-through">
                  {currentStats.varianceToTarget > 0 ? '+' : ''}{currentStats.varianceToTarget}%
                </span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span
                  className={`text-sm sm:text-base font-bold ${
                    simStats.varianceToTarget >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {simStats.varianceToTarget > 0 ? '+' : ''}{simStats.varianceToTarget}%
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                {simStats.varianceToTarget >= 0 ? 'Melampaui Target' : 'Di Bawah Target'}
              </span>
            </div>

            {/* Metric 3: Status Pelatihan */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Status Sistem</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 line-through text-[11px]">{currentStats.batchStatus}</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    simStats.batchStatus === 'Aman'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                      : simStats.batchStatus === 'Waspada'
                      ? 'bg-amber-950 text-amber-300 border border-amber-600/50'
                      : 'bg-rose-950 text-rose-300 border border-rose-600/50'
                  }`}
                >
                  {simStats.batchStatus}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                {simStats.highRiskCount} peserta berisiko
              </span>
            </div>
          </div>
        </div>

        {/* Narrative Consequence */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
          <span className="font-semibold text-indigo-300">Analisis Konsekuensi Skenario:</span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            {simStats.batchStatusReason}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetSimulation}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Default
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onApplyToDashboard(simulatedThreshold, simulatedTargetRate);
                onClose();
              }}
              className="px-4 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 shadow-sm transition"
            >
              <Check className="w-3.5 h-3.5" />
              Terapkan ke Tampilan Utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
