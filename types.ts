import type { ReactElement } from 'react';

export interface StepParameters {
  id: number;
  name: string;
  color: string;
  icon: ReactElement<{ className?: string }>;
  cycleTime: number; // T_c in time units per item
  batchSize: number; // B (items per batch)
  setupTime: number; // T_s in time units
  
  // Lock states
  isBatchLocked?: boolean;
  isCycleLocked?: boolean;
  isSetupLocked?: boolean;
}

export interface SimulationMetrics {
  wip: number; // L (average Work In Progress)
  throughput: number; // λ (average throughput)
  leadTime: number; // W (average lead time)
}

export interface MetricsHistoryEntry {
    time: number;
    wip: number;
    throughput: number;
    leadTime: number;
}

export type MachineStatus = 'idle' | 'setup' | 'producing' | 'blocked';
export type TimeUnit = 'Seconds' | 'Minutes' | 'Hours';
export type Language = 'en' | 'nl';

export interface MachineState {
  status: MachineStatus;
  progress: number; // 0 to 1, for setup or production phase
  currentBatch: Batch | null;
}

export interface QueueState {
  currentBatch: Batch | null;
}

export interface Batch {
  id: number;
  size: number;
  startTime: number;
  endTime?: number;
}