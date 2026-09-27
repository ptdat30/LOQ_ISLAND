import { screen, type BrowserWindow, type Point, type Rectangle } from 'electron';

export interface RelativeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculates whether the global cursor point is inside the island pill.
 * pillRect is RELATIVE to the window; windowBounds is the window's global rect.
 */
export function isInsidePill(
  cursor: Point,
  windowBounds: Rectangle,
  pillRect: RelativeRect
): boolean {
  const absolutePill = {
    x: windowBounds.x + pillRect.x,
    y: windowBounds.y + pillRect.y,
    width: pillRect.width,
    height: pillRect.height,
  };

  return (
    cursor.x >= absolutePill.x &&
    cursor.x <= absolutePill.x + absolutePill.width &&
    cursor.y >= absolutePill.y &&
    cursor.y <= absolutePill.y + absolutePill.height
  );
}

/**
 * Euclidean distance from cursor to the closest edge of the pill.
 * Returns 0 if the cursor is inside the pill.
 */
export function distanceToPill(
  cursor: Point,
  windowBounds: Rectangle,
  pillRect: RelativeRect
): number {
  const abs = {
    x: windowBounds.x + pillRect.x,
    y: windowBounds.y + pillRect.y,
    width: pillRect.width,
    height: pillRect.height,
  };

  const dx = Math.max(abs.x - cursor.x, 0, cursor.x - (abs.x + abs.width));
  const dy = Math.max(abs.y - cursor.y, 0, cursor.y - (abs.y + abs.height));
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Safe, battery-optimized Adaptive Hit-Testing Poller
 */
export class HitTestPoller {
  private timer: NodeJS.Timeout | null = null;
  private lastCursorInside: boolean | null = null;
  private pillBounds: RelativeRect | null = null;
  private win: BrowserWindow;
  private isPaused: boolean = false;

  constructor(win: BrowserWindow) {
    this.win = win;
  }

  public start(): void {
    this.isPaused = false;
    this.schedule(100);
  }

  public stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public pause(): void {
    this.isPaused = true;
    this.stop();
  }

  public resume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.schedule(100);
    }
  }

  public updateBounds(bounds: RelativeRect): void {
    this.pillBounds = bounds;
  }

  private schedule(delay: number): void {
    this.stop();
    if (this.isPaused || this.win.isDestroyed()) return;
    this.timer = setTimeout(() => this.tick(), delay);
  }

  private tick(): void {
    if (this.isPaused || this.win.isDestroyed() || !this.win.isVisible()) {
      this.schedule(200);
      return;
    }

    if (!this.pillBounds) {
      this.schedule(100);
      return;
    }

    try {
      const cursor = screen.getCursorScreenPoint();
      const winBounds = this.win.getBounds();
      const inside = isInsidePill(cursor, winBounds, this.pillBounds);

      // State Change Caching: only call native API when state changes
      if (inside !== this.lastCursorInside) {
        if (process.platform === 'win32') {
          this.win.setIgnoreMouseEvents(!inside, { forward: true });
        } else {
          this.win.setIgnoreMouseEvents(!inside);
        }
        this.win.webContents.send('cursor-inside', inside);
        this.lastCursorInside = inside;
      }

      // Adaptive polling based on distance:
      // Within 150px: 16ms (60fps) for instantaneous hover detection
      // Farther away: 40ms (25fps) for responsive approach with minimal CPU
      const dist = distanceToPill(cursor, winBounds, this.pillBounds);
      const nextInterval = dist < 150 ? 16 : 40;
      this.schedule(nextInterval);
    } catch {
      this.schedule(100);
    }
  }
}
