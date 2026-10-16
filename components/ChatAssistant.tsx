'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, TrainingBatch, DeterministicBatchStats } from '@/lib/types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ChevronRight, 
  MessageSquare,
  ShieldAlert
} from 'lucide-react';

interface ChatAssistantProps {
  batch: TrainingBatch;
  stats: DeterministicBatchStats;
}

const DEFAULT_QUESTIONS = [
  'Kenapa batch ini berstatus Waspada?',
  'Di modul apa peserta paling banyak terhenti?',
  'Apa saran pendampingan untuk peserta yang macet?',
  'Berapa selisih capaian terhadap target 80%?',
];

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ batch, stats }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      narrative_summary: `Selamat datang di Vocational EWS Intelligence Engine. Batch ${batch.code} saat ini berstatus ${stats.batchStatus} dengan proyeksi kelulusan ${stats.projectedPassRate}% (target ${stats.targetPassingRate}%) dan 11 peserta berisiko tinggi.`,
      ui_payload: {
        status_badge: {
          status: stats.batchStatus,
          label: `Status Terkini: ${stats.batchStatus}`,
        },
        key_metrics: [
          {
            label: 'Proyeksi Kelulusan',
            value: `${stats.projectedPassRate}%`,
            subtext: `Target: ${stats.targetPassingRate}% (${stats.varianceToTarget > 0 ? '+' : ''}${stats.varianceToTarget}%)`,
            status: stats.varianceToTarget >= 0 ? 'safe' : 'danger',
          },
          {
            label: 'Peserta Macet',
            value: `${stats.highRiskCount} Orang`,
            subtext: 'Terhenti di Kuis 1 & PHP',
            status: 'warning',
          },
        ],
        bottlenecks: stats.bottlenecks.map((b) => ({
          module: b.stageName,
          stuck_count: b.stuckCount,
          impact: 'Menjadi titik hambatan kelulusan utama',
        })),
        actionable_recommendations: [
          {
            priority: 'Tinggi',
            title: 'Sesi Remedial Terbimbing Kuis 1',
            description: 'Fasilitasi pendampingan asisten lab untuk 6 peserta yang gagal di kuis logika dasar sebelum evaluasi tengah periode.',
            target_group: '6 Peserta di Modul Kuis 1',
          },
          {
            priority: 'Tinggi',
            title: 'Klinik Debugging Implementasi PHP/HTML',
            description: 'Sediakan modul sandbox alternatif bagi 5 peserta yang terhambat instalasi server lokal dan penanganan form sintaks PHP.',
            target_group: '5 Peserta di Modul PHP/HTML',
          },
        ],
        suggested_queries: DEFAULT_QUESTIONS,
      },
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const idCounterRef = useRef(1);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    idCounterRef.current += 1;
    const currentId = idCounterRef.current;
    const nowTime = "20:30 WIB";

    const userMsg: ChatMessage = {
      id: `user-${currentId}`,
      sender: 'user',
      timestamp: nowTime,
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Prepare top stuck participants sample for grounding
      const stuckSample = batch.participants
        .filter((p) => p.riskLevel === 'Tinggi')
        .slice(0, 11)
        .map((p) => ({
          id: p.id,
          pseudonymName: p.pseudonymName,
          institution: p.institution,
          completionRate: p.completionRate,
          lastStuckModule: p.lastStuckModule,
          daysInactive: p.daysInactive,
          action: p.recommendedAction,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          batchContext: {
            batchName: batch.name,
            batchCode: batch.code,
            startDate: batch.startDate,
            endDate: batch.endDate,
            stats,
            stuckSample,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      idCounterRef.current += 1;

      const assistantMsg: ChatMessage = {
        id: `assistant-${idCounterRef.current}`,
        sender: 'assistant',
        timestamp: nowTime,
        narrative_summary: data.narrative_summary,
        ui_payload: data.ui_payload,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      idCounterRef.current += 1;
      // Fallback message with deterministic context
      const fallbackMsg: ChatMessage = {
        id: `assistant-fallback-${idCounterRef.current}`,
        sender: 'assistant',
        timestamp: nowTime,
        narrative_summary: stats.batchStatusReason,
        ui_payload: {
          status_badge: {
            status: stats.batchStatus,
            label: `Status: ${stats.batchStatus}`,
          },
          key_metrics: [
            {
              label: 'Proyeksi Kelulusan',
              value: `${stats.projectedPassRate}%`,
              subtext: `Target: ${stats.targetPassingRate}%`,
              status: stats.varianceToTarget >= 0 ? 'safe' : 'danger',
            },
            {
              label: 'Peserta Macet',
              value: `${stats.highRiskCount} Orang`,
              subtext: 'Butuh pendampingan segera',
              status: 'warning',
            },
          ],
          actionable_recommendations: [
            {
              priority: 'Tinggi',
              title: 'Tindak Lanjut Peserta Terhenti',
              description: 'Gunakan tabel peserta berisiko di samping untuk menyalin draf rekomendasi pendampingan 1-on-1.',
              target_group: `${stats.highRiskCount} Peserta Berisiko`,
            },
          ],
          suggested_queries: DEFAULT_QUESTIONS,
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg flex flex-col h-[700px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Chat Analisis Ketercapaian
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Intelligence Engine • Zero-Math Grounding Aktif
            </p>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 font-mono">
          Model: gemini-3.8-flash
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender tag & time */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 px-1">
              <span>{msg.sender === 'user' ? 'Koordinator Pelatihan' : 'EWS Intelligence Engine'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Bubble content */}
            {msg.sender === 'user' ? (
              <div className="bg-indigo-600 text-white text-xs sm:text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] shadow-sm">
                {msg.text}
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-sm p-4 max-w-[95%] space-y-3 shadow-md">
                {/* 1. Formal Narrative Summary (1-2 sentences) */}
                {msg.narrative_summary && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border-l-4 border-l-indigo-500 border-r border-t border-b border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block mb-0.5">
                      Ringkasan Keterangan Koordinator:
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
                      {msg.narrative_summary}
                    </p>
                  </div>
                )}

                {/* 2. Structured UI Payload Rendering */}
                {msg.ui_payload && (
                  <div className="space-y-3 pt-1">
                    {/* Key Metric Chips */}
                    {msg.ui_payload.key_metrics && msg.ui_payload.key_metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {msg.ui_payload.key_metrics.map((km, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg"
                          >
                            <span className="text-[10px] text-slate-400 block">{km.label}</span>
                            <span
                              className={`text-sm sm:text-base font-bold font-mono ${
                                km.status === 'safe'
                                  ? 'text-emerald-400'
                                  : km.status === 'warning'
                                  ? 'text-amber-400'
                                  : km.status === 'danger'
                                  ? 'text-rose-400'
                                  : 'text-white'
                              }`}
                            >
                              {km.value}
                            </span>
                            {km.subtext && (
                              <span className="text-[10px] text-slate-500 block truncate">
                                {km.subtext}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottlenecks Found */}
                    {msg.ui_payload.bottlenecks && msg.ui_payload.bottlenecks.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-600/30 text-xs space-y-1">
                        <span className="font-semibold text-amber-300 flex items-center gap-1.5 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          Titik Macet Terdeteksi:
                        </span>
                        <ul className="space-y-1 text-slate-300 pl-4 list-disc text-[11px]">
                          {msg.ui_payload.bottlenecks.map((bn, idx) => (
                            <li key={idx}>
                              <strong className="text-amber-200">{bn.module}</strong>: {bn.stuck_count > 0 ? `${bn.stuck_count} peserta macet` : bn.impact}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actionable Recommendations Drafts */}
                    {msg.ui_payload.actionable_recommendations &&
                      msg.ui_payload.actionable_recommendations.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold text-slate-300 block">
                            Draf Rekomendasi Tindak Lanjut (Manual Approval):
                          </span>
                          {msg.ui_payload.actionable_recommendations.map((rec, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-xs hover:border-slate-700 transition"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-slate-200">
                                  {rec.title}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    rec.priority === 'Tinggi'
                                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                                  }`}
                                >
                                  Prioritas {rec.priority}
                                </span>
                              </div>
                              <p className="text-slate-400 text-[11px] leading-relaxed">
                                {rec.description}
                              </p>
                              <div className="pt-1 flex items-center justify-between text-[10px]">
                                <span className="text-indigo-400">Sasaran: {rec.target_group}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopy(
                                      `[DRAF AKSI EWS]\nJudul: ${rec.title}\nSasaran: ${rec.target_group}\nTindakan: ${rec.description}`,
                                      `${msg.id}-rec-${idx}`
                                    )
                                  }
                                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1 hover:underline"
                                >
                                  {copiedKey === `${msg.id}-rec-${idx}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      Tersalin
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      Salin
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Suggested follow-up queries */}
                    {msg.ui_payload.suggested_queries && msg.ui_payload.suggested_queries.length > 0 && (
                      <div className="pt-1 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block mb-1.5">
                          Pertanyaan Lanjutan yang Disarankan:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.ui_payload.suggested_queries.map((q, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSendMessage(q)}
                              className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-850 hover:border-slate-700 text-slate-300 border border-slate-800 rounded-lg transition text-left"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800 max-w-[240px]">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            <span className="text-xs text-slate-400">Menghubungkan ke EWS engine...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Bar */}
      <div className="px-3.5 py-2 bg-slate-950/90 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
        {DEFAULT_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Tanyakan analisis pelatihan (contoh: Kenapa batch ini Waspada?)..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shrink-0"
            title="Kirim Pertanyaan"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
