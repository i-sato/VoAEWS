import { TrainingBatch } from '../types';
import { DENPASAR_PARTICIPANTS, DENPASAR_STAGES } from './denpasar-dataset';

export { DENPASAR_STAGES as FAWD_STAGES };

export const MOCK_BATCHES: TrainingBatch[] = [
  {
    id: 'fawd-smkn1-denpasar',
    code: 'FAWD-SMKN1-DPS',
    name: 'Frontend & Web Development (SMK Negeri 1 Denpasar)',
    category: 'Rekayasa Perangkat Lunak',
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    targetPassingRate: 80, // Target 80%
    passingThreshold: 75, // Ambang lulus Kolom I: PERSENTASE LMS >= 75%
    stages: DENPASAR_STAGES,
    participants: DENPASAR_PARTICIPANTS,
    lastSyncTime: '2026-10-13T11:43:00Z',
  },
];
