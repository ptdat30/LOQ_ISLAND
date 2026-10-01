import { app, BrowserWindow, globalShortcut, ipcMain, screen, type BrowserWindowConstructorOptions } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import log from 'electron-log';
import { HitTestPoller, type RelativeRect } from './hitTest';
import { PluginServer } from './server';
import { MediaMonitor } from './mediaMonitor';
import type { AppSettings, DisplayInfo } from '../src/types/activity';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimize Chromium for Always-On-Top desktop widgets:
// Prevents Chromium from throttling animations/timers when window does not have keyboard focus
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');

// Configure electron-log rotation: 5 files x 5MB
log.transports.file.maxSize = 5 * 1024 * 1024;
log.info('Dynamic Island for Desktop starting up...');

// Global Error Boundaries
process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception in Main Process:', error);
});
process.on('unhandledRejection', (reason) => {
  log.error('Unhandled Rejection in Main Process:', reason);
});

let mainWindow: BrowserWindow | null = null;
let hitTestPoller: HitTestPoller | null = null;
let pluginServer: PluginServer | null = null;
let mediaMonitor: MediaMonitor | null = null;

// Default App Settings
const currentSettings: AppSettings = {
  theme: 'oled',
  yOffset: 12,
  scale: 1,
  targetDisplayId: null,
  globalHotkey: 'CommandOrControl+Alt+I',
  autoHideOnFullscreen: false,
  batterySaver: false,
  pinExpanded: false,
};

function getPlatformWindowConfig(): BrowserWindowConstructorOptions {
  const baseConfig: BrowserWindowConstructorOptions = {
    width: 680,
    height: 560,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    focusable: true,
    backgroundColor: '#00000000',
    webPreferences: {
      // Prioritize CommonJS preload.cjs to prevent ERR_REQUIRE_ESM
      preload: fs.existsSync(path.join(__dirname, 'preload.cjs'))
        ? path.join(__dirname, 'preload.cjs')
        : path.join(__dirname, 'preload.js'),
      sandbox: false,
      contextIsolation: true,
    },
  };

  if (process.platform === 'darwin') {
    baseConfig.vibrancy = 'under-window';
    baseConfig.visualEffectState = 'active';
  }

  return baseConfig;
}

function getTargetDisplay(): Electron.Display {
  const displays = screen.getAllDisplays();
  if (currentSettings.targetDisplayId !== null) {
    const matched = displays.find((d) => d.id === currentSettings.targetDisplayId);
    if (matched) return matched;
  }
  return screen.getPrimaryDisplay();
}

function positionWindow(win: BrowserWindow): void {
  const display = getTargetDisplay();
  const winBounds = win.getBounds();
  const workArea = display.workArea;

  const x = Math.round(workArea.x + (workArea.width - winBounds.width) / 2);
  const y = Math.round(workArea.y + currentSettings.yOffset);

  win.setPosition(x, y);
}

function registerGlobalShortcuts(win: BrowserWindow): void {
  globalShortcut.unregisterAll();

  const hotkey = currentSettings.globalHotkey || 'CommandOrControl+Alt+I';
  try {
    const isRegistered = globalShortcut.isRegistered(hotkey);
    if (isRegistered) {
      log.warn(`Shortcut ${hotkey} is already registered by another application.`);
      win.webContents.send('shortcut-conflict', { key: hotkey });
      return;
    }

    const success = globalShortcut.register(hotkey, () => {
      if (!win.isDestroyed()) {
        if (win.isVisible()) {
          win.webContents.send('toggle-expand');
        } else {
          win.show();
          hitTestPoller?.resume();
        }
      }
    });

    if (!success) {
      log.warn(`Failed to register global shortcut: ${hotkey}`);
      win.webContents.send('shortcut-conflict', { key: hotkey });
    } else {
      log.info(`Registered global shortcut: ${hotkey}`);
    }

    // Register F5 to reload renderer during development
    globalShortcut.register('F5', () => {
      if (!win.isDestroyed()) {
        log.info('Reloading renderer window...');
        win.webContents.reload();
      }
    });
  } catch (err) {
    log.error('Error during global shortcut registration:', err);
  }
}

async function createWindow(): Promise<BrowserWindow> {
  const winConfig = getPlatformWindowConfig();
  const win = new BrowserWindow(winConfig);

  // Default to always-on-top above screen savers / toolbars
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  positionWindow(win);

  // Initialize Hit-Testing Poller
  hitTestPoller = new HitTestPoller(win);
  hitTestPoller.start();

  // Initialize Plugin Server
  pluginServer = new PluginServer(win);
  try {
    const port = await pluginServer.start();
    log.info(`Local Plugin Server running at http://127.0.0.1:${port}`);
  } catch (err) {
    log.error('Could not start Plugin Server:', err);
  }

  // Initialize System Media Monitor (GSMTC for YouTube, Spotify, etc.)
  mediaMonitor = new MediaMonitor(win);
  mediaMonitor.start();

  // Load renderer
  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    await win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.webContents.on('console-message', (_event, _level, message, line, sourceId) => {
    log.info(`[Renderer] ${message} (${sourceId}:${line})`);
    console.log(`[Renderer] ${message}`);
  });

  registerGlobalShortcuts(win);

  win.on('hide', () => {
    hitTestPoller?.pause();
  });

  win.on('show', () => {
    hitTestPoller?.resume();
  });

  return win;
}

// IPC Handlers
ipcMain.on('sync-pill-bounds', (_event, bounds: RelativeRect) => {
  hitTestPoller?.updateBounds(bounds);
});

ipcMain.handle('get-displays', () => {
  const displays = screen.getAllDisplays();
  const primaryId = screen.getPrimaryDisplay().id;
  return displays.map((d): DisplayInfo => ({
    id: d.id,
    label: d.label || `Display ${d.id}`,
    bounds: d.bounds,
    workArea: d.workArea,
    isPrimary: d.id === primaryId,
  }));
});

ipcMain.handle('set-display', (_event, displayId: number) => {
  currentSettings.targetDisplayId = displayId;
  if (mainWindow && !mainWindow.isDestroyed()) {
    positionWindow(mainWindow);
  }
  return true;
});

ipcMain.handle('get-settings', () => currentSettings);

ipcMain.handle('save-settings', (_event, newSettings: Partial<AppSettings>) => {
  Object.assign(currentSettings, newSettings);
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (newSettings.yOffset !== undefined || newSettings.targetDisplayId !== undefined) {
      positionWindow(mainWindow);
    }
    if (newSettings.globalHotkey) {
      registerGlobalShortcuts(mainWindow);
    }
  }
  return true;
});

ipcMain.handle('respond-plugin-approval', (_event, approvalId: string, approved: boolean) => {
  return pluginServer?.handleApprovalResponse(approvalId, approved) ?? false;
});

ipcMain.handle('media-toggle-play-pause', () => {
  mediaMonitor?.togglePlayPause();
  return true;
});

// File-based Fishing Save Persistence (port-agnostic & permanent across dev/prod)
ipcMain.handle('save-fishing-data', (_event, data: string) => {
  try {
    const saveFilePath = path.join(app.getPath('userData'), 'fishing_save.json');
    fs.writeFileSync(saveFilePath, data, 'utf-8');
    return true;
  } catch (err) {
    log.error('Failed to write fishing_save.json to disk:', err);
    return false;
  }
});

ipcMain.handle('load-fishing-data', () => {
  try {
    const saveFilePath = path.join(app.getPath('userData'), 'fishing_save.json');
    if (fs.existsSync(saveFilePath)) {
      return fs.readFileSync(saveFilePath, 'utf-8');
    }
  } catch (err) {
    log.error('Failed to read fishing_save.json from disk:', err);
  }
  return null;
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('minimize-app', () => {
  mainWindow?.hide();
});

// App Lifecycle
app.whenReady().then(async () => {
  mainWindow = await createWindow();

  // Multi-Monitor hotplug listener
  screen.on('display-removed', (_event, oldDisplay) => {
    log.info(`Display removed: ${oldDisplay.id}`);
    if (currentSettings.targetDisplayId === oldDisplay.id) {
      log.info('Target display disconnected, reverting to Primary Display');
      currentSettings.targetDisplayId = null;
      if (mainWindow && !mainWindow.isDestroyed()) {
        positionWindow(mainWindow);
      }
    }
  });

  screen.on('display-metrics-changed', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      positionWindow(mainWindow);
    }
  });
});

app.on('before-quit', () => {
  hitTestPoller?.stop();
  pluginServer?.stop();
  mediaMonitor?.stop();
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
