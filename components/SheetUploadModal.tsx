'use client';

import React, { useState, useRef } from 'react';
import { parseUploadedFile, ParsedSheetResult } from '@/lib/engine/sheet-parser';
import { Participant } from '@/lib/types';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X, 
  ArrowRight,
  Database
} from 'lucide-react';

interface SheetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (newParticipants: Participant[], sourceInfo: string) => void;
}

export const SheetUploadModal: React.FC<SheetUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyData,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<ParsedSheetResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);
    setParseResult(null);
    setIsProcessing(true);

    try {
      const result = await parseUploadedFile(file);
      if (result.success) {
        setParseResult(result);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal membaca berkas spreadsheet.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmApply = () => {
    if (!parseResult || parseResult.participants.length === 0) return;
    onApplyData(parseResult.participants, `Unggahan: ${parseResult.fileName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Unggah Berkas Spreadsheet Pelatihan
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Alternatif sumber data: unggah berkas Excel (<strong>.xlsx</strong>, <strong>.xls</strong>) atau <strong>.csv</strong> secara langsung.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Column Reference Banner */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono text-[11px]">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            Ketentuan Pemetaan Sel & Baris (Mulai Baris 2):
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Baris 1 adalah header. Data peserta dibaca mulai dari baris 2 (<strong>A2..I2</strong>). Kelulusan peserta dan kalkulasi ketercapaian mutlak mengacu pada nilai di <strong>Kolom I (PERSENTASE LMS)</strong>.
          </p>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            isDragging
              ? 'border-indigo-500 bg-indigo-950/30'
              : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-200">
                Tarik & letakkan berkas di sini, atau <span className="text-indigo-400 underline">pilih dari perangkat</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mendukung format Microsoft Excel (.xlsx, .xls) dan CSV (.csv)
              </p>
            </div>
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Menganalisis struktur kolom dan sel A2 s.d. I2...</span>
          </div>
        )}

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/60 rounded-lg border border-rose-800/80 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Gagal Memproses Berkas</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Success Preview Card */}
        {parseResult && parseResult.success && (
          <div className="p-3.5 bg-emerald-950/30 rounded-lg border border-emerald-600/50 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Berkas Berhasil Diverifikasi
              </span>
              <span className="font-mono text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {parseResult.fileName}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Total Baris Peserta</span>
                <span className="text-sm font-bold text-white">{parseResult.participants.length} Orang</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Lulus (Kolom I &ge; 75%)</span>
                <span className="text-sm font-bold text-emerald-400">
                  {parseResult.participants.filter((p) => p.completionRate >= 75).length} Orang
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Berisiko / Macet</span>
                <span className="text-sm font-bold text-amber-400">
                  {parseResult.participants.filter((p) => p.completionRate < 75).length} Orang
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300">
              {parseResult.message}
            </p>
          </div>
        )}

        {/* Modal Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={!parseResult || !parseResult.success}
            onClick={handleConfirmApply}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center gap-1.5 shadow-md transition"
          >
            Terapkan Data & Perbarui Proyeksi
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
