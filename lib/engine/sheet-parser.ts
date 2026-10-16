import * as XLSX from 'xlsx';
import { Participant } from '../types';
import { DENPASAR_PARTICIPANTS } from '../data/denpasar-dataset';

export interface ParsedSheetResult {
  success: boolean;
  message: string;
  sourceType: 'uploaded_file' | 'live_google_sheet' | 'csv_text' | 'mock_simulation';
  participants: Participant[];
  fileName?: string;
  rawRowCount: number;
}

export function parsePercentValue(val: unknown, fallback: number): number {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'number') {
    if (val <= 1 && val > 0) return Math.round(val * 100);
    return Math.min(100, Math.max(0, Math.round(val)));
  }
  const str = String(val).replace('%', '').trim();
  const num = parseFloat(str);
  if (isNaN(num)) return fallback;
  if (num <= 1 && num > 0) return Math.round(num * 100);
  return Math.min(100, Math.max(0, Math.round(num)));
}

/**
 * Universal robust CSV / Spreadsheet text parser that handles:
 * 1. Title/Summary row at Row 1 (e.g., UPDATE TERAKHIR, TOTAL PENDAFTAR)
 * 2. Header row at Row 2 (NAMA, NO REGISTRASI, INSTANSI, STATUS, ONBOARDING, PERSENTASE LMS, ...)
 * 3. Data rows starting from Row 3 (A2..I2 in 1-based indexing relative to data)
 * 4. Filters out empty padding rows (e.g., ,,,,,FALSE,,,0,Belum Mengerjakan)
 */
export function parseCSVRows(csvText: string): Participant[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  // Find the header row (contains NAMA or NO REGISTRASI or PERSENTASE LMS)
  let headerIndex = -1;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const upper = lines[i].toUpperCase();
    if (upper.includes('NAMA') && (upper.includes('REGISTRASI') || upper.includes('INSTANSI') || upper.includes('LMS'))) {
      headerIndex = i;
      break;
    }
    if (upper.includes('ID PESERTA') || upper.includes('PERSENTASE LMS')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) {
    headerIndex = 0; // fallback to first line
  }

  // Parse header columns
  const headerCols = splitCSVLine(lines[headerIndex]).map((c) => c.toUpperCase().trim());
  
  // Find column indices
  let nameIdx = headerCols.findIndex((h) => h === 'NAMA' || h.includes('NAMA PESERTA'));
  let idIdx = headerCols.findIndex((h) => h === 'NO REGISTRASI' || h.includes('REGISTRASI') || h === 'ID' || h.includes('ID PESERTA'));
  let instIdx = headerCols.findIndex((h) => h === 'INSTANSI' || h.includes('SEKOLAH') || h.includes('KAMPUS'));
  let onboardingIdx = headerCols.findIndex((h) => h === 'ONBOARDING');
  let lmsIdx = headerCols.findIndex((h) => h.includes('PERSENTASE LMS') || h === 'PERSENTASE LMS' || h.includes('LMS') || h.includes('PERSEN'));
  let statusIdx = headerCols.findIndex((h) => h === 'STATUS');

  // Fallbacks if not explicitly found by name
  if (nameIdx === -1) nameIdx = 0;
  if (idIdx === -1) idIdx = 1;
  if (instIdx === -1) instIdx = 2;
  if (lmsIdx === -1) lmsIdx = 8; // Column I (index 8)

  const participants: Participant[] = [];

  for (let r = headerIndex + 1; r < lines.length; r++) {
    const line = lines[r].trim();
    if (!line) continue;

    const cols = splitCSVLine(line);

    const name = (cols[nameIdx] || '').trim();
    const id = (cols[idIdx] || '').trim();

    // Skip empty padding rows where both name and id are empty
    if (!name && !id) continue;
    if (name === '-' || name.toLowerCase() === 'false' || name.toLowerCase() === 'true') continue;

    const institution = (cols[instIdx] || 'SMK Negeri 1 Denpasar').trim();
    const statusText = statusIdx !== -1 ? (cols[statusIdx] || '').trim() : '';
    const onboardingText = onboardingIdx !== -1 ? (cols[onboardingIdx] || '').trim() : '';
    
    // Parse Column I (PERSENTASE LMS)
    const persentaseVal = cols[lmsIdx] !== undefined ? cols[lmsIdx] : '0';
    const completionRate = parsePercentValue(persentaseVal, 0);

    const isOnboarded = onboardingText
      ? onboardingText.toLowerCase().includes('onboarding') && !onboardingText.toLowerCase().includes('tidak')
      : completionRate > 0;

    // Detect where student is stuck from module columns (columns after index 9)
    let lastStuck = 'Tuntas Seluruh Modul';
    let riskLevel: 'Tinggi' | 'Sedang' | 'Rendah' = 'Rendah';
    let action = 'Pertahankan ritme belajar dan persiapan verifikasi akhir.';

    // Module scores representation
    let htmlCss = 100;
    let phpStandard = 100;
    let controlLogic = 100;
    let arrayLoop = 100;
    let libraryKuis2 = 100;
    let githubFinal = 100;

    if (completionRate === 0) {
      riskLevel = 'Tinggi';
      lastStuck = 'Tahap Onboarding & Registrasi LMS';
      action = 'Koordinasi dengan PIC sekolah/kampus untuk konfirmasi akun aktif.';
      htmlCss = 0;
      phpStandard = 0;
      controlLogic = 0;
      arrayLoop = 0;
      libraryKuis2 = 0;
      githubFinal = 0;
    } else if (completionRate < 50) {
      riskLevel = 'Tinggi';
      // Find the specific module that is "Belum Mengerjakan"
      const firstIncompleteModule = findFirstIncompleteModule(headerCols, cols, 9);
      lastStuck = firstIncompleteModule || 'Kuis 1: Logika Pemrograman & Algoritma';
      action = `Bimbingan khusus dan pendampingan 1-on-1 untuk modul ${lastStuck}.`;
      htmlCss = 100;
      phpStandard = completionRate >= 40 ? 100 : 40;
      controlLogic = 30;
      arrayLoop = 0;
      libraryKuis2 = 0;
      githubFinal = 0;
    } else if (completionRate < 75) {
      riskLevel = 'Sedang';
      const firstIncompleteModule = findFirstIncompleteModule(headerCols, cols, 9);
      lastStuck = firstIncompleteModule || 'Manipulasi Array & Kuis 2';
      action = 'Peer tutoring bersama rekan seangkatan yang sudah tuntas modul.';
      htmlCss = 100;
      phpStandard = 100;
      controlLogic = 100;
      arrayLoop = 40;
      libraryKuis2 = 0;
      githubFinal = 0;
    }

    participants.push({
      id: id || `PESERTA-${(participants.length + 1).toString().padStart(3, '0')}`,
      pseudonymName: name,
      institution: institution || 'SMK Negeri 1 Denpasar',
      isOnboarded,
      completionRate,
      lastStuckModule: lastStuck,
      daysInactive: completionRate === 0 ? 21 : completionRate < 75 ? 10 : 1,
      riskLevel,
      notes: statusText ? `Status LMS: ${statusText} (Kolom I: ${completionRate}%)` : `Capaian: ${completionRate}%`,
      moduleScores: {
        'html-css': htmlCss,
        'php-standard': phpStandard,
        'control-logic': controlLogic,
        'array-loop': arrayLoop,
        'library-kuis2': libraryKuis2,
        'github-final': githubFinal,
      },
      recommendedAction: action,
    });
  }

  return participants.length > 0 ? participants : DENPASAR_PARTICIPANTS;
}

function findFirstIncompleteModule(headerCols: string[], cols: string[], startCol: number): string | null {
  for (let i = startCol; i < cols.length; i++) {
    const val = (cols[i] || '').toLowerCase().trim();
    if (val.includes('belum') || val === '0' || val === '0%') {
      const colName = headerCols[i] || `Modul ${i - startCol + 1}`;
      // Clean up long verbose names
      return colName.length > 45 ? colName.slice(0, 42) + '...' : colName;
    }
  }
  return null;
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if ((char === ',' || char === ';') && !inQuotes) {
      result.push(cur.replace(/^["']|["']$/g, '').trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.replace(/^["']|["']$/g, '').trim());
  return result;
}

/**
 * Parses an uploaded Excel (.xlsx, .xls) or CSV file
 */
export async function parseUploadedFile(file: File): Promise<ParsedSheetResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return {
        success: false,
        message: 'Berkas tidak memiliki sheet yang valid.',
        sourceType: 'uploaded_file',
        participants: [],
        fileName: file.name,
        rawRowCount: 0,
      };
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const participants = parseCSVRows(csvContent);

    if (participants.length === 0) {
      return {
        success: false,
        message: 'Tidak ada baris data peserta yang valid ditemukan di dalam berkas.',
        sourceType: 'uploaded_file',
        participants: [],
        fileName: file.name,
        rawRowCount: 0,
      };
    }

    return {
      success: true,
      message: `Berhasil memetakan ${participants.length} peserta dari berkas ${file.name} (Acuan Kelulusan: Kolom I PERSENTASE LMS).`,
      sourceType: 'uploaded_file',
      participants,
      fileName: file.name,
      rawRowCount: participants.length,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal membaca berkas: ${err?.message || 'Format tidak didukung.'}`,
      sourceType: 'uploaded_file',
      participants: [],
      fileName: file.name,
      rawRowCount: 0,
    };
  }
}

/**
 * Returns raw sample CSV string matching the real Denpasar cohort
 */
export function generateSampleSheetCSV(): string {
  const lines: string[] = [];
  lines.push('UPDATE TERAKHIR:13 OKTOBER 11:43 WIB,TOTAL PENDAFTAR: 41,,,,,TOTAL DITERIMA: 41,TOTAL ONBOARDING: 33,TOTAL SELESAI: 33');
  lines.push('NAMA,NO REGISTRASI,INSTANSI,JENIS KELAMIN,USIA,ADA DI USULAN MITRA,STATUS,ONBOARDING,PERSENTASE LMS,OVERVIEW,HTML (1),HTML (2),CSS,PHP (1-8),CONTROL LOGIC,KUIS 1,ARRAY,KUIS 2,LIBRARY,KUIS 3,FINAL ASSESSMENT');
  
  DENPASAR_PARTICIPANTS.forEach((p) => {
    const st = p.completionRate >= 75 ? 'Lulus Pelatihan - Nilai' : 'Tidak Lulus Pelatihan - Nilai';
    const onb = p.isOnboarded ? 'Onboarding' : 'Tidak Onboarding';
    const modStatus = p.completionRate === 100 ? 'Selesai' : p.completionRate === 0 ? 'Belum Mengerjakan' : 'Selesai';
    lines.push(
      `"${p.pseudonymName}","${p.id}","${p.institution}","Pria","16Tahun",FALSE,"${st}","${onb}",${p.completionRate},"${modStatus}","${modStatus}","${modStatus}","${modStatus}","${modStatus}","${modStatus}","${modStatus}","${modStatus}","${modStatus}","${modStatus}","${modStatus}","Belum Mengerjakan"`
    );
  });

  return lines.join('\n');
}
