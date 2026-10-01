import type { Fish, WorldId, RodId } from '../../../types/fishing';
import { WORLDS_INFO, FISH_MAP } from '../data/fishData';
import { RODS } from '../data/shopData';
import { DIAMOND_DROP_CONFIG } from '../data/ratesData';

/**
 * Calculates the exact gold price when selling a specific fish.
 * Formula: basePrice * worldMultiplier * rodMultiplier
 */
export function calculateFishPrice(fish: Fish, world: WorldId, rodId: RodId): number {
  const worldInfo = WORLDS_INFO[world] || WORLDS_INFO[1];
  const rod = RODS[rodId] || RODS.rod_bamboo;

  const worldMultiplier = worldInfo.priceMultiplier;
  const rodMultiplier = rod.priceMultiplier ? rod.priceMultiplier(world) : 1;

  return Math.round(fish.basePrice * worldMultiplier * rodMultiplier);
}

/**
 * Calculates total gold and diamond rolls for selling a list of fish items.
 */
export function calculateSellValue(
  items: Array<{ fishId: string; count: number }>,
  world: WorldId,
  rodId: RodId
): { totalGold: number; totalDiamonds: number; totalCount: number } {
  let totalGold = 0;
  let totalDiamonds = 0;
  let totalCount = 0;

  for (const item of items) {
    const fish = FISH_MAP[item.fishId];
    if (!fish) continue;

    const unitPrice = calculateFishPrice(fish, world, rodId);
    totalGold += unitPrice * item.count;
    totalCount += item.count;

    // Roll diamond drops per fish sold
    if (fish.tier === 6) {
      for (let i = 0; i < item.count; i++) {
        if (Math.random() < DIAMOND_DROP_CONFIG.tier6.chance) {
          totalDiamonds += DIAMOND_DROP_CONFIG.tier6.amount;
        }
      }
    } else if (fish.tier === 7) {
      totalDiamonds += DIAMOND_DROP_CONFIG.tier7.amount * item.count;
    }
  }

  return { totalGold, totalDiamonds, totalCount };
}

/**
 * Estimates total gold value of the basket currently without rolling diamonds yet.
 */
export function estimateBasketGoldValue(
  basket: Array<{ fishId: string; count: number }>,
  world: WorldId,
  rodId: RodId
): number {
  let total = 0;
  for (const item of basket) {
    const fish = FISH_MAP[item.fishId];
    if (!fish) continue;
    total += calculateFishPrice(fish, world, rodId) * item.count;
  }
  return total;
}
