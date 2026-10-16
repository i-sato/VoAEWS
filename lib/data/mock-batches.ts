import { TrainingBatch, Participant, StageProgress } from '../types';

export const FAWD_STAGES: StageProgress[] = [
  { stageId: 'stage-1', stageName: 'Tahap Alat Bantu (IDE, Git, Browser Tools)', category: 'Tools', order: 1, weightPercent: 10 },
  { stageId: 'stage-2', stageName: 'Tahap Desain UI & Wireframe Figma', category: 'Figma', order: 2, weightPercent: 10 },
  { stageId: 'stage-3', stageName: 'Kuis 1: Logika Pemrograman & Algoritma', category: 'Kuis', order: 3, weightPercent: 10 },
  { stageId: 'stage-4', stageName: 'Implementasi Kode: PHP Dasar & Struktur HTML', category: 'Coding', order: 4, weightPercent: 15 },
  { stageId: 'stage-5', stageName: 'Kuis 2: Sintaks Backend & Penanganan Form', category: 'Kuis', order: 5, weightPercent: 10 },
  { stageId: 'stage-6', stageName: 'Integrasi Basis Data & CRUD API', category: 'Coding', order: 6, weightPercent: 15 },
  { stageId: 'stage-7', stageName: 'Kuis 3: Arsitektur MVC & Validasi Data', category: 'Kuis', order: 7, weightPercent: 10 },
  { stageId: 'stage-8', stageName: 'Kuis 4: Otentikasi & Keamanan Web', category: 'Kuis', order: 8, weightPercent: 10 },
  { stageId: 'stage-9', stageName: 'Ujian Akhir: Proyek Vokasi Mandiri', category: 'Ujian', order: 9, weightPercent: 10 },
];

const INSTITUTIONS = [
  'Politeknik Negeri Jakarta',
  'Sekolah Vokasi UGM',
  'Politeknik Astra',
  'Politeknik Negeri Malang',
  'Politeknik Elektronika Negeri Surabaya',
  'Politeknik Manufaktur Bandung',
  'Sekolah Vokasi IPB',
  'Politeknik Negeri Medan',
];

const FIRST_NAMES = ['Ahmad', 'Budi', 'Chandra', 'Dewi', 'Eko', 'Fajar', 'Gita', 'Hendra', 'Indah', 'Joko', 'Kartika', 'Lestari', 'Maulana', 'Nur', 'Oki', 'Putri', 'Rian', 'Siti', 'Taufik', 'Utami', 'Wahyu', 'Yusuf', 'Zahra'];
const LAST_NAMES = ['Pratama', 'Santoso', 'Wijaya', 'Kusuma', 'Saputra', 'Hidayat', 'Siregar', 'Wibowo', 'Nugroho', 'Lestari', 'Ramadhan', 'Utomo', 'Purnama'];

// 11 stuck participants explicitly specified in user prompt:
// 6 stuck at Kuis 1, 5 stuck at PHP/HTML implementation
const STUCK_PARTICIPANTS: Array<{
  id: string;
  pseudonym: string;
  inst: string;
  module: string;
  stageId: string;
  completion: number;
  inactive: number;
  notes: string;
  action: string;
}> = [
  {
    id: 'MHS-014',
    pseudonym: 'Aditya P. (Pseudonim)',
    inst: 'Politeknik Negeri Jakarta',
    module: 'Kuis 1: Logika Pemrograman & Algoritma',
    stageId: 'stage-3',
    completion: 22,
    inactive: 12,
    notes: 'Skor Kuis 1 di bawah passing grade (42/100), belum mengulang attempt kedua.',
    action: 'Jadwalkan sesi remedial terbimbing & modul pengantar logika dasar.',
  },
  {
    id: 'MHS-029',
    pseudonym: 'Bagus S. (Pseudonim)',
    inst: 'Sekolah Vokasi UGM',
    module: 'Kuis 1: Logika Pemrograman & Algoritma',
    stageId: 'stage-3',
    completion: 25,
    inactive: 10,
    notes: 'Mengalami kendala pemahaman looping & conditional, terhenti di kuis logika.',
    action: 'Draf mentoring 1-on-1 dengan asisten lab topik struktur kontrol.',
  },
  {
    id: 'MHS-037',
    pseudonym: 'Citra W. (Pseudonim)',
    inst: 'Politeknik Astra',
    module: 'Kuis 1: Logika Pemrograman & Algoritma',
    stageId: 'stage-3',
    completion: 28,
    inactive: 14,
    notes: 'Aktivitas LMS berhenti sejak 14 hari lalu setelah gagal submit Kuis 1.',
    action: 'Kirim notifikasi asistensi via koordinator kampus asal Politeknik Astra.',
  },
  {
    id: 'MHS-053',
    pseudonym: 'Dian K. (Pseudonim)',
    inst: 'Politeknik Manufaktur Bandung',
    module: 'Kuis 1: Logika Pemrograman & Algoritma',
    stageId: 'stage-3',
    completion: 24,
    inactive: 9,
    notes: 'Percobaan submit kuis timeout karena koneksi lokal tidak stabil.',
    action: 'Buka slot submit kuis khusus dengan batas waktu penyesuaian.',
  },
  {
    id: 'MHS-068',
    pseudonym: 'Fikri H. (Pseudonim)',
    inst: 'Politeknik Negeri Malang',
    module: 'Kuis 1: Logika Pemrograman & Algoritma',
    stageId: 'stage-3',
    completion: 26,
    inactive: 11,
    notes: 'Terhambat di soal logika relasional dan perulangan nested loop.',
    action: 'Berikan lembar kerja latihan mandiri berorientasi studi kasus visual.',
  },
  {
    id: 'MHS-077',
    pseudonym: 'Gilang R. (Pseudonim)',
    inst: 'Sekolah Vokasi IPB',
    module: 'Kuis 1: Logika Pemrograman & Algoritma',
    stageId: 'stage-3',
    completion: 25,
    inactive: 8,
    notes: 'Belum membuka materi penunjang modul 3 pasca evaluasi mingguan.',
    action: 'Follow-up draf konfirmasi kehadiran untuk sesi sinkronous tanya jawab.',
  },
  {
    id: 'MHS-088',
    pseudonym: 'Hadi U. (Pseudonim)',
    inst: 'Politeknik Elektronika Negeri Surabaya',
    module: 'Implementasi Kode: PHP Dasar & Struktur HTML',
    stageId: 'stage-4',
    completion: 41,
    inactive: 9,
    notes: 'Error setup local server (Apache/PHP environment) di perangkat praktikum.',
    action: 'Sediakan modul panduan setup Docker/XAMPP alternatif berbasis cloud sandbox.',
  },
  {
    id: 'MHS-094',
    pseudonym: 'Indra M. (Pseudonim)',
    inst: 'Politeknik Negeri Medan',
    module: 'Implementasi Kode: PHP Dasar & Struktur HTML',
    stageId: 'stage-4',
    completion: 38,
    inactive: 11,
    notes: 'Tugas pengiriman form POST/GET mengalami fatal error sintaks PHP.',
    action: 'Sesi debugging bareng instruktur topik Form Handling & Superglobals.',
  },
  {
    id: 'MHS-102',
    pseudonym: 'Jafar L. (Pseudonim)',
    inst: 'Politeknik Astra',
    module: 'Implementasi Kode: PHP Dasar & Struktur HTML',
    stageId: 'stage-4',
    completion: 44,
    inactive: 7,
    notes: 'File repositori Git tidak ter-commit dengan benar, tugas praktikum kosong.',
    action: 'Panduan re-sync repositori Git praktikum dan re-submit form.',
  },
  {
    id: 'MHS-111',
    pseudonym: 'Kurnia P. (Pseudonim)',
    inst: 'Sekolah Vokasi UGM',
    module: 'Implementasi Kode: PHP Dasar & Struktur HTML',
    stageId: 'stage-4',
    completion: 40,
    inactive: 13,
    notes: 'Belum menyelesaikan latihan sintaks array asosiatif & integrasi tag HTML.',
    action: 'Sediakan video walkthrough 15 menit implementasi form dinamis.',
  },
  {
    id: 'MHS-119',
    pseudonym: 'Lukman N. (Pseudonim)',
    inst: 'Politeknik Negeri Jakarta',
    module: 'Implementasi Kode: PHP Dasar & Struktur HTML',
    stageId: 'stage-4',
    completion: 42,
    inactive: 8,
    notes: 'Mengalami kendala pemisahan logika backend PHP dan template HTML.',
    action: 'Bimbingan peer-tutoring dengan rekan seangkatan yang sudah tuntas.',
  },
];

function generateFAWDParticipants(): Participant[] {
  const participants: Participant[] = [];
  const stuckMap = new Map<string, typeof STUCK_PARTICIPANTS[0]>();
  STUCK_PARTICIPANTS.forEach((s) => stuckMap.set(s.id, s));

  let nonOnboardedCount = 0;

  for (let i = 1; i <= 124; i++) {
    const id = `MHS-${i.toString().padStart(3, '0')}`;
    const stuck = stuckMap.get(id);

    if (stuck) {
      // 1 of 11 critical stuck participants (onboarded)
      participants.push({
        id: stuck.id,
        pseudonymName: stuck.pseudonym,
        institution: stuck.inst,
        isOnboarded: true,
        completionRate: stuck.completion,
        lastStuckModule: stuck.module,
        daysInactive: stuck.inactive,
        riskLevel: 'Tinggi',
        notes: stuck.notes,
        moduleScores: {
          'stage-1': 95,
          'stage-2': 90,
          'stage-3': stuck.stageId === 'stage-3' ? 40 : 85,
          'stage-4': stuck.stageId === 'stage-4' ? 35 : 0,
          'stage-5': 0,
          'stage-6': 0,
          'stage-7': 0,
          'stage-8': 0,
          'stage-9': 0,
        },
        recommendedAction: stuck.action,
      });
    } else {
      // 1 of 113 on-track participants
      // Exactly 10 participants are pending LMS profile verification (non-onboarded)
      // leaving exactly 114 total onboarded (11 stuck + 103 on-track = 114 onboarded)
      const isPendingOnboard = nonOnboardedCount < 10 && i > 110;
      if (isPendingOnboard) {
        nonOnboardedCount++;
      }

      const fn = FIRST_NAMES[(i * 3 + 2) % FIRST_NAMES.length];
      const ln = LAST_NAMES[(i * 5 + 1) % LAST_NAMES.length];
      const inst = INSTITUTIONS[(i * 7) % INSTITUTIONS.length];
      const completion = 78 + (i % 22); // between 78% and 99% (all >= 75% passing threshold)
      const inactiveDays = i % 4;

      participants.push({
        id,
        pseudonymName: `${fn} ${ln[0]}. (Pseudonim)`,
        institution: inst,
        isOnboarded: !isPendingOnboard,
        completionRate: completion,
        lastStuckModule: completion >= 95 ? 'Tuntas Seluruh Modul' : 'Ujian Akhir: Proyek Vokasi Mandiri',
        daysInactive: inactiveDays,
        riskLevel: 'Rendah',
        notes: completion >= 95
          ? 'Performa sangat baik, konsisten tuntas sebelum deadline.'
          : 'Sedang mengerjakan tahap akhir portofolio vokasi.',
        moduleScores: {
          'stage-1': 100,
          'stage-2': 100,
          'stage-3': 90 + (i % 10),
          'stage-4': 88 + (i % 12),
          'stage-5': 85 + (i % 15),
          'stage-6': 85 + (i % 15),
          'stage-7': 80 + (i % 18),
          'stage-8': completion >= 90 ? 90 : 75,
          'stage-9': completion >= 95 ? 95 : 60,
        },
        recommendedAction: isPendingOnboard
          ? 'Verifikasi finalisasi profil LMS peserta berprestasi baik.'
          : 'Lanjutkan monitoring reguler dan persiapan verifikasi portofolio kelulusan.',
      });
    }
  }

  return participants;
}

export const MOCK_BATCHES: TrainingBatch[] = [
  {
    id: 'fawd-vbl-12825',
    code: 'FAWD VBL 12825',
    name: 'Frontend & Web Development (FAWD VBL 12825)',
    category: 'Rekayasa Perangkat Lunak',
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    targetPassingRate: 80, // 80% passing target requested by user
    passingThreshold: 75, // min completion % required to pass
    stages: FAWD_STAGES,
    participants: generateFAWDParticipants(),
    lastSyncTime: '2026-10-15T20:25:00Z',
  },
  {
    id: 'uiux-bootcamp-402',
    code: 'UIUX-VOK-402',
    name: 'Desain Pengalaman Pengguna (UI/UX Bootcamp Cohort 4)',
    category: 'Desain Digital',
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1UIUX-Sample-VBL-Sheet-Cohort4-Demo2026/edit',
    startDate: '2026-09-15',
    endDate: '2026-11-15',
    targetPassingRate: 85,
    passingThreshold: 75,
    stages: [
      { stageId: 'ux-1', stageName: 'Dasar Design Thinking & Riset Pengguna', category: 'Tools', order: 1, weightPercent: 15 },
      { stageId: 'ux-2', stageName: 'User Persona & Journey Mapping', category: 'Figma', order: 2, weightPercent: 15 },
      { stageId: 'ux-3', stageName: 'Wireframing & Information Architecture', category: 'Figma', order: 3, weightPercent: 20 },
      { stageId: 'ux-4', stageName: 'High-Fidelity Prototyping Figma', category: 'Figma', order: 4, weightPercent: 25 },
      { stageId: 'ux-5', stageName: 'Usability Testing & Evaluasi Desain', category: 'Ujian', order: 5, weightPercent: 25 },
    ],
    participants: [
      // Mock with high pass rate -> Status: Aman
      ...Array.from({ length: 90 }, (_, i) => ({
        id: `UX-${(i + 1).toString().padStart(3, '0')}`,
        pseudonymName: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 2) % LAST_NAMES.length][0]}. (Pseudonim)`,
        institution: INSTITUTIONS[i % INSTITUTIONS.length],
        isOnboarded: true,
        completionRate: 82 + (i % 16),
        lastStuckModule: 'Usability Testing & Evaluasi Desain',
        daysInactive: i % 3,
        riskLevel: 'Rendah' as const,
        notes: 'Progres sesuai timeline kurikulum vokasi.',
        moduleScores: { 'ux-1': 100, 'ux-2': 95, 'ux-3': 90, 'ux-4': 85, 'ux-5': 80 },
        recommendedAction: 'Persiapan sesi showcase desain akhir.',
      })),
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `UX-${(91 + i).toString().padStart(3, '0')}`,
        pseudonymName: `${FIRST_NAMES[(i + 5) % FIRST_NAMES.length]} ${LAST_NAMES[(i + 3) % LAST_NAMES.length][0]}. (Pseudonim)`,
        institution: INSTITUTIONS[(i + 4) % INSTITUTIONS.length],
        isOnboarded: true,
        completionRate: 45 + (i * 4),
        lastStuckModule: 'High-Fidelity Prototyping Figma',
        daysInactive: 7 + i,
        riskLevel: 'Sedang' as const,
        notes: 'Mengalami kendala auto-layout dan component variables di Figma.',
        moduleScores: { 'ux-1': 100, 'ux-2': 90, 'ux-3': 60, 'ux-4': 40, 'ux-5': 0 },
        recommendedAction: 'Workshop bedah komponen Figma lanjutan.',
      })),
    ],
    lastSyncTime: '2026-10-15T18:10:00Z',
  },
];
