import { Participant, TrainingBatch } from '../types';
import { FAWD_STAGES, MOCK_BATCHES } from '../data/mock-batches';

/**
 * Parses Google Spreadsheet data or CSV content based on cell mapping specification:
 * - Data starts at Row 2 (A2, B2, C2, etc.)
 * - Column A: ID Peserta
 * - Column B: Nama Peserta (dipseudonimkan)
 * - Column C: Instansi / Asal Kampus
 * - Column D: Tahap Alat Bantu (IDE, Git, Browser Tools)
 * - Column E: Tahap Desain UI (Figma & Wireframe)
 * - Column F: Kuis 1: Logika Pemrograman & Algoritma
 * - Column G: Implementasi Kode: PHP Dasar & Struktur HTML
 * - Column H: Kuis 2 - 4 & Evaluasi Akhir
 * - Column I: "PERSENTASE LMS" (Cell I2) -> Acuan persentase kelulusan/capaian peserta
 */
export interface ParsedSheetResult {
  success: boolean;
  message: string;
  sourceType: 'live_google_sheet' | 'csv_text' | 'mock_simulation';
  participants: Participant[];
  rawRowCount: number;
}

export function parseCSVRows(csvText: string): Participant[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const participants: Participant[] = [];

  // Data begins at row index 1 (corresponding to Row 2: A2, B2, ...)
  for (let rowIndex = 1; rowIndex < lines.length; rowIndex++) {
    const line = lines[rowIndex].trim();
    if (!line) continue;

    // Handle CSV comma or semicolon splitting
    const cols = line.includes(';') ? line.split(';') : line.split(',');
    const cleanCols = cols.map((c) => c.replace(/^["']|["']$/g, '').trim());

    const id = cleanCols[0] || `MHS-${rowIndex.toString().padStart(3, '0')}`;
    const name = cleanCols[1] || `Peserta ${rowIndex} (Pseudonim)`;
    const institution = cleanCols[2] || 'Politeknik Vokasi Mitra';

    // Module scores in columns D, E, F, G, H
    const scoreD = parsePercentValue(cleanCols[3], 100);
    const scoreE = parsePercentValue(cleanCols[4], 100);
    const scoreF = parsePercentValue(cleanCols[5], 85);
    const scoreG = parsePercentValue(cleanCols[6], 80);
    const scoreH = parsePercentValue(cleanCols[7], 75);

    // Column I (Cell I2): PERSENTASE LMS
    const persentaseLMS = parsePercentValue(cleanCols[8], 0);

    // Determine stuck module
    let lastStuck = 'Tuntas Seluruh Modul';
    let riskLevel: 'Tinggi' | 'Sedang' | 'Rendah' = 'Rendah';
    let action = 'Monitoring reguler progres kurikulum.';

    if (persentaseLMS < 50 || scoreF < 60 || scoreG < 60) {
      riskLevel = 'Tinggi';
      if (scoreF < 60) {
        lastStuck = 'Kuis 1: Logika Pemrograman & Algoritma';
        action = 'Sesi remedial terbimbing logika & struktur kontrol dengan asisten lab.';
      } else if (scoreG < 60) {
        lastStuck = 'Implementasi Kode: PHP Dasar & Struktur HTML';
        action = 'Klinik debugging sintaks PHP & penyiapan cloud sandbox alternatif.';
      } else {
        lastStuck = 'Evaluasi Tengah Periode';
        action = 'Pendampingan 1-on-1 koordinator pelatihan.';
      }
    } else if (persentaseLMS < 75) {
      riskLevel = 'Sedang';
      lastStuck = 'Kuis 2: Sintaks Backend & Penanganan Form';
      action = 'Bimbingan peer-tutoring materi praktikum.';
    }

    participants.push({
      id,
      pseudonymName: name.includes('Pseudonim') ? name : `${name} (Pseudonim)`,
      institution,
      isOnboarded: persentaseLMS > 0,
      completionRate: persentaseLMS,
      lastStuckModule: lastStuck,
      daysInactive: persentaseLMS < 50 ? 9 : 2,
      riskLevel,
      notes: `Data sinkron dari Kolom I (PERSENTASE LMS: ${persentaseLMS}%).`,
      moduleScores: {
        'stage-1': scoreD,
        'stage-2': scoreE,
        'stage-3': scoreF,
        'stage-4': scoreG,
        'stage-5': scoreH,
        'stage-6': scoreH,
        'stage-7': scoreH,
        'stage-8': scoreH,
        'stage-9': persentaseLMS >= 90 ? 95 : 60,
      },
      recommendedAction: action,
    });
  }

  return participants;
}

function parsePercentValue(val: string | undefined, fallback: number): number {
  if (!val) return fallback;
  const cleaned = val.replace('%', '').trim();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return fallback;
  // If user entered e.g. 0.85 instead of 85
  if (num <= 1 && num > 0) return Math.round(num * 100);
  return Math.min(100, Math.max(0, Math.round(num)));
}

/**
 * Generate sample CSV text representing the exact Google Sheet format for FAWD VBL 12825
 * starting at A2, B2... with Column I = "PERSENTASE LMS"
 */
export function generateSampleSheetCSV(): string {
  const header = 'ID Peserta,Nama Peserta,Instansi,Tahap Tools,Tahap Figma,Kuis 1 Logika,PHP HTML Dasar,Kuis Lanjutan,PERSENTASE LMS';
  const rows: string[] = [header];

  const batch = MOCK_BATCHES[0];
  batch.participants.forEach((p) => {
    const s1 = p.moduleScores['stage-1'] ?? 100;
    const s2 = p.moduleScores['stage-2'] ?? 100;
    const s3 = p.moduleScores['stage-3'] ?? 85;
    const s4 = p.moduleScores['stage-4'] ?? 85;
    const s5 = p.moduleScores['stage-5'] ?? 85;
    rows.push(
      `"${p.id}","${p.pseudonymName}","${p.institution}",${s1}%,${s2}%,${s3}%,${s4}%,${s5}%,${p.completionRate}%`
    );
  });

  return rows.join('\n');
}
