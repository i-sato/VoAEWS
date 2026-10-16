export type BatchStatus = 'Aman' | 'Waspada' | 'Kritis';
export type RiskLevel = 'Tinggi' | 'Sedang' | 'Rendah';

export interface StageProgress {
  stageId: string;
  stageName: string;
  category: 'Tools' | 'Figma' | 'Kuis' | 'Coding' | 'Ujian';
  order: number;
  weightPercent: number;
}

export interface Participant {
  id: string; // e.g. "MHS-001"
  pseudonymName: string; // e.g. "Ahmad P. (Pseudonim)"
  institution: string; // e.g. "Politeknik Negeri Jakarta"
  isOnboarded: boolean;
  completionRate: number; // 0 - 100%
  lastStuckModule: string; // e.g. "Kuis 1 - Logika Pemrograman"
  daysInactive: number;
  riskLevel: RiskLevel;
  notes?: string;
  moduleScores: Record<string, number>; // stageId -> score/status (100 = completed, 0-99 = in progress/stuck)
  recommendedAction: string;
}

export interface TrainingBatch {
  id: string;
  code: string;
  name: string;
  category: string;
  spreadsheetUrl: string;
  startDate: string;
  endDate: string;
  targetPassingRate: number; // e.g., 80 (%)
  passingThreshold: number; // e.g., 75 (%) min completion to pass
  stages: StageProgress[];
  participants: Participant[];
  lastSyncTime: string;
}

export interface ModuleAnalysis {
  stageId: string;
  stageName: string;
  order: number;
  completedCount: number;
  completedPercent: number;
  stuckCount: number;
  dropOffRatePercent: number;
  isBottleneck: boolean;
  severity: 'low' | 'medium' | 'high';
}

export interface DeterministicBatchStats {
  totalRegistered: number;
  onboardedCount: number;
  onboardedRate: number;
  projectedPassCount: number;
  projectedPassRate: number;
  targetPassingRate: number;
  varianceToTarget: number; // positive or negative percentage points
  highRiskCount: number;
  moderateRiskCount: number;
  safeCount: number;
  batchStatus: BatchStatus;
  batchStatusReason: string;
  confidenceScore: number; // e.g. 98.5%
  bottlenecks: ModuleAnalysis[];
  moduleBreakdowns: ModuleAnalysis[];
  lastCalculatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  narrative_summary?: string;
  ui_payload?: {
    status_badge?: {
      status: BatchStatus;
      label: string;
    };
    key_metrics?: Array<{
      label: string;
      value: string | number;
      subtext?: string;
      status?: 'safe' | 'warning' | 'danger' | 'neutral';
    }>;
    bottlenecks?: Array<{
      module: string;
      stuck_count: number;
      impact: string;
    }>;
    actionable_recommendations?: Array<{
      priority: 'Tinggi' | 'Sedang' | 'Rendah';
      title: string;
      description: string;
      target_group: string;
    }>;
    suggested_queries?: string[];
  };
}
