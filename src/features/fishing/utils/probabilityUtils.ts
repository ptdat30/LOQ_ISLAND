import type { FishTier, TierRates, WorldId, RodId, BaitId } from '../../../types/fishing';
import { BASE_TIER_RATES, CORE_HOOK_LEVELS } from '../data/ratesData';
import { ALL_FISH, getFishByWorldAndTier } from '../data/fishData';

/**
 * Calculates normalized tier rates considering active rod, active bait, world, and core hook level.
 */
export function calculateTierRates(params: {
  world: WorldId;
  rodId: RodId;
  baitId: BaitId | null;
  coreHookLevel: number;
}): TierRates {
  const { world, rodId, baitId, coreHookLevel } = params;

  // Case 1: Mồi "Thức Tỉnh Boss" - 50% Tier 6, 50% Tier 7
  if (baitId === 'bait_boss_awakening') {
    return {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 50.0,
      7: 50.0,
    };
  }

  // Case 2: Mồi Vàng Ròng Thần Bí - Chuẩn hóa theo tỉ trọng gốc của Tier 4-7
  if (baitId === 'bait_mystic_gold') {
    return {
      1: 0,
      2: 0,
      3: 0,
      4: 75.0,
      5: 20.0,
      6: 4.5,
      7: 0.5,
    };
  }

  // Clone base rates
  const rates: TierRates = { ...BASE_TIER_RATES };
  let additionalDeductionNeeded = 0;

  // 1. Apply Mồi Câu (Bait)
  if (baitId === 'bait_corn') {
    // Mồi Bột Ngô Tẩm Hương: Giảm 10% Tier 1, chia đều +5% cho Tier 2 và +5% cho Tier 3
    rates[1] -= 10.0;
    rates[2] += 5.0;
    rates[3] += 5.0;
  } else if (baitId === 'bait_glow_blood' && world === 2) {
    // Mồi Máu Dạ Quang: Nhân đôi (×2) tỉ lệ Tier 4 và Tier 5
    const tier4Add = rates[4]; // 1.5%
    const tier5Add = rates[5]; // 0.4%
    rates[4] += tier4Add;
    rates[5] += tier5Add;
    additionalDeductionNeeded += tier4Add + tier5Add;
  } else if (baitId === 'bait_amber_fossil' && world === 3) {
    // Mồi Hóa Thạch Hổ Phách: Tăng 50% tỉ lệ Tier 5+ (×1.5)
    const tier5Add = rates[5] * 0.5;
    const tier6Add = rates[6] * 0.5;
    const tier7Add = rates[7] * 0.5;
    rates[5] += tier5Add;
    rates[6] += tier6Add;
    rates[7] += tier7Add;
    additionalDeductionNeeded += tier5Add + tier6Add + tier7Add;
  }

  // 2. Apply Cần Câu (Rod)
  if (rodId === 'rod_anti_radiation' && world === 2) {
    // Tăng 50% tỉ lệ cá Đột biến Tier 4, 5, 6 (×1.5)
    const tier4Add = rates[4] * 0.5;
    const tier5Add = rates[5] * 0.5;
    const tier6Add = rates[6] * 0.5;
    rates[4] += tier4Add;
    rates[5] += tier5Add;
    rates[6] += tier6Add;
    additionalDeductionNeeded += tier4Add + tier5Add + tier6Add;
  } else if (rodId === 'rod_dinosaur_bone' && world === 3) {
    // Tăng 50% cơ hội gặp cá Tier 5+ ở World 3 (×1.5)
    const tier5Add = rates[5] * 0.5;
    const tier6Add = rates[6] * 0.5;
    const tier7Add = rates[7] * 0.5;
    rates[5] += tier5Add;
    rates[6] += tier6Add;
    rates[7] += tier7Add;
    additionalDeductionNeeded += tier5Add + tier6Add + tier7Add;
  }

  // 3. Apply Lưỡi Câu Cốt Lõi (Core Hook Bonus)
  const hookBonus = CORE_HOOK_LEVELS.find((h) => h.level === coreHookLevel) || CORE_HOOK_LEVELS[0];
  if (hookBonus.level > 0) {
    rates[5] += hookBonus.tier5Bonus;
    rates[6] += hookBonus.tier6Bonus;
    rates[7] += hookBonus.tier7Bonus;
    additionalDeductionNeeded += hookBonus.tier5Bonus + hookBonus.tier6Bonus + hookBonus.tier7Bonus;
  }

  // 4. Deduct additional buffs from Tier 1, then Tier 2, Tier 3...
  let remainingToDeduct = additionalDeductionNeeded;
  for (let tier = 1; tier <= 7; tier++) {
    const t = tier as FishTier;
    if (remainingToDeduct <= 0) break;
    if (rates[t] > 0) {
      if (rates[t] >= remainingToDeduct) {
        rates[t] -= remainingToDeduct;
        remainingToDeduct = 0;
      } else {
        remainingToDeduct -= rates[t];
        rates[t] = 0;
      }
    }
  }

  // Normalize to 100% just in case of floating-point inaccuracies
  const sum = (Object.values(rates) as number[]).reduce((a, b) => a + b, 0);
  if (sum > 0 && Math.abs(sum - 100) > 0.0001) {
    for (const key of Object.keys(rates)) {
      const t = Number(key) as FishTier;
      rates[t] = (rates[t] / sum) * 100;
    }
  }

  return rates;
}

/**
 * Rolls a random tier (1-7) using the given TierRates.
 */
export function rollTier(rates: TierRates): FishTier {
  const rand = Math.random() * 100;
  let cumulative = 0;

  for (let t = 1; t <= 7; t++) {
    const tier = t as FishTier;
    cumulative += rates[tier];
    if (rand <= cumulative) {
      return tier;
    }
  }

  return 1;
}

/**
 * Picks a random fish species from the target World and Tier.
 * If collectorBonusPercent > 0, increases odds of selecting an uncaught species.
 */
export function rollFishSpecies(
  world: WorldId,
  tier: FishTier,
  caughtFishHistory: string[] = [],
  collectorBonusPercent = 0
) {
  const candidates = getFishByWorldAndTier(world, tier);
  if (candidates.length === 0) {
    return ALL_FISH[0];
  }

  const uncaughtCandidates = candidates.filter((f) => !caughtFishHistory.includes(f.id));

  // If there are uncaught species and bonus is active
  if (uncaughtCandidates.length > 0 && collectorBonusPercent > 0) {
    const chance = Math.min(0.95, collectorBonusPercent / 100);
    if (Math.random() < chance) {
      const idx = Math.floor(Math.random() * uncaughtCandidates.length);
      return uncaughtCandidates[idx];
    }
  }

  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}
