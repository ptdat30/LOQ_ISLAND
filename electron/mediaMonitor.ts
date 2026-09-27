import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BrowserWindow } from 'electron';
import log from 'electron-log';
import type { Activity } from '../src/types/activity';

import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawMediaInfo {
  title: string;
  artist?: string;
  album?: string;
  status: string; // 'Playing' | 'Paused' | 'Stopped'
  position: number;
  duration: number;
  thumbnail?: string;
}

export class MediaMonitor {
  private win: BrowserWindow;
  private process: ChildProcessWithoutNullStreams | null = null;
  private isRunning: boolean = false;

  constructor(win: BrowserWindow) {
    this.win = win;
  }

  public start(): void {
    if (process.platform !== 'win32') {
      log.info('[MediaMonitor] GSMTC is only available on Windows.');
      return;
    }

    if (this.isRunning) return;
    this.isRunning = true;

    const possiblePaths = [
      path.resolve(process.cwd(), 'scripts/media-service.ps1'),
      path.resolve(__dirname, '../scripts/media-service.ps1'),
      path.resolve(__dirname, '../../scripts/media-service.ps1'),
    ];
    const scriptPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];

    try {
      this.process = spawn('powershell.exe', [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        scriptPath,
      ]);

      this.process.stdout.setEncoding('utf8');
      let buffer = '';

      this.process.stdout.on('data', (data: string) => {
        buffer += data;
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('MEDIA_UPDATE:')) {
            try {
              const jsonStr = trimmed.replace('MEDIA_UPDATE:', '').trim();
              const raw = JSON.parse(jsonStr) as RawMediaInfo;
              this.handleMediaUpdate(raw);
            } catch (err) {
              log.warn('[MediaMonitor] JSON parse error:', err);
            }
          } else if (trimmed === 'MEDIA_IDLE') {
            this.handleMediaIdle();
          }
        }
      });

      this.process.stderr.on('data', (data: string) => {
        log.warn(`[MediaMonitor] stderr: ${data}`);
      });

      this.process.on('close', (code) => {
        log.info(`[MediaMonitor] process exited with code ${code}`);
        this.isRunning = false;
      });
    } catch (err) {
      log.error('[MediaMonitor] Failed to start media monitor:', err);
      this.isRunning = false;
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }

  public togglePlayPause(): void {
    const possiblePaths = [
      path.resolve(process.cwd(), 'scripts/toggle-media.ps1'),
      path.resolve(__dirname, '../scripts/toggle-media.ps1'),
      path.resolve(__dirname, '../../scripts/toggle-media.ps1'),
    ];
    const scriptPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];

    try {
      const toggleProc = spawn('powershell.exe', [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        scriptPath,
      ]);
      toggleProc.on('error', (err) => {
        log.error('[MediaMonitor] Failed to execute toggle script:', err);
      });
    } catch (err) {
      log.error('[MediaMonitor] Failed to spawn toggle process:', err);
    }
  }

  private handleMediaUpdate(raw: RawMediaInfo): void {
    if (!raw.title || this.win.isDestroyed()) return;

    const isPlaying = raw.status === 'Playing';
    const progress = raw.duration > 0 ? Math.min(1, Math.max(0, raw.position / raw.duration)) : undefined;

    const formatSeconds = (sec: number): string => {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const timeRemaining = raw.duration > 0 && raw.position <= raw.duration
      ? formatSeconds(raw.duration - raw.position)
      : undefined;

    const mediaActivity: Activity = {
      id: 'system-media',
      app: raw.artist || 'YouTube / Media',
      type: 'media',
      title: raw.title,
      subtitle: raw.artist ? `${raw.artist} • ${raw.status}` : raw.status,
      icon: 'Music',
      thumbnail: raw.thumbnail,
      progress,
      timeRemaining,
      duration: raw.duration,
      priority: isPlaying ? 100 : 85, // Always higher than mock activities (75-80) so real media takes Primary Pill!
      actions: [
        { id: 'play', label: isPlaying ? 'Pause' : 'Play', icon: isPlaying ? 'Pause' : 'Play', variant: 'primary' },
      ],
      createdAt: Date.now(),
    };

    log.info(`[MediaMonitor] Pushed to Island: "${raw.title}" (${raw.status}) [thumb: ${!!raw.thumbnail}]`);
    this.win.webContents.send('system-media-update', mediaActivity);
  }

  private handleMediaIdle(): void {
    // Media was stopped / no media session
    if (!this.win.isDestroyed()) {
      this.win.webContents.send('system-media-idle');
    }
  }
}
