export type ActivityType =
  | 'media'
  | 'timer'
  | 'download'
  | 'call'
  | 'navigation'
  | 'system'
  | 'custom';

export interface ActivityAction {
  id: string;
  label: string;
  icon?: string;
  hotkey?: string;
  variant?: 'default' | 'primary' | 'danger';
}

export interface Activity {
  id: string;
  app: string;
  type: ActivityType;
  title: string;
  subtitle?: string;
  icon?: string;
  thumbnail?: string;
  progress?: number; // 0 - 1
  timeRemaining?: string;
  duration?: number; // for timer in seconds
  actions?: ActivityAction[];
  priority: number; // Higher number -> higher priority
  ttl?: number; // Time to live in ms (auto expires)
  deepLink?: string;
  customData?: Record<string, unknown>;
  createdAt: number;
}

export type IslandMode = 'compact' | 'expanded' | 'minimal';

export interface RelativeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DisplayInfo {
  id: number;
  label: string;
  bounds: { x: number; y: number; width: number; height: number };
  workArea: { x: number; y: number; width: number; height: number };
  isPrimary: boolean;
}

export interface AppSettings {
  theme: 'oled' | 'glass' | 'cyberpunk' | 'minimal';
  yOffset: number;
  scale: number;
  targetDisplayId: number | null;
  globalHotkey: string;
  autoHideOnFullscreen: boolean;
  batterySaver: boolean;
  pinExpanded: boolean;
}

export interface PluginPermission {
  pluginId: string;
  name: string;
  token: string;
  approved: boolean;
  createdAt: number;
}
