'use client';

import React from 'react';
import { TrainingBatch, DeterministicBatchStats } from '@/lib/types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Database, 
  Calendar, 
  Target, 
  SlidersHorizontal, 
  FileDown, 
  RefreshCw,
  ExternalLink,
  Layers
} from 'lucide-react';

interface HeaderControlsProps {
  batches: TrainingBatch[];
  selectedBatch: TrainingBatch;
  onSelectBatch: (batchId: string) => void;
  stats: DeterministicBatchStats;
  customTargetRate: number;
  onTargetRateChange: (val: number) => void;
  customPassingThreshold: number;
  onPassingThresholdChange: (val: number) => void;
  spreadsheetUrl: string;
  onSpreadsheetUrlChange: (val: string) => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  onOpenWhatIf: () => void;
  onOpenExport: () => void;
  onSyncData: () => void;
  isSyncing: boolean;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  batches,
  selectedBatch,
  onSelectBatch,
  stats,
  customTargetRate,
  onTargetRateChange,
  spreadsheetUrl,
  onSpreadsheetUrlChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onOpenWhatIf,
  onOpenExport,
  onSyncData,
  isSyncing,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aman':
        return <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'Waspada':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'Kritis':
        return <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Aman':
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
      case 'Waspada':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'Kritis':
        return 'bg-rose-950/80 border-rose-500/50 text-rose-300';
      default:
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
    }
  };

  return (
    <header className="space-y-4">
      {/* Top Bar: Title & System Guardrail Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-indigo-950/90 text-indigo-300 border border-indigo-700/60 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Vocational EWS Dashboard Intelligence Engine
            </span>
            <span className="px-2 py-0.5 text-xs rounded bg-slate-800/80 text-slate-300 border border-slate-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Mode Baca (Read-Only)
            </span>
            <span className="px-2 py-0.5 text-xs rounded bg-slate-800/80 text-slate-300 border border-slate-700">
              Zero-Math Grounding
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Vocational Agentic Early Warning System (EWS)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pemantauan proaktif potensi ketercapaian pelatihan vokasi, deteksi hambatan belajar modul, dan asistensi pendampingan koordinator.
          </p>
        </div>

        {/* Global Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenWhatIf}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm hover:border-slate-600"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            Simulasi Bagaimana-Jika
          </button>
          <button
            onClick={onOpenExport}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm hover:border-slate-600"
          >
            <FileDown className="w-4 h-4 text-emerald-400" />
            Ekspor Laporan EWS
          </button>
        </div>
      </div>

      {/* Configuration Grid: Source Spreadsheet, Cohort Selector, Dates & Target */}
      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
          {/* Cohort Selector */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Pilih Pelatihan Vokasi</span>
              <span className="text-[11px] text-slate-400">{batches.length} Batch</span>
            </label>
            <select
              value={selectedBatch.id}
              onChange={(e) => onSelectBatch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Spreadsheet URL Input */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                Link Google Spreadsheet Sumber
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">Terkoneksi</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={spreadsheetUrl}
                onChange={(e) => onSpreadsheetUrlChange(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-20 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition"
              />
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                title="Buka link spreadsheet (read-only)"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Buka
              </a>
            </div>
          </div>

          {/* Date Range Start & End */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Rentang Tanggal Pelatihan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Cohort Target Passing Rate */}
          <div className="lg:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Target Lulus
              </span>
              <span className="text-indigo-400 font-bold">{customTargetRate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="50"
                max="100"
                step="1"
                value={customTargetRate}
                onChange={(e) => onTargetRateChange(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <button
                type="button"
                onClick={onSyncData}
                disabled={isSyncing}
                title="Sinkronisasi Ulang Data Spreadsheet"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shrink-0 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Status Indicator Banner with 1-2 sentence narrative explanation */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border ${getStatusBadgeStyle(
            stats.batchStatus
          )} transition`}
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-md bg-black/20 shrink-0">
              {getStatusIcon(stats.batchStatus)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Status Pelatihan: {stats.batchStatus}
                </span>
                <span className="text-[11px] opacity-75 font-mono">
                  • Tingkat Keyakinan Data: {stats.confidenceScore}%
                </span>
              </div>
              <p className="text-xs sm:text-sm mt-0.5 font-normal leading-relaxed text-slate-100">
                {stats.batchStatusReason}
              </p>
            </div>
          </div>

          <div className="text-[11px] opacity-75 shrink-0 text-right font-mono sm:self-center">
            Pembaruan Terakhir: {new Date(stats.lastCalculatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
          </div>
        </div>
      </div>
    </header>
  );
};
