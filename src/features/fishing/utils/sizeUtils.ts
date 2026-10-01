import type { Fish } from '../../../types/fishing';

/**
 * Generates a random fish size (in kg) within [minSize, maxSize]
 * using a Normal (Gaussian) distribution via Box-Muller transform.
 * Most catches land near the median, rare ones near minimum or maximum.
 */
export function rollFishSize(minSize: number, maxSize: number): number {
  if (minSize >= maxSize) return minSize;

  let u1 = 0;
  let u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  const mean = (minSize + maxSize) / 2;
  const stdDev = (maxSize - minSize) / 6;
  const raw = mean + z0 * stdDev;

  const clamped = Math.max(minSize, Math.min(maxSize, raw));

  if (maxSize < 10) {
    return Math.round(clamped * 100) / 100;
  }
  if (maxSize < 1000) {
    return Math.round(clamped * 10) / 10;
  }
  return Math.round(clamped);
}

/**
 * Calculates final fish price based on caught size:
 * finalPrice = basePrice * (1 + (size - minSize) / (maxSize - minSize) * 0.5)
 * Minimum size gives 100% base price, maximum size gives 150% base price.
 */
export function calculateFishPriceWithSize(
  fishOrBasePrice: Fish | number,
  sizeOrMinSize: number,
  maxSizeArg?: number,
  sizeArg?: number
): number {
  if (typeof fishOrBasePrice === 'object') {
    const fish = fishOrBasePrice;
    const size = sizeOrMinSize;
    if (!fish.minSize || !fish.maxSize || fish.maxSize <= fish.minSize) {
      return fish.basePrice;
    }
    const ratio = (size - fish.minSize) / (fish.maxSize - fish.minSize);
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    return Math.round(fish.basePrice * (1 + clampedRatio * 0.5));
  } else {
    const basePrice = fishOrBasePrice;
    const minSize = sizeOrMinSize;
    const maxSize = maxSizeArg ?? minSize;
    const size = sizeArg ?? minSize;
    if (maxSize <= minSize) return basePrice;
    const ratio = (size - minSize) / (maxSize - minSize);
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    return Math.round(basePrice * (1 + clampedRatio * 0.5));
  }
}

/**
 * Formats size in kg for UI display.
 */
export function formatFishSize(sizeInKg: number): string {
  if (sizeInKg >= 1000) {
    return `${(sizeInKg / 1000).toFixed(1)} tấn (${sizeInKg.toLocaleString()} kg)`;
  }
  if (sizeInKg < 10) {
    return `${sizeInKg.toFixed(2)} kg`;
  }
  return `${sizeInKg.toFixed(1)} kg`;
}
