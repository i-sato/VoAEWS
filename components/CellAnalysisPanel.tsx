'use client';

import React from 'react';
import { SheetAnalysisResponse } from '@/app/api/analyze-sheet/route';
import { 
  Sparkles, 
  RefreshCw, 
  Table, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  GraduationCap, 
  Building2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface CellAnalysisPanelProps {
  analysis: SheetAnalysisResponse | null;
  isLoading: boolean;
  onRefreshAnalysis: () => void;
  sourceName?: string;
  totalEvaluatedCells: number;
}

export const CellAnalysisPanel: React.FC<CellAnalysisPanelProps> = ({
  analysis,
  isLoading,
  onRefreshAnalysis,
  sourceName,
  totalEvaluatedCells,
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-5 shadow-lg space-y-4 animate-pulse">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-500/40 animate-spin"></div>
            <span className="text-sm font-bold text-slate-200">
              Gemini AI sedang menganalisis sel data spreadsheet...
            </span>
          </div>
          <span className="text-xs text-indigo-400 font-mono">Memeriksa Sel A2..I2...</span>
        </div>
        <div className="h-16 bg-slate-950 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="h-24 bg-slate-950 rounded-lg"></div>
          <div className="h-24 bg-slate-950 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <section className="bg-slate-900/95 border border-indigo-500/40 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-600/20 text-indigo-400 border border-indigo-500/40">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Analisis Cerdas Sel Data (Gemini API Intelligence)
            </h3>
            <span className="px-2 py-0.5 text-[10px] rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-mono">
              gemini-2.5-flash
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Pemeriksaan otomatis korelasi antar sel dari sumber: <strong className="text-slate-200">{sourceName || 'Spreadsheet Pelatihan'}</strong> • Referensi utama kelulusan: <strong>Kolom I (PERSENTASE LMS)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
            {totalEvaluatedCells} Sel Teranalisis (A2..I125)
          </span>
          <button
            type="button"
            onClick={onRefreshAnalysis}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm active:scale-95"
            title="Analisis ulang sel data dengan Gemini API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Analisis Ulang Sel
          </button>
        </div>
      </div>

      {/* Executive Summary Narrative */}
      <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-700/40 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 uppercase tracking-wider font-mono">
          <Table className="w-3.5 h-3.5" />
          Ringkasan Evaluasi Sel Data
        </div>
        <p>{analysis.executive_summary}</p>
      </div>

      {/* Key Findings & Cell Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Column Cell Diagnostics */}
        <div className="lg:col-span-7 space-y-2.5">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Diagnostik Pola Nilai Sel Per Kolom
          </h4>

          <div className="space-y-2">
            {analysis.cell_diagnostics.map((diag, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs space-y-1.5 transition ${
                  diag.severity === 'kritis'
                    ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                    : diag.severity === 'waspada'
                    ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                    : 'bg-emerald-950/20 border-emerald-800/50 text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-black/40 border border-current">
                      {diag.column}
                    </span>
                    <span className="truncate">{diag.module_or_field}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      diag.severity === 'kritis'
                        ? 'bg-rose-900/80 text-rose-200'
                        : diag.severity === 'waspada'
                        ? 'bg-amber-900/80 text-amber-200'
                        : 'bg-emerald-900/80 text-emerald-200'
                    }`}
                  >
                    {diag.affected_count} Peserta
                  </span>
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  {diag.pattern_observed}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Key Findings & Interventions */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Temuan Kunci Sel & Rekomendasi
          </h4>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 block font-mono">
              Poin Evaluasi Kurikulum:
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {analysis.key_findings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-indigo-400 mt-0.5 shrink-0">&#8226;</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Interventions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block font-mono">
              Tindakan Intervensi Prioritas:
            </span>
            {analysis.priority_interventions.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-amber-400 font-bold">{item.target_module}</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 font-mono">
                    Prioritas {item.priority}
                  </span>
                </div>
                <p className="text-slate-300 leading-snug">{item.recommended_action}</p>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                  Target: {item.target_recipients}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
