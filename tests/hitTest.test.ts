import { describe, it, expect } from 'vitest';
import { isInsidePill, distanceToPill, type RelativeRect } from '../electron/hitTest';
import type { Rectangle, Point } from 'electron';

describe('Hit Testing Engine', () => {
  const windowBounds: Rectangle = { x: 500, y: 10, width: 600, height: 380 };
  const pillRect: RelativeRect = { x: 190, y: 12, width: 220, height: 36 };

  // Absolute pill rect in screen space:
  // x: 500 + 190 = 690, y: 10 + 12 = 22, width: 220 (to 910), height: 36 (to 58)

  it('correctly detects cursor inside the pill', () => {
    const centerPoint: Point = { x: 750, y: 35 };
    expect(isInsidePill(centerPoint, windowBounds, pillRect)).toBe(true);

    const cornerPoint: Point = { x: 690, y: 22 };
    expect(isInsidePill(cornerPoint, windowBounds, pillRect)).toBe(true);
  });

  it('correctly detects cursor outside the pill', () => {
    const farPoint: Point = { x: 100, y: 100 };
    expect(isInsidePill(farPoint, windowBounds, pillRect)).toBe(false);

    // Inside window but outside pill (transparent zone)
    const windowTransparentPoint: Point = { x: 520, y: 200 };
    expect(isInsidePill(windowTransparentPoint, windowBounds, pillRect)).toBe(false);
  });

  it('calculates Euclidean distance accurately for adaptive polling', () => {
    const insidePoint: Point = { x: 750, y: 35 };
    expect(distanceToPill(insidePoint, windowBounds, pillRect)).toBe(0);

    // 10 pixels to the left of the pill (x = 680, y = 35)
    const nearPoint: Point = { x: 680, y: 35 };
    expect(distanceToPill(nearPoint, windowBounds, pillRect)).toBe(10);

    // 200 pixels away
    const farPoint: Point = { x: 490, y: 35 };
    expect(distanceToPill(farPoint, windowBounds, pillRect)).toBe(200);
  });
});
