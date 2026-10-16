'use client';

import React, { useState } from 'react';
import { Participant, RiskLevel } from '@/lib/types';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileText, 
  Eye, 
  Building2, 
  Clock, 
  Lock
} from 'lucide-react';

interface RiskTableProps {
  participants: Participant[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  riskFilter: 'Semua' | RiskLevel;
  onRiskFilterChange: (risk: 'Semua' | RiskLevel) => void;
  passingThreshold: number;
}

export const RiskTable: React.FC<RiskTableProps> = ({
  participants,
  searchQuery,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  passingThreshold,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

  const handleCopyDraft = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleAcknowledged = (id: string) => {
    setAcknowledgedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'Tinggi':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/90 text-rose-300 border border-rose-600/50 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Risiko Tinggi
          </span>
        );
      case 'Sedang':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-600/50 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Risiko Sedang
          </span>
        );
      case 'Rendah':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Aman (On Track)
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg overflow-hidden space-y-4 p-4 lg:p-5">
      {/* Table Header: Controls & Privacy Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">
              Tabel Pemantauan Peserta & Mitigasi Risiko
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {participants.length} Peserta
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            Data privasi terlindungi: Nama & ID dipseudonimkan otomatis (Read-Only).
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari ID, nama, kampus, modul..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Risk Level Filter Chips */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            {(['Semua', 'Tinggi', 'Sedang', 'Rendah'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onRiskFilterChange(lvl)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                  riskFilter === lvl
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3.5">ID / Nama (Pseudonim)</th>
              <th className="py-3 px-3.5">Asal Kampus / Instansi</th>
              <th className="py-3 px-3.5">Capaian Saat Ini</th>
              <th className="py-3 px-3.5">Modul Terakhir yang Macet</th>
              <th className="py-3 px-3.5">Inaktif</th>
              <th className="py-3 px-3.5">Status Risiko</th>
              <th className="py-3 px-3.5 text-right">Aksi Koordinator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {participants.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-500">
                  Tidak ditemukan peserta dengan kriteria pencarian ini.
                </td>
              </tr>
            ) : (
              participants.map((p) => {
                const isUnderThreshold = p.completionRate < passingThreshold;
                const isAcknowledged = acknowledgedIds.has(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-800/40 transition ${
                      p.riskLevel === 'Tinggi' ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    {/* ID & Pseudonym */}
                    <td className="py-3 px-3.5 font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-400 font-semibold">{p.id}</span>
                        <span>{p.pseudonymName}</span>
                      </div>
                      {!p.isOnboarded && (
                        <span className="inline-block mt-0.5 text-[10px] text-rose-400 font-mono">
                          Belum Onboarded LMS
                        </span>
                      )}
                    </td>

                    {/* Institution */}
                    <td className="py-3 px-3.5 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[180px]">{p.institution}</span>
                      </div>
                    </td>

                    {/* Completion Rate with Progress Bar */}
                    <td className="py-3 px-3.5">
                      <div className="space-y-1 min-w-[100px]">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span
                            className={
                              isUnderThreshold
                                ? 'text-amber-400 font-bold'
                                : 'text-emerald-400 font-bold'
                            }
                          >
                            {p.completionRate}%
                          </span>
                          <span className="text-slate-500">Ambang: {passingThreshold}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, p.completionRate)}%` }}
                            className={`h-full ${
                              isUnderThreshold ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Last Stuck Module */}
                    <td className="py-3 px-3.5 text-slate-300">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                          p.lastStuckModule.includes('Kuis 1') || p.lastStuckModule.includes('PHP')
                            ? 'bg-amber-950/80 text-amber-200 border border-amber-800/60 font-medium'
                            : 'text-slate-300'
                        }`}
                      >
                        {p.lastStuckModule}
                      </span>
                    </td>

                    {/* Days Inactive */}
                    <td className="py-3 px-3.5 text-slate-400 font-mono">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className={p.daysInactive >= 7 ? 'text-rose-400 font-semibold' : ''}>
                          {p.daysInactive} hari
                        </span>
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-3.5">{getRiskBadge(p.riskLevel)}</td>

                    {/* Action Column */}
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedParticipant(p)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition"
                          title="Lihat Diagnostik & Draf Rekomendasi"
                        >
                          <Eye className="w-3 h-3 text-indigo-400" />
                          Draf Aksi
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAcknowledged(p.id)}
                          className={`p-1 rounded text-[11px] border transition ${
                            isAcknowledged
                              ? 'bg-emerald-950 border-emerald-600 text-emerald-400'
                              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                          title={
                            isAcknowledged
                              ? 'Tandai belum ditindaklanjuti'
                              : 'Tandai sudah dijadwalkan pendampingan'
                          }
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Participant Diagnostic & Draft Action Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider block">
                  Draf Tindakan Pendampingan Koordinator
                </span>
                <h4 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                  {selectedParticipant.id} • {selectedParticipant.pseudonymName}
                </h4>
                <p className="text-xs text-slate-400">{selectedParticipant.institution}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Capaian Saat Ini</span>
                <span className="text-base font-mono font-bold text-amber-400">
                  {selectedParticipant.completionRate}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Lama Tidak Aktif</span>
                <span className="text-base font-mono font-bold text-rose-400">
                  {selectedParticipant.daysInactive} Hari
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-slate-300">Catatan Diagnostik Sistem:</span>
              <p className="text-slate-400 leading-relaxed">{selectedParticipant.notes}</p>
            </div>

            {/* Recommended Action Draft (Read-Only manual approval) */}
            <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-700/50 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Draf Rencana Pendampingan (Manual Approval):
                </span>
                <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  Siap Disalin
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed font-mono text-[11px] bg-slate-950/80 p-2.5 rounded border border-slate-800">
                {selectedParticipant.recommendedAction}
              </p>
              <p className="text-[10px] text-slate-400 italic">
                * Sesuai aturan sistem, aplikasi tidak mengirim surel otomatis ke peserta. Salin draf ini untuk dieksekusi secara manual oleh koordinator.
              </p>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() =>
                  handleCopyDraft(
                    `[DRAF TINDAKAN EWS]\nPeserta: ${selectedParticipant.id} (${selectedParticipant.pseudonymName})\nKampus: ${selectedParticipant.institution}\nCapaian: ${selectedParticipant.completionRate}%\nModul Macet: ${selectedParticipant.lastStuckModule}\nRekomendasi Tindakan: ${selectedParticipant.recommendedAction}`,
                    selectedParticipant.id
                  )
                }
                className="px-3.5 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 shadow-sm transition"
              >
                {copiedId === selectedParticipant.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Tersalin ke Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Salin Draf Pendampingan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
