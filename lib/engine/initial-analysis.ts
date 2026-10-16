import { SheetAnalysisResponse } from '@/app/api/analyze-sheet/route';

export const INITIAL_CELL_ANALYSIS: SheetAnalysisResponse = {
  executive_summary:
    'Analisis cerdas sel data memvalidasi rekapitulasi pelatihan FAWD-SMKN1-DPS dari sumber Spreadsheet (Update: 13 Oktober 11:43 WIB). Berdasarkan acuan Kolom I (PERSENTASE LMS), sebanyak 33 dari 41 peserta terdaftar (80.5%) telah tuntas mencapai capaian 100%, melampaui target kohort 80%. Pelatihan berstatus Waspada akibat 8 peserta berisiko (6 belum onboarding dengan capaian 0% dan 2 peserta terhenti di materi Kuis 1 serta Manipulasi Array).',
  key_findings: [
    'Sebanyak 33 peserta (80.5%) telah menuntaskan seluruh materi hingga modul akhir dengan nilai sel Kolom I (PERSENTASE LMS) mencapai 100% dan status Lulus Pelatihan - Nilai.',
    'Terdapat 6 peserta dengan status "Tidak Onboarding" dan nilai sel Kolom I sebesar 0% yang sama sekali belum mengerjakan modul orientasi maupun HTML.',
    'Terdeteksi 2 peserta terhenti di tengah kurikulum: Ni Kadek Ratna Ayu M. (capaian 41%, terhenti di materi Control Program/Kuis 1) dan Putu Chesta Radithya W. (capaian 47%, terhenti di materi Manipulasi Array).',
  ],
  cell_diagnostics: [
    {
      column: 'Kolom I (Cell I2:I42)',
      module_or_field: 'PERSENTASE LMS (Acuan Kelulusan)',
      pattern_observed:
        'Sebanyak 33 sel bernilai 100% (Lulus), 6 sel bernilai 0% (Belum Aktif), 1 sel bernilai 41%, dan 1 sel bernilai 47%.',
      affected_count: 41,
      severity: 'waspada',
    },
    {
      column: 'Kolom F (Kuis 1)',
      module_or_field: 'MENGGUNAKAN TIPE DATA DAN CONTROL PROGRAM / KUIS 1',
      pattern_observed:
        'Titik hambatan transisi pertama: peserta menguasai HTML, CSS, dan PHP dasar (1-8), namun mengalami kendala saat masuk ke materi struktur kontrol dan Kuis 1.',
      affected_count: 7,
      severity: 'kritis',
    },
    {
      column: 'Kolom G & H (Array & Kuis 2)',
      module_or_field: 'MEMBUAT PROGRAM MENGGUNAKAN ARRAY',
      pattern_observed:
        'Hambatan transisi kedua: peserta berhasil melewati Kuis 1 namun terhenti pada pemahaman array multi dimensi dan nested loop.',
      affected_count: 8,
      severity: 'waspada',
    },
  ],
  institution_patterns: [
    {
      institution: 'SMK Negeri 1 Denpasar',
      observation:
        'Kohort tunggal menunjukkan dominasi kelulusan tinggi (80.5% peserta tuntas 100%). Intervensi difokuskan secara lokal kepada 8 peserta berisiko.',
      completion_trend: 'Tinggi (80.5% Tuntas 100%)',
    },
  ],
  priority_interventions: [
    {
      priority: 'Tinggi',
      target_module: 'Onboarding & Aktivasi Akun LMS',
      recommended_action:
        'Hubungi 6 peserta dengan capaian 0% (I Gusti Putu Lanang S., Yuven Ganny N., Anak Agung Bagus M., I Kadek Narindra W., Putu Kirandiya P., I Made Gede A.) untuk klarifikasi kendala akses.',
      target_recipients: '6 Peserta Status Belum Onboarding',
    },
    {
      priority: 'Tinggi',
      target_module: 'Control Program & Kuis 1',
      recommended_action:
        'Berikan pendampingan 1-on-1 kepada Ni Kadek Ratna Ayu M. (capaian 41%) untuk menyelesaikan modul struktur kontrol dan attempt Kuis 1.',
      target_recipients: '1 Peserta Terhenti di Kuis 1',
    },
    {
      priority: 'Sedang',
      target_module: 'Manipulasi Array & Perulangan PHP',
      recommended_action:
        'Sesi asistensi teknis bersama mentor untuk Putu Chesta Radithya W. (capaian 47%) terkait topik array asosiatif & perulangan foreach.',
      target_recipients: '1 Peserta Terhenti di Materi Array',
    },
  ],
  data_quality_audit: {
    cell_mapping_status: 'Valid (Baris 2 Header, Baris 3..43 Data Peserta)',
    passing_metric_column: 'Kolom I (PERSENTASE LMS)',
    evaluated_cells_count: 41 * 43,
  },
};
