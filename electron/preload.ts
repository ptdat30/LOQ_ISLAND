import { contextBridge, ipcRenderer } from 'electron';
import type { RelativeRect, DisplayInfo, AppSettings } from '../src/types/activity';

export interface ElectronAPI {
  syncPillBounds: (bounds: RelativeRect) => void;
  onCursorInside: (callback: (inside: boolean) => void) => () => void;
  onToggleExpand: (callback: () => void) => () => void;
  onShortcutConflict: (callback: (data: { key: string }) => void) => () => void;
  getDisplays: () => Promise<DisplayInfo[]>;
  setDisplay: (displayId: number) => Promise<boolean>;
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<boolean>;
  onPluginApprovalRequest: (
    callback: (request: { approvalId: string; pluginId: string; name: string }) => void
  ) => () => void;
  respondPluginApproval: (approvalId: string, approved: boolean) => Promise<boolean>;
  onNewActivityFromPlugin: (callback: (activity: unknown) => void) => () => void;
  onSystemMediaUpdate: (callback: (activity: unknown) => void) => () => void;
  onSystemMediaIdle: (callback: () => void) => () => void;
  togglePlayPause: () => Promise<boolean>;
  closeApp: () => void;
  minimizeApp: () => void;
}

const api: ElectronAPI = {
  syncPillBounds: (bounds: RelativeRect) => {
    ipcRenderer.send('sync-pill-bounds', bounds);
  },
  onCursorInside: (callback: (inside: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, inside: boolean) => callback(inside);
    ipcRenderer.on('cursor-inside', handler);
    return () => ipcRenderer.removeListener('cursor-inside', handler);
  },
  onToggleExpand: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('toggle-expand', handler);
    return () => ipcRenderer.removeListener('toggle-expand', handler);
  },
  onShortcutConflict: (callback: (data: { key: string }) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: { key: string }) => callback(data);
    ipcRenderer.on('shortcut-conflict', handler);
    return () => ipcRenderer.removeListener('shortcut-conflict', handler);
  },
  getDisplays: () => ipcRenderer.invoke('get-displays'),
  setDisplay: (displayId: number) => ipcRenderer.invoke('set-display', displayId),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: Partial<AppSettings>) => ipcRenderer.invoke('save-settings', settings),
  onPluginApprovalRequest: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, req: { approvalId: string; pluginId: string; name: string }) =>
      callback(req);
    ipcRenderer.on('plugin-approval-request', handler);
    return () => ipcRenderer.removeListener('plugin-approval-request', handler);
  },
  respondPluginApproval: (approvalId: string, approved: boolean) =>
    ipcRenderer.invoke('respond-plugin-approval', approvalId, approved),
  onNewActivityFromPlugin: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, act: unknown) => callback(act);
    ipcRenderer.on('plugin-activity', handler);
    return () => ipcRenderer.removeListener('plugin-activity', handler);
  },
  onSystemMediaUpdate: (callback) => {
    const handler = (_event: Electron.IpcRendererEvent, act: unknown) => callback(act);
    ipcRenderer.on('system-media-update', handler);
    return () => ipcRenderer.removeListener('system-media-update', handler);
  },
  onSystemMediaIdle: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('system-media-idle', handler);
    return () => ipcRenderer.removeListener('system-media-idle', handler);
  },
  togglePlayPause: () => ipcRenderer.invoke('media-toggle-play-pause'),
  closeApp: () => ipcRenderer.send('close-app'),
  minimizeApp: () => ipcRenderer.send('minimize-app'),
};

contextBridge.exposeInMainWorld('electronAPI', api);
