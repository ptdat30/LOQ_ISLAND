export type FishTier = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type WorldId = 1 | 2 | 3;

export interface Fish {
  id: string;
  name: string;
  tier: FishTier;
  world: WorldId;
  basePrice: number;
  description?: string;
  isBoss?: boolean;
  minSize: number; // in kg
  maxSize: number; // in kg
}

export type TierRates = Record<FishTier, number>;

export type RodId =
  | 'rod_bamboo'
  | 'rod_carbon'
  | 'rod_anti_radiation'
  | 'rod_nuclear'
  | 'rod_dinosaur_bone'
  | 'rod_cosmic';

export interface Rod {
  id: RodId;
  name: string;
  priceGold: number;
  priceDiamond: number;
  description: string;
  requiredWorldToBuy?: WorldId;
  unlocksWorld?: WorldId;
  priceMultiplier?: (world: WorldId) => number;
  speedSeconds?: number;
  tierBuff?: string;
}

export type BaitId =
  | 'bait_corn'
  | 'bait_glow_blood'
  | 'bait_amber_fossil'
  | 'bait_mystic_gold'
  | 'bait_boss_awakening';

export interface BaitPack {
  id: string;
  baitId: BaitId;
  name: string;
  quantity: number;
  priceGold: number;
  priceDiamond: number;
  description: string;
}

export type VehicleId =
  | 'vehicle_coracle'
  | 'vehicle_trawler'
  | 'vehicle_anti_toxic_sub'
  | 'vehicle_time_machine';

export interface Vehicle {
  id: VehicleId;
  name: string;
  priceGold: number;
  priceDiamond: number;
  description: string;
  targetWorld?: WorldId;
}

export type AutoUpgradeId =
  | 'upgrade_sorter'
  | 'upgrade_quantum_basket'
  | 'upgrade_drone'
  | 'upgrade_gene_extractor';

export interface AutoUpgrade {
  id: AutoUpgradeId;
  name: string;
  priceGold: number;
  priceDiamond: number;
  description: string;
  level?: number;
  maxLevel?: number;
}

export interface BasketItem {
  fishId: string;
  count: number;
}

export interface IslandColorCustomization {
  id: string;
  name: string;
  priceGold: number;
  priceDiamond: number;
  colorValue: string;
  cssStyle?: React.CSSProperties;
}

export interface IslandEffectCustomization {
  id: string;
  name: string;
  priceGold: number;
  priceDiamond: number;
  effectType: 'glow_light' | 'glow_strong' | 'pulse' | 'particles' | 'ripple' | 'aurora' | 'collection_master';
}

export interface FishCollectionEntry {
  fishId: string;
  status: 'locked' | 'unlocked';
  catchCount: number;
  firstCaughtAt: number | null; // timestamp ms
  recordSize: number; // in kg
  isAvatar: boolean;
}

export interface PlayerFishingState {
  gold: number;
  diamonds: number;
  mutationPoints: number;
  currentWorld: WorldId;
  currentRodId: RodId;
  ownedRodIds: RodId[];
  currentBaitId: BaitId | null;
  baitInventory: Record<BaitId, number>;
  currentVehicleId: VehicleId;
  ownedVehicleIds: VehicleId[];
  ownedAutoUpgrades: {
    sorter: boolean;
    quantumBasket: boolean;
    droneLevel: number; // 0 = none, 1 = 50%, 2 = 75%, 3 = 100%
    geneExtractor: boolean;
  };
  coreHookLevelByRod: Record<RodId, number>; // Level 0 - 5
  unlockedWorlds: WorldId[];
  unlockedMultiCatch: boolean; // unlocked when catching Tier 7 first time
  basket: BasketItem[];
  caughtFishHistory: string[]; // fish IDs caught at least once
  fishCollection: Record<string, FishCollectionEntry>;
  hasUnlockedTier5Ever: boolean;
  collectorSkillLevel: number; // 0 - 5 (each level +5% catch chance for uncaught fish)
  hasCompletedCollectionEver: boolean; // 84/84 completion bonus flag
  islandCustomization: {
    activeColorId: string;
    ownedColorIds: string[];
    activeEffectId: string | null;
    ownedEffectIds: string[];
    activeFishAvatarId: string | null;
  };
  settings: {
    autoSellOnFull: boolean;
    stopOnFull: boolean;
    logTier1Sell: boolean;
    showFishIconOnPill: boolean;
  };
  stats: {
    goldEarnedPastHour: number;
    highestTierCaughtRecent: FishTier | null;
    highestFishCaughtRecentId: string | null;
    lastSavedTimestamp: number;
    hourlyGoldHistory: Array<{ timestamp: number; gold: number }>;
  };
}

export type FishingViewSubTab = 'fishing' | 'shop' | 'skillTree' | 'customization' | 'library';
