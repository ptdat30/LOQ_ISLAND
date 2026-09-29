export type EggTimerStatus = 'idle' | 'running' | 'alert';

export interface EggTimerState {
  status: EggTimerStatus;
  startTime: number | null;
  targetEndTime: number | null;
  durationMs: number;
  remainingMs: number;
}
