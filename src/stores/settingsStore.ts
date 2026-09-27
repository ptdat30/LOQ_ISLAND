import { create } from 'zustand';
import type { AppSettings, DisplayInfo, PluginPermission } from '../types/activity';

interface SettingsState {
  settings: AppSettings;
  displays: DisplayInfo[];
  plugins: PluginPermission[];
  shortcutConflict: string | null;

  // Actions
  loadInitialSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  setDisplay: (displayId: number) => Promise<void>;
  setShortcutConflict: (key: string | null) => void;
  loadPlugins: () => void;
  revokePlugin: (pluginId: string) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    theme: 'oled',
    yOffset: 12,
    scale: 1,
    targetDisplayId: null,
    globalHotkey: 'CommandOrControl+Alt+I',
    autoHideOnFullscreen: false,
    batterySaver: false,
    pinExpanded: false,
  },
  displays: [],
  plugins: [],
  shortcutConflict: null,

  loadInitialSettings: async () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      try {
        const [savedSettings, displayList] = await Promise.all([
          window.electronAPI.getSettings(),
          window.electronAPI.getDisplays(),
        ]);
        set({ settings: savedSettings, displays: displayList });
      } catch (err) {
        console.error('Failed to load settings from Electron:', err);
      }
    }
  },

  updateSettings: async (newSettings: Partial<AppSettings>) => {
    const updated = { ...get().settings, ...newSettings };
    set({ settings: updated });
    if (typeof window !== 'undefined' && window.electronAPI) {
      try {
        await window.electronAPI.saveSettings(newSettings);
      } catch (err) {
        console.error('Failed to persist settings:', err);
      }
    }
  },

  setDisplay: async (displayId: number) => {
    const updated = { ...get().settings, targetDisplayId: displayId };
    set({ settings: updated });
    if (typeof window !== 'undefined' && window.electronAPI) {
      await window.electronAPI.setDisplay(displayId);
    }
  },

  setShortcutConflict: (key: string | null) => {
    set({ shortcutConflict: key });
  },

  loadPlugins: () => {
    // Reads plugin approvals if available
  },

  revokePlugin: (pluginId: string) => {
    const updated = get().plugins.filter((p) => p.pluginId !== pluginId);
    set({ plugins: updated });
  },
}));
