'use client';

import React, { useState } from 'react';
import { Participant } from '@/lib/types';
import { generateSampleSheetCSV, parseCSVRows } from '@/lib/engine/sheet-parser';
import { Database, FileText, Check, Copy, UploadCloud, RefreshCw } from 'lucide-react';

interface DataInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onApplyNewData: (newParticipants: Participant[]) => void;
}

export const DataInspectorModal: React.FC<DataInspectorModalProps> = ({
  isOpen,
  onClose,
  participants,
  onApplyNewData,
}) => {
  const [csvInput, setCsvInput] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'paste'>('preview');
  const [copied, setCopied] = useState(false);
  const [parseMessage, setParseMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySample = () => {
    const csv = generateSampleSheetCSV();
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleParseAndApply = () => {
    if (!csvInput.trim()) {
      setParseMessage('Silakan masukkan baris data CSV/Spreadsheet.');
      return;
    }
    const parsed = parseCSVRows(csvInput);
    if (parsed.length === 0) {
      setParseMessage('Gagal membaca data. Pastikan format kolom A2 s.d. I2 sesuai skema.');
      return;
    }

    onApplyNewData(parsed);
    setParseMessage(`Berhasil memetakan ${parsed.length} baris peserta berdasarkan Kolom I (PERSENTASE LMS).`);
    setTimeout(() => {
      setParseMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-4xl w-full p-5 sm:p-6 space-y-4 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                Inspeksi Data Spreadsheet & Pemetaan Kolom (A2..I2)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Data peserta dibaca mulai dari baris 2 (A2, B2..). Kelulusan peserta mengacu pada sel <strong>&quot;PERSENTASE LMS&quot; (Kolom I)</strong>.
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Tinjau Data Terpetakan ({participants.length} Baris)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'paste'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Simulasi Input / Tempel CSV Spreadsheet
          </button>
        </div>

        {/* Content Body */}
        {activeTab === 'preview' ? (
          <div className="flex-1 overflow-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Kolom A (ID)</th>
                  <th className="py-2.5 px-3">Kolom B (Nama)</th>
                  <th className="py-2.5 px-3">Kolom C (Instansi)</th>
                  <th className="py-2.5 px-3">D: Tools</th>
                  <th className="py-2.5 px-3">E: Figma</th>
                  <th className="py-2.5 px-3">F: Kuis 1</th>
                  <th className="py-2.5 px-3">G: PHP/HTML</th>
                  <th className="py-2.5 px-3">H: Lanjutan</th>
                  <th className="py-2.5 px-3 bg-indigo-950/60 text-indigo-300 font-bold border-l border-indigo-700/50">
                    Kolom I: PERSENTASE LMS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 text-slate-300 text-[11px]">
                {participants.slice(0, 50).map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-800/50">
                    <td className="py-2 px-3 text-indigo-400 font-bold">{p.id}</td>
                    <td className="py-2 px-3 truncate max-w-[140px]">{p.pseudonymName}</td>
                    <td className="py-2 px-3 truncate max-w-[140px] text-slate-400">{p.institution}</td>
                    <td className="py-2 px-3 text-slate-400">{p.moduleScores['stage-1'] ?? 100}%</td>
                    <td className="py-2 px-3 text-slate-400">{p.moduleScores['stage-2'] ?? 100}%</td>
                    <td className="py-2 px-3">
                      <span className={(p.moduleScores['stage-3'] ?? 0) < 60 ? 'text-amber-400 font-bold' : ''}>
                        {p.moduleScores['stage-3'] ?? 0}%
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={(p.moduleScores['stage-4'] ?? 0) < 60 ? 'text-amber-400 font-bold' : ''}>
                        {p.moduleScores['stage-4'] ?? 0}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{p.moduleScores['stage-5'] ?? 80}%</td>
                    <td className="py-2 px-3 bg-indigo-950/40 font-bold border-l border-indigo-700/40">
                      <span
                        className={
                          p.completionRate >= 75
                            ? 'text-emerald-400'
                            : p.completionRate < 50
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }
                      >
                        {p.completionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 space-y-3 flex flex-col">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">
                Tempel data CSV / Spreadsheet Anda di bawah (header di baris 1, data mulai A2):
              </span>
              <button
                type="button"
                onClick={handleCopySample}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Salin Contoh Format CSV (124 baris)
              </button>
            </div>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="ID Peserta,Nama Peserta,Instansi,Tahap Tools,Tahap Figma,Kuis 1 Logika,PHP HTML Dasar,Kuis Lanjutan,PERSENTASE LMS&#10;MHS-001,Ahmad P. (Pseudonim),Politeknik Negeri Jakarta,100%,100%,90%,88%,85%,91%..."
              className="flex-1 w-full bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 h-64"
            />
            {parseMessage && (
              <div className="p-2.5 rounded-lg bg-indigo-950 border border-indigo-700/60 text-xs text-indigo-300">
                {parseMessage}
              </div>
            )}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCsvInput(generateSampleSheetCSV())}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Muat Contoh Data FAWD VBL 12825
              </button>
              <button
                type="button"
                onClick={handleParseAndApply}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Terapkan Data & Perbarui Proyeksi
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400 shrink-0">
          <span>
            {participants.length} total peserta dipantau • Sesuai aturan: Kolom I menentukan kelulusan.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
