'use client';

import React, { useState, useRef } from 'react';
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
  Layers,
  HelpCircle,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';

interface HeaderControlsProps {
  batch: TrainingBatch;
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
  onSubmitSheetUpdate: () => void;
  isUpdating: boolean;
  onOpenDataInspector?: () => void;
  onOpenUploadModal: () => void;
  activeDataSourceName?: string;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  batch,
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
  onSubmitSheetUpdate,
  isUpdating,
  onOpenDataInspector,
  onOpenUploadModal,
  activeDataSourceName,
}) => {
  const [showColSchema, setShowColSchema] = useState(false);
  const [sourceType, setSourceType] = useState<'url' | 'upload'>('url');

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
            <span className="px-2 py-0.5 text-xs rounded bg-slate-800/80 text-slate-300 border border-slate-700 font-mono">
              Cell I2: PERSENTASE LMS
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Vocational Agentic Early Warning System (EWS)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Pemantauan proaktif potensi ketercapaian pelatihan vokasi <strong className="text-slate-200">{batch.name}</strong>, deteksi titik macet belajar, dan rekomendasi intervensi koordinator.
          </p>
        </div>

        {/* Global Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Direct File Upload Action */}
          <button
            onClick={onOpenUploadModal}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-white" />
            Unggah Berkas Sheet (.xlsx/.csv)
          </button>

          {onOpenDataInspector && (
            <button
              onClick={onOpenDataInspector}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm hover:border-slate-600"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              Tinjau Data Sheet (A2..I2)
            </button>
          )}
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

      {/* Configuration Grid: Source Spreadsheet with Submit/Update button, Dates & Target */}
      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
          {/* Active Training Info */}
          <div className="lg:col-span-3 space-y-1.5">
            <span className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Pelatihan Vokasi Aktif</span>
              <span className="text-[11px] text-emerald-400 font-mono">Terpantau</span>
            </span>
            <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white">
              <div className="font-bold text-slate-100 truncate">{batch.code}</div>
              <div className="text-[11px] text-slate-400 truncate">{batch.category}</div>
            </div>
          </div>

          {/* Spreadsheet Source Section: Dual Mode (URL vs Uploaded File) */}
          <div className="lg:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  Sumber Data:
                </span>
                {/* Source Mode Switcher */}
                <div className="inline-flex rounded-md bg-slate-950 p-0.5 border border-slate-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setSourceType('url')}
                    className={`px-2 py-0.5 rounded font-medium transition ${
                      sourceType === 'url' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Link URL Sheet
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceType('upload')}
                    className={`px-2 py-0.5 rounded font-medium transition ${
                      sourceType === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Unggah Berkas
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowColSchema(!showColSchema)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                title="Lihat pemetaan cell A2..I2"
              >
                <HelpCircle className="w-3 h-3" />
                Skema (A2..I2)
              </button>
            </div>
            
            {sourceType === 'url' ? (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={spreadsheetUrl}
                    onChange={(e) => onSpreadsheetUrlChange(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-16 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition"
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

                {/* Dedicated Update / Submit Button Required by User */}
                <button
                  type="button"
                  onClick={onSubmitSheetUpdate}
                  disabled={isUpdating}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 shrink-0 transition shadow-md active:scale-95"
                  title="Submit link dan perbarui proyeksi pelatihan"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                  {isUpdating ? 'Memproses...' : 'Perbarui Proyeksi'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div 
                  onClick={onOpenUploadModal}
                  className="flex-1 bg-slate-950 border border-dashed border-indigo-500/60 hover:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center justify-between cursor-pointer transition"
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">
                      {activeDataSourceName || 'Pilih berkas Excel (.xlsx) atau CSV (.csv)'}
                    </span>
                  </span>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 shrink-0">
                    Pilih File
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onOpenUploadModal}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shrink-0 transition shadow-md"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Unggah Baru
                </button>
              </div>
            )}
          </div>

          {/* Date Range Start & End */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Rentang Tanggal
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-indigo-500"
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
            </div>
          </div>
        </div>

        {/* Column Schema Reference Helper (A2..I2) */}
        {showColSchema && (
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-indigo-300 font-mono">
                Aturan Pemetaan Kolom Spreadsheet / Excel (Mulai Baris 2):
              </span>
              <button
                type="button"
                onClick={() => setShowColSchema(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-[11px] font-mono text-slate-400">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-white block font-bold">Kolom A (A2)</span>
                ID Peserta (MHS-xxx)
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-white block font-bold">Kolom B (B2)</span>
                Nama (Pseudonim)
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-white block font-bold">Kolom C (C2)</span>
                Asal Kampus / Instansi
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-white block font-bold">Kolom D..H</span>
                Modul & Kuis Vokasi
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-indigo-500/50 sm:col-span-2">
                <span className="text-indigo-400 block font-bold">Kolom I (I2) ★ Acuan Lulus</span>
                PERSENTASE LMS (Capaian %)
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              * Peserta dinyatakan lulus jika nilai pada sel <strong>PERSENTASE LMS (Kolom I)</strong> memenuhi ambang batas kelulusan. Titik macet dideteksi dari modul di Kolom D–H dengan nilai di bawah KKM.
            </p>
          </div>
        )}

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
                  • Keyakinan Audit: {stats.confidenceScore}% • Kolom I: PERSENTASE LMS
                </span>
              </div>
              <p className="text-xs sm:text-sm mt-0.5 font-normal leading-relaxed text-slate-100">
                {stats.batchStatusReason}
              </p>
            </div>
          </div>

          <div suppressHydrationWarning className="text-[11px] opacity-75 shrink-0 text-right font-mono sm:self-center">
            Pembaruan Terakhir: 13 Okt, 11:43 WIB
          </div>
        </div>
      </div>
    </header>
  );
};
