import type { Fish, WorldId, RodId, BaitId, FishTier } from '../../../types/fishing';
import { calculateTierRates, rollTier, rollFishSpecies } from '../utils/probabilityUtils';
import { rollFishSize, calculateFishPriceWithSize } from '../utils/sizeUtils';

export interface CatchResultItem {
  fish: Fish;
  size: number;
  finalPrice: number;
  isFirstTimeCaught: boolean;
}

export interface CatchBatchResult {
  caughtItems: CatchResultItem[];
  lostDueToPoisonCount: number;
  timeRiftReward?: {
    gold: number;
    mysticGoldBait: number;
  };
  mutationPointsEarned: number;
  unlockedMultiCatchNow: boolean;
  consumedBaitId: BaitId | null;
  highestTierInBatch: FishTier;
}

/**
 * Calculates current fishing speed in seconds based on equipped rod and owned vehicles.
 */
export function getFishingSpeedSeconds(rodId: RodId, ownedVehicleIds: string[]): number {
  let speed = 0.5;

  // Tàu Đánh Cá Viễn Dương (+50% speed => 0.35s)
  if (ownedVehicleIds.includes('vehicle_trawler')) {
    speed = 0.35;
  }

  // Cần Thần Khí Không Gian reduces to 0.25s
  if (rodId === 'rod_cosmic') {
    speed = 0.25;
  }

  return speed;
}

/**
 * Executes a single fishing round (can catch 1 or multiple fish if multiCatch is active).
 */
export function executeFishingRound(params: {
  world: WorldId;
  rodId: RodId;
  baitId: BaitId | null;
  baitCount: number;
  coreHookLevel: number;
  ownedVehicleIds: string[];
  unlockedMultiCatch: boolean;
  hasGeneExtractor: boolean;
  caughtFishHistory: string[];
  collectorSkillLevel?: number;
}): CatchBatchResult {
  const {
    world,
    rodId,
    baitId,
    baitCount,
    coreHookLevel,
    ownedVehicleIds,
    unlockedMultiCatch,
    hasGeneExtractor,
    caughtFishHistory,
    collectorSkillLevel = 0,
  } = params;

  // 1. Determine number of fish to catch in this batch
  let catchCount = 1;
  const isBossAwakening = baitId === 'bait_boss_awakening';

  // Multi-catch applies if unlocked AND not using Mồi Boss Awakening
  if (unlockedMultiCatch && !isBossAwakening) {
    if (world === 1) catchCount = 3;
    else if (world === 2) catchCount = 5;
    else if (world === 3) catchCount = 10;
  }

  // 2. Bait usage: consumes 1 bait for the whole batch (or 1 bait for Boss Awakening)
  let consumedBaitId: BaitId | null = null;
  let activeBaitForRoll: BaitId | null = null;

  if (baitId && baitCount > 0) {
    consumedBaitId = baitId;
    activeBaitForRoll = baitId;
  }

  // 3. Calculate rates with active bait & rod & hook
  const rates = calculateTierRates({
    world,
    rodId,
    baitId: activeBaitForRoll,
    coreHookLevel,
  });

  const caughtItems: CatchResultItem[] = [];
  let lostDueToPoisonCount = 0;
  let mutationPointsEarned = 0;
  let unlockedMultiCatchNow = false;
  let highestTierInBatch: FishTier = 1;

  const hasAntiToxicSub = ownedVehicleIds.includes('vehicle_anti_toxic_sub');
  const hasTimeMachine = ownedVehicleIds.includes('vehicle_time_machine');

  // Check Time Rift bonus in World 3 (2% chance)
  let timeRiftReward: { gold: number; mysticGoldBait: number } | undefined;
  if (world === 3 && hasTimeMachine && Math.random() < 0.02) {
    const bonusGold = Math.floor(Math.random() * 150000) + 50000;
    const bonusBait = Math.floor(Math.random() * 50) + 50;
    timeRiftReward = { gold: bonusGold, mysticGoldBait: bonusBait };
  }

  // Roll each fish
  for (let i = 0; i < catchCount; i++) {
    // Check World 2 Poison Water hazard (6% chance of losing fish if no submarine)
    if (world === 2 && !hasAntiToxicSub && Math.random() < 0.06) {
      lostDueToPoisonCount++;
      continue;
    }

    const tier = rollTier(rates);
    if (tier > highestTierInBatch) {
      highestTierInBatch = tier;
    }

    const collectorBonusPercent = collectorSkillLevel * 5;
    const fish = rollFishSpecies(world, tier, caughtFishHistory, collectorBonusPercent);
    const isFirstTimeCaught = !caughtFishHistory.includes(fish.id);
    const size = rollFishSize(fish.minSize, fish.maxSize);
    const finalPrice = calculateFishPriceWithSize(fish, size);

    // Gene Extractor: +1 Mutation Point if tier >= 3
    if (hasGeneExtractor && tier >= 3) {
      mutationPointsEarned += 1;
    }

    // Check Tier 7 first-time catch
    if (tier === 7 && !unlockedMultiCatch && !unlockedMultiCatchNow) {
      unlockedMultiCatchNow = true;
    }

    caughtItems.push({
      fish,
      size,
      finalPrice,
      isFirstTimeCaught,
    });
  }

  return {
    caughtItems,
    lostDueToPoisonCount,
    timeRiftReward,
    mutationPointsEarned,
    unlockedMultiCatchNow,
    consumedBaitId,
    highestTierInBatch,
  };
}
