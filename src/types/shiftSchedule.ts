export interface ScheduleTask {
  id: string;
  time: string; // "14:30" format (HH:mm)
  title: string; // Main task e.g. "Dọn nhà vệ sinh"
  subtitle?: string; // Subtasks e.g. "Kiểm tra phòng • Chụp báo cáo 1 giờ"
  rawDescription: string;
  enabled: boolean;
  status: 'pending' | 'warning' | 'alert' | 'snoozed' | 'done';
  snoozeUntil?: number | null; // Timestamp ms
  completedAt?: number | null;
}

export interface ScheduleNotificationSettings {
  remindBefore30s: boolean; // default true
  pulseEffect: boolean;     // default true
  keepExpanded60s: boolean; // default true
  pulseCount: number;       // default 3 (1-5)
  soundEnabled: boolean;    // default false
}
