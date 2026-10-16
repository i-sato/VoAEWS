'use client';

import React from 'react';
import { DeterministicBatchStats } from '@/lib/types';
import { Users, GraduationCap, TrendingUp, AlertTriangle, UserCheck } from 'lucide-react';

interface ScorecardsProps {
  stats: DeterministicBatchStats;
  onFilterHighRisk?: () => void;
}

export const Scorecards: React.FC<ScorecardsProps> = ({ stats, onFilterHighRisk }) => {
  const isPositiveVariance = stats.varianceToTarget >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total Peserta Terdaftar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Total Peserta Terdaftar</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
            {stats.totalRegistered}
          </span>
          <span className="text-xs text-slate-400">orang</span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Onboarded LMS
          </span>
          <span className="text-slate-300 font-mono font-medium">
            {stats.onboardedCount} ({stats.onboardedRate}%)
          </span>
        </div>
      </div>

      {/* 2. Proyeksi Tingkat Kelulusan Saat Ini */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Proyeksi Kelulusan Saat Ini</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold tracking-tight text-emerald-400 font-mono">
            {stats.projectedPassRate}%
          </span>
          <span className="text-xs text-slate-400">
            ({stats.projectedPassCount} lulus)
          </span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Target Kurikulum</span>
          <span className="text-slate-300 font-mono font-medium">
            Min. {stats.targetPassingRate}%
          </span>
        </div>
      </div>

      {/* 3. Selisih Capaian terhadap Target */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Selisih Terhadap Target</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            isPositiveVariance 
              ? 'bg-emerald-950/80 border-emerald-700/50 text-emerald-400' 
              : 'bg-rose-950/80 border-rose-700/50 text-rose-400'
          }`}>
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-2xl lg:text-3xl font-bold tracking-tight font-mono ${
            isPositiveVariance ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {isPositiveVariance ? '+' : ''}{stats.varianceToTarget}%
          </span>
          <span className="text-xs text-slate-400">vs target {stats.targetPassingRate}%</span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Taraf Deviasi</span>
          <span className={`font-medium ${isPositiveVariance ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositiveVariance ? 'Surplus Capaian' : 'Defisit Capaian'}
          </span>
        </div>
      </div>

      {/* 4. Jumlah Peserta Berisiko Tinggi */}
      <div 
        onClick={onFilterHighRisk}
        className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/50 transition cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 group-hover:text-amber-300 transition">
            Peserta Berisiko Tinggi
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold tracking-tight text-amber-400 font-mono">
            {stats.highRiskCount}
          </span>
          <span className="text-xs text-slate-400">
            orang ({((stats.highRiskCount / stats.totalRegistered) * 100).toFixed(1)}%)
          </span>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Perlu Intervensi</span>
          <span className="text-amber-400 font-medium group-hover:underline flex items-center gap-1">
            Lihat di Tabel &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
