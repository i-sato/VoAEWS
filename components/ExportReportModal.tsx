'use client';

import React, { useState } from 'react';
import { TrainingBatch, DeterministicBatchStats } from '@/lib/types';
import { FileDown, Copy, Check, Printer, FileText } from 'lucide-react';

interface ExportReportModalProps {
  batch: TrainingBatch;
  stats: DeterministicBatchStats;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  batch,
  stats,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const reportText = `================================================================================
LAPORAN EARLY WARNING SYSTEM (EWS) KETERCAPAIAN PELATIHAN VOKASI
Dihasilkan oleh: Vocational EWS Dashboard Intelligence Engine
Tanggal Laporan : ${generatedDate}
Status Batch    : ${stats.batchStatus.toUpperCase()}
================================================================================

1. INFORMASI PELATIHAN
- Nama Pelatihan      : ${batch.name}
- Kode Batch          : ${batch.code}
- Sumber Data         : ${batch.spreadsheetUrl}
- Rentang Periode     : ${batch.startDate} s.d. ${batch.endDate}
- Target Kelulusan    : ${stats.targetPassingRate}%
- Ambang Kelulusan    : ${batch.passingThreshold}% progres tuntas

2. RINGKASAN METRIK KUNCI (ZERO-MATH VERIFIED)
- Total Peserta Terdaftar    : ${stats.totalRegistered} orang
- Status Onboarding LMS      : ${stats.onboardedCount} orang (${stats.onboardedRate}%)
- Proyeksi Tingkat Kelulusan : ${stats.projectedPassCount} orang (${stats.projectedPassRate}%)
- Selisih Terhadap Target    : ${stats.varianceToTarget > 0 ? '+' : ''}${stats.varianceToTarget}%
- Peserta Berisiko Tinggi    : ${stats.highRiskCount} orang
- Tingkat Keyakinan Audit    : ${stats.confidenceScore}%

3. PENJELASAN STATUS SISTEM
"${stats.batchStatusReason}"

4. ANALISIS TITIK MACET (BOTTLENECK KURIKULUM)
${stats.bottlenecks.map((b) => `- ${b.stageName}: ${b.stuckCount} peserta terhenti (${b.dropOffRatePercent}% drop-off)`).join('\n')}

5. REKOMENDASI TINDAKAN DRAF KOORDINATOR (MANUAL APPROVAL)
- Remedial & Tutoring   : Jadwalkan asistensi klinis bagi peserta yang terhenti di Kuis 1 & PHP/HTML.
- Koordinasi Kampus     : Koordinasi dengan PIC kampus mitra untuk follow-up peserta non-aktif.
- Resource Tambahan     : Sediakan lingkungan sandbox praktikum cloud untuk mengatasi kendala local server.

Catatan Keamanan & Privasi:
Seluruh identitas peserta telah dipseudonimkan demi perlindungan data pribadi sesuai NFR-03.
Laporan ini bersifat draf rekomendasi untuk diputuskan oleh koordinator manusia.
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl">
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FileDown className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Ekspor Laporan Resmi EWS Koordinator
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Dokumen rekapitulasi analitik berlandaskan data deterministik untuk pelaporan ke pimpinan program.
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

        {/* Text Area Preview */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Tinjauan Naskah Laporan
          </label>
          <pre className="w-full bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-200 h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
            {reportText}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 shadow-sm transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Tersalin ke Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Salin Teks Laporan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
