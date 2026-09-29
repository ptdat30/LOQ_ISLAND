import { create } from 'zustand';
import type { EggTimerStatus } from '../types/eggTimer';

const STORAGE_KEY = 'hyperisland_egg_timer';
const DEFAULT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface StoredEggTimerData {
  status: EggTimerStatus;
  startTime: number | null;
  targetEndTime: number | null;
  durationMs: number;
}

interface EggTimerStore {
  status: EggTimerStatus;
  startTime: number | null;
  targetEndTime: number | null;
  durationMs: number;
  remainingMs: number;

  // Actions
  startTimer: () => void;
  cancelTimer: () => void;
  dismissAlert: () => void;
  initStore: () => void;
  fastForwardTo: (remainingMs: number) => void;
}

let tickTimer: ReturnType<typeof setInterval> | null = null;

const saveToStorage = (data: StoredEggTimerData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save egg timer to storage', e);
  }
};

const loadFromStorage = (): StoredEggTimerData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to load egg timer from storage', e);
    return null;
  }
};

export const useEggTimerStore = create<EggTimerStore>((set, get) => {
  const clearTick = () => {
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  };

  const startTick = () => {
    clearTick();
    tickTimer = setInterval(() => {
      const { targetEndTime, status } = get();
      if (status !== 'running' || !targetEndTime) {
        clearTick();
        return;
      }

      const now = Date.now();
      const remaining = Math.max(0, targetEndTime - now);

      if (remaining <= 0) {
        clearTick();
        set({ status: 'alert', remainingMs: 0 });
        saveToStorage({
          status: 'alert',
          startTime: get().startTime,
          targetEndTime,
          durationMs: get().durationMs,
        });
      } else {
        set({ remainingMs: remaining });
      }
    }, 100);
  };

  return {
    status: 'idle',
    startTime: null,
    targetEndTime: null,
    durationMs: DEFAULT_DURATION_MS,
    remainingMs: DEFAULT_DURATION_MS,

    startTimer: () => {
      const now = Date.now();
      const targetEndTime = now + DEFAULT_DURATION_MS;

      const state: StoredEggTimerData = {
        status: 'running',
        startTime: now,
        targetEndTime,
        durationMs: DEFAULT_DURATION_MS,
      };

      saveToStorage(state);
      set({
        ...state,
        remainingMs: DEFAULT_DURATION_MS,
      });

      startTick();
    },

    cancelTimer: () => {
      clearTick();
      const state: StoredEggTimerData = {
        status: 'idle',
        startTime: null,
        targetEndTime: null,
        durationMs: DEFAULT_DURATION_MS,
      };
      saveToStorage(state);
      set({
        ...state,
        remainingMs: DEFAULT_DURATION_MS,
      });
    },

    dismissAlert: () => {
      clearTick();
      const state: StoredEggTimerData = {
        status: 'idle',
        startTime: null,
        targetEndTime: null,
        durationMs: DEFAULT_DURATION_MS,
      };
      saveToStorage(state);
      set({
        ...state,
        remainingMs: DEFAULT_DURATION_MS,
      });
    },

    initStore: () => {
      const stored = loadFromStorage();
      if (!stored) return;

      const now = Date.now();
      if (stored.status === 'running' && stored.targetEndTime) {
        const remaining = stored.targetEndTime - now;
        if (remaining <= 0) {
          // Already passed 15 minutes while app was closed -> jump to alert
          set({
            status: 'alert',
            startTime: stored.startTime,
            targetEndTime: stored.targetEndTime,
            durationMs: stored.durationMs || DEFAULT_DURATION_MS,
            remainingMs: 0,
          });
          saveToStorage({
            ...stored,
            status: 'alert',
          });
        } else {
          // Resume countdown with actual remaining time
          set({
            status: 'running',
            startTime: stored.startTime,
            targetEndTime: stored.targetEndTime,
            durationMs: stored.durationMs || DEFAULT_DURATION_MS,
            remainingMs: remaining,
          });
          startTick();
        }
      } else if (stored.status === 'alert') {
        set({
          status: 'alert',
          startTime: stored.startTime,
          targetEndTime: stored.targetEndTime,
          durationMs: stored.durationMs || DEFAULT_DURATION_MS,
          remainingMs: 0,
        });
      }
    },

    fastForwardTo: (remainingMs: number) => {
      const now = Date.now();
      const isAlert = remainingMs <= 0;
      const targetEndTime = now + remainingMs;
      const startTime = now - (DEFAULT_DURATION_MS - remainingMs);

      clearTick();
      const state: StoredEggTimerData = {
        status: isAlert ? 'alert' : 'running',
        startTime,
        targetEndTime: isAlert ? null : targetEndTime,
        durationMs: DEFAULT_DURATION_MS,
      };

      saveToStorage(state);
      set({
        ...state,
        remainingMs: Math.max(0, remainingMs),
      });

      if (!isAlert) {
        startTick();
      }
    },
  };
});

// Helper formatting functions
export const formatEggTimer = (ms: number): string => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const getEggProgress = (remainingMs: number, durationMs: number, status: EggTimerStatus): number => {
  if (status === 'alert') return 1; // 100% full in alert state
  if (status === 'idle') return 1;
  return Math.max(0, Math.min(1, remainingMs / durationMs));
};

export const getEggProgressColor = (remainingMs: number, status: EggTimerStatus): string => {
  if (status === 'alert') return '#FFFFFF';
  if (remainingMs > 5 * 60 * 1000) return '#0A84FF'; // Apple Blue (> 5 min)
  if (remainingMs >= 60 * 1000) return '#FFD60A';    // Apple Yellow (1 - 5 min)
  return '#FF453A';                                  // Apple Red (< 1 min)
};
