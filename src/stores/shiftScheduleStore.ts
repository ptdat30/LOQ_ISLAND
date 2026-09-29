import { create } from 'zustand';
import type { ScheduleTask, ScheduleNotificationSettings } from '../types/shiftSchedule';

const STORAGE_KEY_SCHEDULE = 'hyperisland_shift_schedule';
const STORAGE_KEY_SETTINGS = 'hyperisland_shift_settings';
const STORAGE_KEY_LAST_RESET = 'hyperisland_shift_last_reset';

export const parseTaskDescription = (raw: string): { title: string; subtitle?: string } => {
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return { title: raw };
  const title = parts[0];
  const subtitle = parts.slice(1).join(' • ');
  return { title, subtitle: subtitle || undefined };
};

export const DEFAULT_RAW_SCHEDULE: Array<{ time: string; raw: string }> = [
  { time: '14:30', raw: 'Dọn nhà vệ sinh, kiểm tra phòng, chụp báo cáo 1 giờ, báo cáo đầu ca' },
  { time: '15:00', raw: 'Dọn nhà vệ sinh' },
  { time: '15:30', raw: 'Dọn nhà vệ sinh, kiểm tra phòng, chụp báo cáo 1 giờ' },
  { time: '16:00', raw: 'Dọn nhà vệ sinh, chụp báo cáo 2 giờ, kiểm tú' },
  { time: '16:30', raw: 'Dọn nhà vệ sinh, kiểm tra phòng, chụp báo cáo 1 giờ' },
  { time: '17:00', raw: 'Dọn nhà vệ sinh' },
  { time: '17:30', raw: 'Dọn nhà vệ sinh, kiểm tra phòng, chụp báo cáo 1 giờ' },
  { time: '18:00', raw: 'Dọn nhà vệ sinh, giặt sấy, chụp báo cáo 2 giờ' },
  { time: '18:30', raw: 'Dọn nhà vệ sinh, kiểm tra phòng, chụp báo cáo 1 giờ' },
  { time: '19:00', raw: 'Dọn nhà vệ sinh, kiểm tú' },
  { time: '19:30', raw: 'Dọn nhà vệ sinh, kiểm tra phòng, chụp báo cáo 1 giờ' },
  { time: '20:00', raw: 'Dọn nhà vệ sinh, giặt sấy, chụp báo cáo 2 giờ' },
  { time: '20:30', raw: 'Dọn nhà vệ sinh, kiểm tra phòng, chụp báo cáo 1 giờ' },
  { time: '21:00', raw: 'Dọn nhà vệ sinh' },
  { time: '21:30', raw: 'Dọn nhà vệ sinh, kiểm tra phòng, chụp báo cáo 1 giờ' },
  { time: '22:00', raw: 'Dọn nhà vệ sinh, kiểm tú, máy lạnh, BCCC' },
  { time: '22:30', raw: 'Chấm công' },
];

export const createInitialTasks = (): ScheduleTask[] => {
  return DEFAULT_RAW_SCHEDULE.map((item, idx) => {
    const { title, subtitle } = parseTaskDescription(item.raw);
    return {
      id: `task-${idx + 1}-${item.time.replace(':', '')}`,
      time: item.time,
      title,
      subtitle,
      rawDescription: item.raw,
      enabled: true,
      status: 'pending',
      snoozeUntil: null,
      completedAt: null,
    };
  });
};

export const DEFAULT_NOTIFICATION_SETTINGS: ScheduleNotificationSettings = {
  remindBefore30s: true,
  pulseEffect: true,
  keepExpanded60s: true,
  pulseCount: 3,
  soundEnabled: false,
};

interface ShiftScheduleStore {
  tasks: ScheduleTask[];
  settings: ScheduleNotificationSettings;
  activeAlertTaskId: string | null;
  feedbackMessage: string | null;
  currentTimeStr: string;

  // Actions
  initSchedule: () => void;
  markDone: (taskId: string) => void;
  snooze: (taskId: string, minutes?: number) => void;
  dismissAlert: (taskId: string) => void;
  addTask: (time: string, rawDescription: string) => void;
  updateTask: (taskId: string, updates: Partial<ScheduleTask>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskEnabled: (taskId: string) => void;
  importFromJSON: (jsonString: string) => boolean;
  updateSettings: (settingsUpdates: Partial<ScheduleNotificationSettings>) => void;
  testTriggerNow: (taskId?: string) => void;
  testWarningNow: (taskId?: string) => void;
  createRealtimeTestTask: (delayMinutes?: number) => void;
  resetAllToPending: () => void;
  resetToDefaultSchedule: () => void;
}

let scheduleInterval: ReturnType<typeof setInterval> | null = null;

const getTodayDateStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const useShiftScheduleStore = create<ShiftScheduleStore>((set, get) => {
  const saveTasks = (tasks: ScheduleTask[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  };

  const saveSettings = (settings: ScheduleNotificationSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  const tick = () => {
    const now = new Date();
    const nowMs = now.getTime();
    const todayStr = getTodayDateStr();

    // ─── Daily 00:00 Reset ───
    const lastReset = localStorage.getItem(STORAGE_KEY_LAST_RESET);
    if (lastReset && lastReset !== todayStr) {
      const resetTasks = get().tasks.map((t) => ({
        ...t,
        status: 'pending' as const,
        snoozeUntil: null,
        completedAt: null,
      }));
      set({ tasks: resetTasks, activeAlertTaskId: null });
      saveTasks(resetTasks);
      localStorage.setItem(STORAGE_KEY_LAST_RESET, todayStr);
      return;
    }
    if (!lastReset) {
      localStorage.setItem(STORAGE_KEY_LAST_RESET, todayStr);
    }

    const { tasks, settings, activeAlertTaskId } = get();
    let updated = false;
    let newAlertId = activeAlertTaskId;

    const newTasks = tasks.map((task) => {
      if (!task.enabled || task.status === 'done') return task;

      // Handle snoozed tasks
      if (task.status === 'snoozed') {
        if (task.snoozeUntil && nowMs >= task.snoozeUntil) {
          updated = true;
          newAlertId = task.id;
          return { ...task, status: 'alert' as const, snoozeUntil: null };
        }
        return task;
      }

      // Compute task's Date for today
      const [hStr, mStr] = task.time.split(':');
      const taskDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);
      const diffMs = taskDate.getTime() - nowMs;

      // ─── Exact time reached (within 60 seconds) ───
      if (diffMs <= 0 && diffMs > -60000 && task.status !== 'alert') {
        updated = true;
        newAlertId = task.id;
        return { ...task, status: 'alert' as const };
      }

      // ─── Warning 30s before ───
      if (settings.remindBefore30s && diffMs > 0 && diffMs <= 30000 && task.status === 'pending') {
        updated = true;
        return { ...task, status: 'warning' as const };
      }

      return task;
    });

    if (updated || newAlertId !== activeAlertTaskId) {
      set({ tasks: newTasks, activeAlertTaskId: newAlertId });
      saveTasks(newTasks);
    }

    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    set({ currentTimeStr: `${hh}:${mm}` });
  };

  return {
    tasks: createInitialTasks(),
    settings: DEFAULT_NOTIFICATION_SETTINGS,
    activeAlertTaskId: null,
    feedbackMessage: null,
    currentTimeStr: '00:00',

    initSchedule: () => {
      let loadedTasks: ScheduleTask[] | null = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY_SCHEDULE);
        if (raw) loadedTasks = JSON.parse(raw);
      } catch (e) {
        console.error('Failed to load tasks', e);
      }

      let loadedSettings: ScheduleNotificationSettings | null = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (raw) loadedSettings = JSON.parse(raw);
      } catch (e) {
        console.error('Failed to load settings', e);
      }

      const tasksToUse = loadedTasks && loadedTasks.length > 0 ? loadedTasks : createInitialTasks();
      const settingsToUse = loadedSettings ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...loadedSettings } : DEFAULT_NOTIFICATION_SETTINGS;

      set({
        tasks: tasksToUse,
        settings: settingsToUse,
      });

      if (scheduleInterval) clearInterval(scheduleInterval);
      scheduleInterval = setInterval(tick, 1000);
      tick();
    },

    markDone: (taskId: string) => {
      const { tasks, activeAlertTaskId } = get();
      const nextTasks = tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: 'done' as const, completedAt: Date.now(), snoozeUntil: null }
          : t
      );

      // Find next task in day
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      const remainingUpcoming = nextTasks.filter((t) => {
        if (!t.enabled || t.status === 'done') return false;
        const [h, m] = t.time.split(':').map(Number);
        return h * 60 + m >= nowMinutes;
      });

      let feedback = 'Hết lịch hôm nay';
      if (remainingUpcoming.length > 0) {
        remainingUpcoming.sort((a, b) => {
          const [ah, am] = a.time.split(':').map(Number);
          const [bh, bm] = b.time.split(':').map(Number);
          return ah * 60 + am - (bh * 60 + bm);
        });
        feedback = `Task tiếp theo: ${remainingUpcoming[0].time}`;
      }

      set({
        tasks: nextTasks,
        activeAlertTaskId: activeAlertTaskId === taskId ? null : activeAlertTaskId,
        feedbackMessage: feedback,
      });
      saveTasks(nextTasks);

      setTimeout(() => {
        set({ feedbackMessage: null });
      }, 2000);
    },

    snooze: (taskId: string, minutes = 5) => {
      const { tasks, activeAlertTaskId } = get();
      const snoozeUntil = Date.now() + minutes * 60 * 1000;
      const nextTasks = tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: 'snoozed' as const, snoozeUntil }
          : t
      );

      set({
        tasks: nextTasks,
        activeAlertTaskId: activeAlertTaskId === taskId ? null : activeAlertTaskId,
      });
      saveTasks(nextTasks);
    },

    dismissAlert: (taskId: string) => {
      const { activeAlertTaskId } = get();
      if (activeAlertTaskId === taskId) {
        set({ activeAlertTaskId: null });
      }
    },

    addTask: (time: string, rawDescription: string) => {
      const { tasks } = get();
      const { title, subtitle } = parseTaskDescription(rawDescription);
      const newTask: ScheduleTask = {
        id: `task-${Date.now()}`,
        time,
        title,
        subtitle,
        rawDescription,
        enabled: true,
        status: 'pending',
        snoozeUntil: null,
        completedAt: null,
      };

      const updated = [...tasks, newTask];
      updated.sort((a, b) => {
        const [ah, am] = a.time.split(':').map(Number);
        const [bh, bm] = b.time.split(':').map(Number);
        return ah * 60 + am - (bh * 60 + bm);
      });

      set({ tasks: updated });
      saveTasks(updated);
    },

    updateTask: (taskId: string, updates: Partial<ScheduleTask>) => {
      const { tasks } = get();
      const updated = tasks.map((t) => {
        if (t.id !== taskId) return t;
        const next = { ...t, ...updates };
        if (updates.rawDescription && updates.rawDescription !== t.rawDescription) {
          const parsed = parseTaskDescription(updates.rawDescription);
          next.title = parsed.title;
          next.subtitle = parsed.subtitle;
        }
        return next;
      });

      updated.sort((a, b) => {
        const [ah, am] = a.time.split(':').map(Number);
        const [bh, bm] = b.time.split(':').map(Number);
        return ah * 60 + am - (bh * 60 + bm);
      });

      set({ tasks: updated });
      saveTasks(updated);
    },

    deleteTask: (taskId: string) => {
      const { tasks, activeAlertTaskId } = get();
      const updated = tasks.filter((t) => t.id !== taskId);
      set({
        tasks: updated,
        activeAlertTaskId: activeAlertTaskId === taskId ? null : activeAlertTaskId,
      });
      saveTasks(updated);
    },

    toggleTaskEnabled: (taskId: string) => {
      const { tasks } = get();
      const updated = tasks.map((t) => (t.id === taskId ? { ...t, enabled: !t.enabled } : t));
      set({ tasks: updated });
      saveTasks(updated);
    },

    importFromJSON: (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString);
        if (!Array.isArray(parsed)) return false;

        const newTasks: ScheduleTask[] = parsed.map((item, idx) => {
          const time = item.time || '12:00';
          const raw = item.raw || item.title || item.rawDescription || 'Công việc';
          const { title, subtitle } = parseTaskDescription(raw);
          return {
            id: `task-imported-${idx}-${Date.now()}`,
            time,
            title,
            subtitle,
            rawDescription: raw,
            enabled: item.enabled !== false,
            status: 'pending',
            snoozeUntil: null,
            completedAt: null,
          };
        });

        newTasks.sort((a, b) => {
          const [ah, am] = a.time.split(':').map(Number);
          const [bh, bm] = b.time.split(':').map(Number);
          return ah * 60 + am - (bh * 60 + bm);
        });

        set({ tasks: newTasks });
        saveTasks(newTasks);
        return true;
      } catch (e) {
        console.error('Import failed', e);
        return false;
      }
    },

    updateSettings: (settingsUpdates: Partial<ScheduleNotificationSettings>) => {
      const { settings } = get();
      const updated = { ...settings, ...settingsUpdates };
      set({ settings: updated });
      saveSettings(updated);
    },

    testTriggerNow: (taskId?: string) => {
      const { tasks } = get();
      const targetId = taskId || (tasks.find((t) => t.enabled && t.status !== 'done')?.id || tasks[0]?.id);
      if (!targetId) return;

      const nextTasks = tasks.map((t) =>
        t.id === targetId ? { ...t, status: 'alert' as const } : t
      );
      set({ tasks: nextTasks, activeAlertTaskId: targetId });
      saveTasks(nextTasks);
    },

    testWarningNow: (taskId?: string) => {
      const { tasks } = get();
      const targetId = taskId || (tasks.find((t) => t.enabled && t.status !== 'done')?.id || tasks[0]?.id);
      if (!targetId) return;

      const nextTasks = tasks.map((t) =>
        t.id === targetId ? { ...t, status: 'warning' as const } : t
      );
      set({ tasks: nextTasks });
      saveTasks(nextTasks);
    },

    createRealtimeTestTask: (delayMinutes = 1) => {
      const now = new Date();
      const future = new Date(now.getTime() + delayMinutes * 60 * 1000);
      const hh = String(future.getHours()).padStart(2, '0');
      const mm = String(future.getMinutes()).padStart(2, '0');
      const timeStr = `${hh}:${mm}`;

      get().addTask(timeStr, 'Dọn nhà vệ sinh, kiểm tra phòng, chụp báo cáo 1 giờ');
    },

    resetAllToPending: () => {
      const { tasks } = get();
      const reset = tasks.map((t) => ({
        ...t,
        status: 'pending' as const,
        snoozeUntil: null,
        completedAt: null,
      }));
      set({ tasks: reset, activeAlertTaskId: null, feedbackMessage: 'Đã reset tất cả về Pending' });
      saveTasks(reset);
      setTimeout(() => set({ feedbackMessage: null }), 1500);
    },

    resetToDefaultSchedule: () => {
      const initial = createInitialTasks();
      set({ tasks: initial, activeAlertTaskId: null, feedbackMessage: 'Đã khôi phục 17 khung giờ gốc' });
      saveTasks(initial);
      setTimeout(() => set({ feedbackMessage: null }), 2000);
    },
  };
});

// Helper functions for UI
export const getNextTaskInfo = (tasks: ScheduleTask[]): {
  task: ScheduleTask | null;
  minutesRemaining: number;
  secondsRemaining: number;
  is30sWarning: boolean;
  hasUnfinishedAlert: boolean;
} => {
  const now = new Date();
  const nowMs = now.getTime();

  // Check if any task is currently in alert
  const alertTask = tasks.find((t) => t.enabled && t.status === 'alert');
  if (alertTask) {
    return {
      task: alertTask,
      minutesRemaining: 0,
      secondsRemaining: 0,
      is30sWarning: false,
      hasUnfinishedAlert: true,
    };
  }

  // Check if any task is in warning
  const warningTask = tasks.find((t) => t.enabled && t.status === 'warning');
  if (warningTask) {
    const [h, m] = warningTask.time.split(':').map(Number);
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0).getTime();
    const diffSec = Math.max(0, Math.ceil((target - nowMs) / 1000));
    return {
      task: warningTask,
      minutesRemaining: 0,
      secondsRemaining: diffSec,
      is30sWarning: true,
      hasUnfinishedAlert: false,
    };
  }

  // Find upcoming pending or snoozed task
  const pendingTasks = tasks.filter((t) => t.enabled && (t.status === 'pending' || t.status === 'snoozed'));
  if (pendingTasks.length === 0) {
    return {
      task: null,
      minutesRemaining: 0,
      secondsRemaining: 0,
      is30sWarning: false,
      hasUnfinishedAlert: false,
    };
  }

  // Compute upcoming target time for each
  const candidateTasks = pendingTasks.map((t) => {
    let targetMs: number;
    if (t.status === 'snoozed' && t.snoozeUntil) {
      targetMs = t.snoozeUntil;
    } else {
      const [h, m] = t.time.split(':').map(Number);
      targetMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0).getTime();
    }
    const diffMs = targetMs - nowMs;
    return { task: t, targetMs, diffMs };
  });

  // Filter those that are upcoming (diffMs >= -59000)
  const upcoming = candidateTasks.filter((c) => c.diffMs >= -59000);
  if (upcoming.length === 0) {
    return {
      task: null,
      minutesRemaining: 0,
      secondsRemaining: 0,
      is30sWarning: false,
      hasUnfinishedAlert: false,
    };
  }

  upcoming.sort((a, b) => a.diffMs - b.diffMs);
  const next = upcoming[0];
  const totalSec = Math.max(0, Math.ceil(next.diffMs / 1000));
  const totalMin = Math.ceil(totalSec / 60);

  return {
    task: next.task,
    minutesRemaining: totalMin,
    secondsRemaining: totalSec,
    is30sWarning: totalSec <= 30 && totalSec > 0,
    hasUnfinishedAlert: false,
  };
};
