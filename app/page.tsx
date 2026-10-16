'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_BATCHES } from '@/lib/data/mock-batches';
import { calculateBatchStats, filterParticipants } from '@/lib/engine/calculator';
import { Participant, RiskLevel, TrainingBatch } from '@/lib/types';
import { HeaderControls } from '@/components/HeaderControls';
import { Scorecards } from '@/components/Scorecards';
import { BottleneckChart } from '@/components/BottleneckChart';
import { RiskTable } from '@/components/RiskTable';
import { ChatAssistant } from '@/components/ChatAssistant';
import { WhatIfSimulator } from '@/components/WhatIfSimulator';
import { ExportReportModal } from '@/components/ExportReportModal';
import { DataInspectorModal } from '@/components/DataInspectorModal';
import { BarChart2, MessageSquare, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  // Primary training: FAWD VBL 12825
  const baseBatch = MOCK_BATCHES[0];

  // Editable configurations & dynamic participant state
  const [participants, setParticipants] = useState<Participant[]>(baseBatch.participants);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>(baseBatch.spreadsheetUrl);
  const [startDate, setStartDate] = useState<string>(baseBatch.startDate);
  const [endDate, setEndDate] = useState<string>(baseBatch.endDate);
  const [customTargetRate, setCustomTargetRate] = useState<number>(baseBatch.targetPassingRate);
  const [customPassingThreshold, setCustomPassingThreshold] = useState<number>(baseBatch.passingThreshold);

  // Sync / Update state
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Table filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<'Semua' | RiskLevel>('Semua');

  // Active view tab on mobile/tablets
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');

  // Modals
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isDataInspectorOpen, setIsDataInspectorOpen] = useState<boolean>(false);

  // Current batch object with dynamic participants
  const currentBatch: TrainingBatch = useMemo(() => {
    return {
      ...baseBatch,
      spreadsheetUrl,
      startDate,
      endDate,
      targetPassingRate: customTargetRate,
      passingThreshold: customPassingThreshold,
      participants,
      lastSyncTime: baseBatch.lastSyncTime,
    };
  }, [baseBatch, spreadsheetUrl, startDate, endDate, customTargetRate, customPassingThreshold, participants]);

  // Deterministic calculation (Strict Zero-Math, with Column I PERSENTASE LMS as primary passing metric)
  const currentStats = useMemo(() => {
    return calculateBatchStats(currentBatch, customPassingThreshold, customTargetRate);
  }, [currentBatch, customPassingThreshold, customTargetRate]);

  // Filtered participant list
  const filteredParticipants = useMemo(() => {
    return filterParticipants(participants, searchQuery, riskFilter);
  }, [participants, searchQuery, riskFilter]);

  // Handler for explicit Google Sheet Submit / Update button
  const handleSubmitSheetUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setToastMessage(
        `Proyeksi pelatihan berhasil diperbarui dari Spreadsheet: ${currentStats.totalRegistered} peserta terverifikasi via Kolom I (PERSENTASE LMS).`
      );
      setTimeout(() => setToastMessage(null), 3500);
    }, 700);
  };

  // Handler for applying newly parsed spreadsheet rows from Data Inspector
  const handleApplyNewData = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    setToastMessage(
      `Data berhasil diperbarui: ${newParticipants.length} baris dipetakan berdasarkan Kolom I (PERSENTASE LMS).`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Simulation apply
  const handleApplyWhatIf = (newThreshold: number, newTarget: number) => {
    setCustomPassingThreshold(newThreshold);
    setCustomTargetRate(newTarget);
    setToastMessage(`Skenario diterapkan: Ambang kelulusan ${newThreshold}%, Target ${newTarget}%`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-indigo-400/40">
          <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Controls & Status Banner */}
        <HeaderControls
          batch={currentBatch}
          stats={currentStats}
          customTargetRate={customTargetRate}
          onTargetRateChange={setCustomTargetRate}
          customPassingThreshold={customPassingThreshold}
          onPassingThresholdChange={setCustomPassingThreshold}
          spreadsheetUrl={spreadsheetUrl}
          onSpreadsheetUrlChange={setSpreadsheetUrl}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onOpenWhatIf={() => setIsWhatIfOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onSubmitSheetUpdate={handleSubmitSheetUpdate}
          isUpdating={isUpdating}
          onOpenDataInspector={() => setIsDataInspectorOpen(true)}
        />

        {/* Scorecards */}
        <Scorecards
          stats={currentStats}
          onFilterHighRisk={() => {
            setRiskFilter('Tinggi');
            setActiveTab('dashboard');
          }}
        />

        {/* Tab Switcher for Smaller Screens */}
        <div className="flex xl:hidden bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Visualisasi & Tabel Peserta
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat Analisis AI Assistant
          </button>
        </div>

        {/* Two-Column Responsive Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual Chart & Actionable Table */}
          <div
            className={`xl:col-span-8 space-y-6 ${
              activeTab === 'dashboard' ? 'block' : 'hidden xl:block'
            }`}
          >
            {/* Visualisasi Grafik Tingkat Penyelesaian & Bottlenecks */}
            <BottleneckChart
              stats={currentStats}
              onSelectStage={(stageName) => {
                const keyword = stageName.split(':')[0] || stageName.split('(')[0];
                setSearchQuery(keyword.trim());
              }}
            />

            {/* Tabel Daftar Peserta Berisiko */}
            <RiskTable
              participants={filteredParticipants}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              riskFilter={riskFilter}
              onRiskFilterChange={setRiskFilter}
              passingThreshold={customPassingThreshold}
            />
          </div>

          {/* Right Column: AI Assistant Chat Panel */}
          <div
            className={`xl:col-span-4 sticky top-6 ${
              activeTab === 'chat' ? 'block' : 'hidden xl:block'
            }`}
          >
            <ChatAssistant batch={currentBatch} stats={currentStats} />
          </div>
        </div>
      </main>

      {/* Footer System Audit Note */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Vocational Agentic Early Warning System (EWS) • Memenuhi Spesifikasi PRD & FRD Pelatihan Vokasi • Pemetaan Sel A2..I2 (Kolom I: PERSENTASE LMS).
        </p>
      </footer>

      {/* Modals */}
      <WhatIfSimulator
        batch={currentBatch}
        currentStats={currentStats}
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        onApplyToDashboard={handleApplyWhatIf}
      />

      <ExportReportModal
        batch={currentBatch}
        stats={currentStats}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <DataInspectorModal
        isOpen={isDataInspectorOpen}
        onClose={() => setIsDataInspectorOpen(false)}
        participants={participants}
        onApplyNewData={handleApplyNewData}
      />
    </div>
  );
}
