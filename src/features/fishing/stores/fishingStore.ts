import { create } from 'zustand';
import type {
  PlayerFishingState,
  FishTier,
  WorldId,
  RodId,
  BaitId,
  VehicleId,
  AutoUpgradeId,
  FishingViewSubTab,
  Fish,
  BasketItem,
} from '../../../types/fishing';
import { executeFishingRound, CatchBatchResult } from '../logic/fishingEngine';
import { calculateSellValue, calculateFishPrice, estimateBasketGoldValue } from '../logic/economy';
import { RODS, BAITS_INFO, AUTO_UPGRADES_CONFIG, VEHICLES } from '../data/shopData';
import { CORE_HOOK_LEVELS } from '../data/ratesData';
import { FISH_MAP } from '../data/fishData';
import { ISLAND_COLORS, ISLAND_EFFECTS } from '../data/islandCustomizationData';

import { ALL_FISH } from '../data/fishData';
import { rollFishSpecies } from '../utils/probabilityUtils';
import { rollFishSize } from '../utils/sizeUtils';
import type { FishCollectionEntry } from '../../../types/fishing';

const STORAGE_KEY = 'dynamic_island_fishing_save_v1';

export const createDefaultFishCollection = (): Record<string, FishCollectionEntry> => {
  return ALL_FISH.reduce<Record<string, FishCollectionEntry>>((acc, fish) => {
    acc[fish.id] = {
      fishId: fish.id,
      status: 'locked',
      catchCount: 0,
      firstCaughtAt: null,
      recordSize: 0,
      isAvatar: false,
    };
    return acc;
  }, {});
};

export const INITIAL_PLAYER_STATE: PlayerFishingState = {
  gold: 0,
  diamonds: 0,
  mutationPoints: 0,
  currentWorld: 1,
  currentRodId: 'rod_bamboo',
  ownedRodIds: ['rod_bamboo'],
  currentBaitId: null,
  baitInventory: {
    bait_corn: 0,
    bait_glow_blood: 0,
    bait_amber_fossil: 0,
    bait_mystic_gold: 0,
    bait_boss_awakening: 0,
  },
  currentVehicleId: 'vehicle_coracle',
  ownedVehicleIds: ['vehicle_coracle'],
  ownedAutoUpgrades: {
    sorter: false,
    quantumBasket: false,
    droneLevel: 0,
    geneExtractor: false,
  },
  coreHookLevelByRod: {
    rod_bamboo: 0,
    rod_carbon: 0,
    rod_anti_radiation: 0,
    rod_nuclear: 0,
    rod_dinosaur_bone: 0,
    rod_cosmic: 0,
  },
  unlockedWorlds: [1],
  unlockedMultiCatch: false,
  basket: [],
  caughtFishHistory: [],
  fishCollection: createDefaultFishCollection(),
  hasUnlockedTier5Ever: false,
  collectorSkillLevel: 0,
  hasCompletedCollectionEver: false,
  islandCustomization: {
    activeColorId: 'color_default_black',
    ownedColorIds: ['color_default_black'],
    activeEffectId: null,
    ownedEffectIds: [],
    activeFishAvatarId: null,
  },
  settings: {
    autoSellOnFull: true,
    stopOnFull: false,
    logTier1Sell: false,
    showFishIconOnPill: false,
  },
  stats: {
    goldEarnedPastHour: 0,
    highestTierCaughtRecent: null,
    highestFishCaughtRecentId: null,
    lastSavedTimestamp: Date.now(),
    hourlyGoldHistory: [],
  },
};

interface FishingStoreState extends PlayerFishingState {
  // Runtime UI state
  isFishingActive: boolean;
  lastCaughtFish: Fish | null;
  lastCatchBatch: CatchBatchResult | null;
  activeSubTab: FishingViewSubTab;
  celebrationTier: FishTier | null;
  bannerMessage: string | null;
  offlineEarningsReport: { gold: number; hours: number; newFishNames?: string[] } | null;
  newFishNotification: string | null;
  collectionCompletedCelebration: boolean;
  newUncaughtPillAlert: string | null;

  // Actions
  initStore: () => void;
  saveToStorage: () => void;
  setFishingActive: (active: boolean) => void;
  setActiveSubTab: (tab: FishingViewSubTab) => void;
  clearCelebration: () => void;
  dismissOfflineReport: () => void;
  clearNewFishNotification: () => void;
  clearNewUncaughtPillAlert: () => void;
  dismissCollectionCompletionCelebration: () => void;

  catchRound: () => CatchBatchResult | null;
  sellAllFish: () => { goldEarned: number; diamondsEarned: number };
  sellFishByTier: (minTier: FishTier, maxTier: FishTier) => { goldEarned: number; diamondsEarned: number };
  getBasketEstimatedValue: () => number;

  switchWorld: (world: WorldId) => boolean;
  equipRod: (rodId: RodId) => void;
  equipBait: (baitId: BaitId | null) => void;
  equipVehicle: (vehicleId: VehicleId) => void;

  buyRod: (rodId: RodId) => boolean;
  buyBaitPack: (baitId: BaitId, packIndex: number) => boolean;
  buyAutoUpgrade: (upgradeId: AutoUpgradeId) => boolean;
  buyVehicle: (vehicleId: VehicleId) => boolean;
  upgradeCoreHook: (rodId: RodId) => boolean;

  buyIslandColor: (colorId: string) => boolean;
  equipIslandColor: (colorId: string) => void;
  buyIslandEffect: (effectId: string) => boolean;
  equipIslandEffect: (effectId: string | null) => void;
  equipFishAvatar: (fishId: string | null) => void;
  setFishAvatar: (fishId: string | null) => void;
  upgradeCollectorSkill: () => boolean;

  updateSettings: (settings: Partial<PlayerFishingState['settings']>) => void;

  isLibraryEnlarged: boolean;
  inspectingFishId: string | null;
  toggleLibraryEnlarged: () => void;
  setLibraryEnlarged: (enlarged: boolean) => void;
  inspectFish: (fishId: string | null) => void;
}

export const useFishingStore = create<FishingStoreState>((set, get) => ({
  ...INITIAL_PLAYER_STATE,

  isFishingActive: false,
  lastCaughtFish: null,
  lastCatchBatch: null,
  activeSubTab: 'fishing',
  celebrationTier: null,
  bannerMessage: null,
  offlineEarningsReport: null,
  newFishNotification: null,
  collectionCompletedCelebration: false,
  newUncaughtPillAlert: null,
  isLibraryEnlarged: false,
  inspectingFishId: null,

  toggleLibraryEnlarged: () => set((s) => ({ isLibraryEnlarged: !s.isLibraryEnlarged })),
  setLibraryEnlarged: (enlarged) => set({ isLibraryEnlarged: enlarged }),
  inspectFish: (fishId) => set({ inspectingFishId: fishId, activeSubTab: fishId ? 'library' : get().activeSubTab }),

  initStore: () => {
    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PlayerFishingState>;
        const merged: PlayerFishingState = {
          ...INITIAL_PLAYER_STATE,
          ...parsed,
          baitInventory: {
            ...INITIAL_PLAYER_STATE.baitInventory,
            ...(parsed.baitInventory || {}),
          },
          ownedAutoUpgrades: {
            ...INITIAL_PLAYER_STATE.ownedAutoUpgrades,
            ...(parsed.ownedAutoUpgrades || {}),
          },
          coreHookLevelByRod: {
            ...INITIAL_PLAYER_STATE.coreHookLevelByRod,
            ...(parsed.coreHookLevelByRod || {}),
          },
          islandCustomization: {
            ...INITIAL_PLAYER_STATE.islandCustomization,
            ...(parsed.islandCustomization || {}),
          },
          settings: {
            ...INITIAL_PLAYER_STATE.settings,
            ...(parsed.settings || {}),
          },
          fishCollection: {
            ...createDefaultFishCollection(),
            ...(parsed.fishCollection || {}),
          },
          hasUnlockedTier5Ever: parsed.hasUnlockedTier5Ever ?? INITIAL_PLAYER_STATE.hasUnlockedTier5Ever,
          collectorSkillLevel: parsed.collectorSkillLevel ?? INITIAL_PLAYER_STATE.collectorSkillLevel,
          hasCompletedCollectionEver: parsed.hasCompletedCollectionEver ?? INITIAL_PLAYER_STATE.hasCompletedCollectionEver,
          stats: {
            ...INITIAL_PLAYER_STATE.stats,
            ...(parsed.stats || {}),
          },
        };

        // Offline Earning Calculation (if Drone owned)
        const now = Date.now();
        const lastSaved = merged.stats.lastSavedTimestamp || now;
        const elapsedMs = Math.max(0, now - lastSaved);
        const elapsedHours = Math.min(24, elapsedMs / (1000 * 60 * 60)); // capped at 24 hours

        let offlineGold = 0;
        const newOfflineFishNames: string[] = [];
        const droneLevel = merged.ownedAutoUpgrades.droneLevel;
        if (droneLevel > 0 && elapsedHours > 0.05) {
          // Estimated earning per hour: base around 72,000 * world * multiplier
          const dronePercent = droneLevel === 1 ? 0.5 : droneLevel === 2 ? 0.75 : 1.0;
          const worldMultiplier = merged.currentWorld === 3 ? 10 : merged.currentWorld === 2 ? 3 : 1;
          const baseGoldPerHour = 60000 * worldMultiplier;
          offlineGold = Math.round(baseGoldPerHour * elapsedHours * dronePercent);

          // Simulate offline species catches (up to 20 rolls based on hours)
          const simulatedCatches = Math.min(20, Math.floor(elapsedHours * 4));
          for (let i = 0; i < simulatedCatches; i++) {
            const tier = Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 2 : 3;
            const fish = rollFishSpecies(merged.currentWorld, tier as any, merged.caughtFishHistory);
            const entry = merged.fishCollection[fish.id];
            if (entry && entry.status === 'locked') {
              entry.status = 'unlocked';
              entry.firstCaughtAt = Date.now();
              entry.catchCount = 1;
              entry.recordSize = rollFishSize(fish.minSize, fish.maxSize);
              if (!merged.caughtFishHistory.includes(fish.id)) {
                merged.caughtFishHistory.push(fish.id);
              }
              if (!newOfflineFishNames.includes(fish.name)) {
                newOfflineFishNames.push(fish.name);
              }
            }
          }

          if (offlineGold > 0 || newOfflineFishNames.length > 0) {
            merged.gold += offlineGold;
            set({
              ...merged,
              offlineEarningsReport: {
                gold: offlineGold,
                hours: Math.round(elapsedHours * 10) / 10,
                newFishNames: newOfflineFishNames,
              },
            });
            return;
          }
        }

        set({ ...merged });
      }
    } catch (e) {
      console.error('Failed to load fishing state from localStorage', e);
    }
  },

  saveToStorage: () => {
    try {
      if (typeof localStorage === 'undefined') return;
      const state = get();
      const persistData: PlayerFishingState = {
        gold: state.gold,
        diamonds: state.diamonds,
        mutationPoints: state.mutationPoints,
        currentWorld: state.currentWorld,
        currentRodId: state.currentRodId,
        ownedRodIds: state.ownedRodIds,
        currentBaitId: state.currentBaitId,
        baitInventory: state.baitInventory,
        currentVehicleId: state.currentVehicleId,
        ownedVehicleIds: state.ownedVehicleIds,
        ownedAutoUpgrades: state.ownedAutoUpgrades,
        coreHookLevelByRod: state.coreHookLevelByRod,
        unlockedWorlds: state.unlockedWorlds,
        unlockedMultiCatch: state.unlockedMultiCatch,
        basket: state.basket,
        caughtFishHistory: state.caughtFishHistory,
        fishCollection: state.fishCollection,
        hasUnlockedTier5Ever: state.hasUnlockedTier5Ever,
        collectorSkillLevel: state.collectorSkillLevel,
        hasCompletedCollectionEver: state.hasCompletedCollectionEver,
        islandCustomization: state.islandCustomization,
        settings: state.settings,
        stats: {
          ...state.stats,
          lastSavedTimestamp: Date.now(),
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistData));
    } catch (e) {
      console.error('Failed to save fishing state to localStorage', e);
    }
  },

  setFishingActive: (active) => set({ isFishingActive: active }),
  setActiveSubTab: (tab) => set({ activeSubTab: tab }),
  clearCelebration: () => set({ celebrationTier: null }),
  dismissOfflineReport: () => set({ offlineEarningsReport: null }),
  clearNewFishNotification: () => set({ newFishNotification: null }),
  clearNewUncaughtPillAlert: () => set({ newUncaughtPillAlert: null }),
  dismissCollectionCompletionCelebration: () => set({ collectionCompletedCelebration: false }),

  catchRound: () => {
    const state = get();

    // Guard: Do not process new catches if celebration modal is currently active
    if (state.celebrationTier !== null || state.collectionCompletedCelebration) {
      return null;
    }

    const currentBait = state.currentBaitId;
    const baitCount = currentBait ? state.baitInventory[currentBait] || 0 : 0;
    const currentRod = state.currentRodId;
    const hookLevel = state.coreHookLevelByRod[currentRod] || 0;

    // Check basket limit before rolling
    const isQuantum = state.ownedAutoUpgrades.quantumBasket;
    const currentBasketCount = state.basket.reduce((sum, item) => sum + item.count, 0);
    const maxCapacity = isQuantum ? Infinity : 1000;

    if (currentBasketCount >= maxCapacity && state.settings.stopOnFull) {
      set({ bannerMessage: 'Giỏ đã đầy! Tạm dừng câu.' });
      return null;
    }

    // Execute round
    const result = executeFishingRound({
      world: state.currentWorld,
      rodId: currentRod,
      baitId: currentBait,
      baitCount,
      coreHookLevel: hookLevel,
      ownedVehicleIds: state.ownedVehicleIds,
      unlockedMultiCatch: state.unlockedMultiCatch,
      hasGeneExtractor: state.ownedAutoUpgrades.geneExtractor,
      caughtFishHistory: state.caughtFishHistory,
      collectorSkillLevel: state.collectorSkillLevel,
    });

    // Handle bait reduction
    const updatedBaitInventory = { ...state.baitInventory };
    let nextBaitId = state.currentBaitId;
    if (result.consumedBaitId) {
      const remaining = Math.max(0, (updatedBaitInventory[result.consumedBaitId] || 1) - 1);
      updatedBaitInventory[result.consumedBaitId] = remaining;
      if (remaining === 0) {
        nextBaitId = null;
      }
    }

    // Process caught items
    let goldGainedImmediate = 0;
    let newHistory = [...state.caughtFishHistory];
    const newBasketMap = new Map<string, number>();
    state.basket.forEach((item) => newBasketMap.set(item.fishId, item.count));

    let bannerMsg = state.bannerMessage;
    if (result.lostDueToPoisonCount > 0) {
      bannerMsg = `Nước Độc làm đứt dây! Mất ${result.lostDueToPoisonCount} con cá.`;
    }

    if (result.timeRiftReward) {
      goldGainedImmediate += result.timeRiftReward.gold;
      updatedBaitInventory.bait_mystic_gold =
        (updatedBaitInventory.bait_mystic_gold || 0) + result.timeRiftReward.mysticGoldBait;
      bannerMsg = `Lỗ Hổng Thời Gian: +${result.timeRiftReward.gold.toLocaleString()} vàng & ${result.timeRiftReward.mysticGoldBait} Mồi Vàng Ròng!`;
    }

    let basketCountAcc = currentBasketCount;
    const updatedCollection = { ...state.fishCollection };
    let newlyUnlockedFishName: string | null = null;
    let unlockedAnyTier5 = false;

    for (const item of result.caughtItems) {
      const fish = item.fish;
      if (!newHistory.includes(fish.id)) {
        newHistory.push(fish.id);
      }

      const existingEntry = updatedCollection[fish.id] || {
        fishId: fish.id,
        status: 'locked',
        catchCount: 0,
        firstCaughtAt: null,
        recordSize: 0,
        isAvatar: false,
      };

      if (existingEntry.status === 'locked') {
        newlyUnlockedFishName = fish.name;
        if (fish.tier >= 5) {
          unlockedAnyTier5 = true;
        }
      }

      updatedCollection[fish.id] = {
        ...existingEntry,
        status: 'unlocked',
        catchCount: existingEntry.catchCount + 1,
        firstCaughtAt: existingEntry.firstCaughtAt ?? Date.now(),
        recordSize: Math.max(existingEntry.recordSize, item.size),
      };

      // Máy Phân Loại Thủy Hải Sản: Tự động bán Tier 1 ngay lập tức
      if (state.ownedAutoUpgrades.sorter && fish.tier === 1) {
        const price = item.finalPrice || calculateFishPrice(fish, state.currentWorld, currentRod);
        goldGainedImmediate += price;
        if (state.settings.logTier1Sell) {
          bannerMsg = `+${price} vàng (${fish.name})`;
        }
        continue;
      }

      // Check basket full
      if (basketCountAcc >= maxCapacity) {
        // Auto-sell newly caught fish
        const price = item.finalPrice || calculateFishPrice(fish, state.currentWorld, currentRod);
        goldGainedImmediate += price;
        bannerMsg = 'Giỏ đầy — Tự động bán cá mới';
      } else {
        // Add to basket
        const count = newBasketMap.get(fish.id) || 0;
        newBasketMap.set(fish.id, count + 1);
        basketCountAcc++;
      }
    }

    const updatedBasket: BasketItem[] = Array.from(newBasketMap.entries()).map(([fishId, count]) => ({
      fishId,
      count,
    }));

    // Update hourly stats
    const now = Date.now();
    const cleanHistory = (state.stats.hourlyGoldHistory || []).filter((h) => now - h.timestamp < 3600000);
    if (goldGainedImmediate > 0) {
      cleanHistory.push({ timestamp: now, gold: goldGainedImmediate });
    }
    const pastHourGold = cleanHistory.reduce((sum, h) => sum + h.gold, 0);

    // Find celebratory fish (highest tier in batch if >= 5) or fallback to last caught
    const celebratoryFishItem = result.caughtItems
      .filter((item) => item.fish.tier >= 5)
      .sort((a, b) => b.fish.tier - a.fish.tier)[0];
    const celebratoryFish = celebratoryFishItem ? celebratoryFishItem.fish : null;

    const lastFish = celebratoryFish || (result.caughtItems.length > 0 ? result.caughtItems[result.caughtItems.length - 1].fish : null);

    let celebrationTier: FishTier | null = null;
    if (result.highestTierInBatch >= 5) {
      celebrationTier = result.highestTierInBatch;
    }

    // Check 100% Collection completion (84/84)
    const totalUnlocked = Object.values(updatedCollection).filter((c) => c.status === 'unlocked').length;
    let completedCelebrationNow = false;
    let bonusDiamonds = 0;
    let hasCompletedNow = state.hasCompletedCollectionEver;
    const updatedCustomization = { ...state.islandCustomization };

    if (totalUnlocked >= 84 && !state.hasCompletedCollectionEver) {
      hasCompletedNow = true;
      completedCelebrationNow = true;
      bonusDiamonds = 10000;
      if (!updatedCustomization.ownedEffectIds.includes('effect_collection_master')) {
        updatedCustomization.ownedEffectIds = [...updatedCustomization.ownedEffectIds, 'effect_collection_master'];
      }
      updatedCustomization.activeEffectId = 'effect_collection_master';
    }

    set({
      gold: state.gold + goldGainedImmediate,
      diamonds: state.diamonds + bonusDiamonds,
      mutationPoints: state.mutationPoints + result.mutationPointsEarned,
      baitInventory: updatedBaitInventory,
      currentBaitId: nextBaitId,
      basket: updatedBasket,
      caughtFishHistory: newHistory,
      fishCollection: updatedCollection,
      hasUnlockedTier5Ever: state.hasUnlockedTier5Ever || unlockedAnyTier5,
      hasCompletedCollectionEver: hasCompletedNow,
      collectionCompletedCelebration: completedCelebrationNow || state.collectionCompletedCelebration,
      newFishNotification: newlyUnlockedFishName ?? state.newFishNotification,
      newUncaughtPillAlert: newlyUnlockedFishName ?? state.newUncaughtPillAlert,
      islandCustomization: updatedCustomization,
      unlockedMultiCatch: state.unlockedMultiCatch || result.unlockedMultiCatchNow,
      lastCaughtFish: lastFish,
      lastCatchBatch: result,
      celebrationTier,
      bannerMessage: bannerMsg,
      stats: {
        ...state.stats,
        goldEarnedPastHour: pastHourGold,
        highestTierCaughtRecent:
          result.highestTierInBatch > (state.stats.highestTierCaughtRecent || 0)
            ? result.highestTierInBatch
            : state.stats.highestTierCaughtRecent,
        highestFishCaughtRecentId: lastFish ? lastFish.id : state.stats.highestFishCaughtRecentId,
        hourlyGoldHistory: cleanHistory,
      },
    });

    return result;
  },

  sellAllFish: () => {
    const state = get();
    if (state.basket.length === 0) return { goldEarned: 0, diamondsEarned: 0 };

    const { totalGold, totalDiamonds } = calculateSellValue(
      state.basket,
      state.currentWorld,
      state.currentRodId
    );

    const now = Date.now();
    const cleanHistory = (state.stats.hourlyGoldHistory || []).filter((h) => now - h.timestamp < 3600000);
    cleanHistory.push({ timestamp: now, gold: totalGold });

    set({
      gold: state.gold + totalGold,
      diamonds: state.diamonds + totalDiamonds,
      basket: [],
      stats: {
        ...state.stats,
        goldEarnedPastHour: cleanHistory.reduce((s, h) => s + h.gold, 0),
        hourlyGoldHistory: cleanHistory,
      },
    });

    get().saveToStorage();
    return { goldEarned: totalGold, diamondsEarned: totalDiamonds };
  },

  sellFishByTier: (minTier, maxTier) => {
    const state = get();
    const toSell: BasketItem[] = [];
    const toKeep: BasketItem[] = [];

    state.basket.forEach((item) => {
      const fish = FISH_MAP[item.fishId];
      if (fish && fish.tier >= minTier && fish.tier <= maxTier) {
        toSell.push(item);
      } else {
        toKeep.push(item);
      }
    });

    if (toSell.length === 0) return { goldEarned: 0, diamondsEarned: 0 };

    const { totalGold, totalDiamonds } = calculateSellValue(toSell, state.currentWorld, state.currentRodId);

    const now = Date.now();
    const cleanHistory = (state.stats.hourlyGoldHistory || []).filter((h) => now - h.timestamp < 3600000);
    cleanHistory.push({ timestamp: now, gold: totalGold });

    set({
      gold: state.gold + totalGold,
      diamonds: state.diamonds + totalDiamonds,
      basket: toKeep,
      stats: {
        ...state.stats,
        goldEarnedPastHour: cleanHistory.reduce((s, h) => s + h.gold, 0),
        hourlyGoldHistory: cleanHistory,
      },
    });

    get().saveToStorage();
    return { goldEarned: totalGold, diamondsEarned: totalDiamonds };
  },

  getBasketEstimatedValue: () => {
    const state = get();
    return estimateBasketGoldValue(state.basket, state.currentWorld, state.currentRodId);
  },

  switchWorld: (world) => {
    const state = get();
    if (world === 2) {
      const hasReqRod = state.ownedRodIds.includes('rod_anti_radiation');
      if (!hasReqRod) return false;
    } else if (world === 3) {
      const hasReqRod = state.ownedRodIds.includes('rod_dinosaur_bone');
      if (!hasReqRod) return false;
    }

    const unlocked = Array.from(new Set([...state.unlockedWorlds, world]));
    set({ currentWorld: world, unlockedWorlds: unlocked });
    get().saveToStorage();
    return true;
  },

  equipRod: (rodId) => {
    const state = get();
    if (state.ownedRodIds.includes(rodId)) {
      set({ currentRodId: rodId });
      get().saveToStorage();
    }
  },

  equipBait: (baitId) => {
    set({ currentBaitId: baitId });
    get().saveToStorage();
  },

  equipVehicle: (vehicleId) => {
    const state = get();
    if (state.ownedVehicleIds.includes(vehicleId)) {
      set({ currentVehicleId: vehicleId });
      get().saveToStorage();
    }
  },

  buyRod: (rodId) => {
    const state = get();
    const rod = RODS[rodId];
    if (!rod || state.ownedRodIds.includes(rodId)) return false;

    if (state.gold < rod.priceGold || state.diamonds < rod.priceDiamond) {
      return false;
    }

    const updatedOwned = [...state.ownedRodIds, rodId];
    const unlockedWorlds = [...state.unlockedWorlds];
    if (rod.unlocksWorld && !unlockedWorlds.includes(rod.unlocksWorld)) {
      unlockedWorlds.push(rod.unlocksWorld);
    }

    set({
      gold: state.gold - rod.priceGold,
      diamonds: state.diamonds - rod.priceDiamond,
      ownedRodIds: updatedOwned,
      currentRodId: rodId,
      unlockedWorlds,
    });

    get().saveToStorage();
    return true;
  },

  buyBaitPack: (baitId, packIndex) => {
    const state = get();
    const info = BAITS_INFO[baitId];
    if (!info || !info.packs[packIndex]) return false;

    const pack = info.packs[packIndex];
    if (state.gold < pack.priceGold || state.diamonds < pack.priceDiamond) {
      return false;
    }

    const currentQty = state.baitInventory[baitId] || 0;
    const updatedInventory = {
      ...state.baitInventory,
      [baitId]: currentQty + pack.quantity,
    };

    set({
      gold: state.gold - pack.priceGold,
      diamonds: state.diamonds - pack.priceDiamond,
      baitInventory: updatedInventory,
      currentBaitId: state.currentBaitId || baitId, // Auto-equip if none active
    });

    get().saveToStorage();
    return true;
  },

  buyAutoUpgrade: (upgradeId) => {
    const state = get();
    const config = AUTO_UPGRADES_CONFIG[upgradeId];
    if (!config) return false;

    const owned = { ...state.ownedAutoUpgrades };

    if (upgradeId === 'upgrade_sorter') {
      if (owned.sorter) return false;
      const levelConfig = config.levels[0];
      if (state.gold < levelConfig.priceGold || state.diamonds < levelConfig.priceDiamond) return false;
      set({
        gold: state.gold - levelConfig.priceGold,
        diamonds: state.diamonds - levelConfig.priceDiamond,
        ownedAutoUpgrades: { ...owned, sorter: true },
      });
    } else if (upgradeId === 'upgrade_quantum_basket') {
      if (owned.quantumBasket) return false;
      const levelConfig = config.levels[0];
      if (state.gold < levelConfig.priceGold || state.diamonds < levelConfig.priceDiamond) return false;
      set({
        gold: state.gold - levelConfig.priceGold,
        diamonds: state.diamonds - levelConfig.priceDiamond,
        ownedAutoUpgrades: { ...owned, quantumBasket: true },
      });
    } else if (upgradeId === 'upgrade_drone') {
      const nextLevel = owned.droneLevel + 1;
      const levelConfig = config.levels.find((l) => l.level === nextLevel);
      if (!levelConfig) return false; // Already maxed
      if (state.gold < levelConfig.priceGold || state.diamonds < levelConfig.priceDiamond) return false;
      set({
        gold: state.gold - levelConfig.priceGold,
        diamonds: state.diamonds - levelConfig.priceDiamond,
        ownedAutoUpgrades: { ...owned, droneLevel: nextLevel },
      });
    } else if (upgradeId === 'upgrade_gene_extractor') {
      if (owned.geneExtractor) return false;
      const levelConfig = config.levels[0];
      if (state.gold < levelConfig.priceGold || state.diamonds < levelConfig.priceDiamond) return false;
      set({
        gold: state.gold - levelConfig.priceGold,
        diamonds: state.diamonds - levelConfig.priceDiamond,
        ownedAutoUpgrades: { ...owned, geneExtractor: true },
      });
    }

    get().saveToStorage();
    return true;
  },

  buyVehicle: (vehicleId) => {
    const state = get();
    const vehicle = VEHICLES[vehicleId];
    if (!vehicle || state.ownedVehicleIds.includes(vehicleId)) return false;

    if (state.gold < vehicle.priceGold || state.diamonds < vehicle.priceDiamond) {
      return false;
    }

    set({
      gold: state.gold - vehicle.priceGold,
      diamonds: state.diamonds - vehicle.priceDiamond,
      ownedVehicleIds: [...state.ownedVehicleIds, vehicleId],
      currentVehicleId: vehicleId,
    });

    get().saveToStorage();
    return true;
  },

  upgradeCoreHook: (rodId) => {
    const state = get();
    const currentLevel = state.coreHookLevelByRod[rodId] || 0;
    if (currentLevel >= 5) return false;

    const nextConfig = CORE_HOOK_LEVELS.find((h) => h.level === currentLevel + 1);
    if (!nextConfig) return false;

    if (state.mutationPoints < nextConfig.costPoints) return false;

    const updatedLevels = {
      ...state.coreHookLevelByRod,
      [rodId]: currentLevel + 1,
    };

    set({
      mutationPoints: state.mutationPoints - nextConfig.costPoints,
      coreHookLevelByRod: updatedLevels,
    });

    get().saveToStorage();
    return true;
  },

  buyIslandColor: (colorId) => {
    const state = get();
    const color = ISLAND_COLORS.find((c) => c.id === colorId);
    if (!color || state.islandCustomization.ownedColorIds.includes(colorId)) return false;

    if (state.gold < color.priceGold || state.diamonds < color.priceDiamond) return false;

    set({
      gold: state.gold - color.priceGold,
      diamonds: state.diamonds - color.priceDiamond,
      islandCustomization: {
        ...state.islandCustomization,
        ownedColorIds: [...state.islandCustomization.ownedColorIds, colorId],
        activeColorId: colorId,
      },
    });

    get().saveToStorage();
    return true;
  },

  equipIslandColor: (colorId) => {
    const state = get();
    if (state.islandCustomization.ownedColorIds.includes(colorId)) {
      set({
        islandCustomization: {
          ...state.islandCustomization,
          activeColorId: colorId,
        },
      });
      get().saveToStorage();
    }
  },

  buyIslandEffect: (effectId) => {
    const state = get();
    const effect = ISLAND_EFFECTS.find((e) => e.id === effectId);
    if (!effect || state.islandCustomization.ownedEffectIds.includes(effectId)) return false;

    if (state.gold < effect.priceGold || state.diamonds < effect.priceDiamond) return false;

    set({
      gold: state.gold - effect.priceGold,
      diamonds: state.diamonds - effect.priceDiamond,
      islandCustomization: {
        ...state.islandCustomization,
        ownedEffectIds: [...state.islandCustomization.ownedEffectIds, effectId],
        activeEffectId: effectId,
      },
    });

    get().saveToStorage();
    return true;
  },

  equipIslandEffect: (effectId) => {
    const state = get();
    if (!effectId || state.islandCustomization.ownedEffectIds.includes(effectId)) {
      set({
        islandCustomization: {
          ...state.islandCustomization,
          activeEffectId: effectId,
        },
      });
      get().saveToStorage();
    }
  },

  equipFishAvatar: (fishId) => {
    get().setFishAvatar(fishId);
  },

  setFishAvatar: (fishId) => {
    const state = get();
    // Only allow setting avatar if null or if fish is unlocked / caught AND tier >= 5
    if (fishId) {
      const isUnlockedInCollection = state.fishCollection?.[fishId]?.status === 'unlocked';
      const isCaughtInHistory = state.caughtFishHistory?.includes(fishId);
      if (!isUnlockedInCollection && !isCaughtInHistory) return;
      const fish = FISH_MAP[fishId];
      if (fish && fish.tier < 5) return;
    }

    const updatedCollection = { ...state.fishCollection };
    Object.keys(updatedCollection).forEach((id) => {
      updatedCollection[id] = {
        ...updatedCollection[id],
        isAvatar: id === fishId,
      };
    });

    set({
      fishCollection: updatedCollection,
      islandCustomization: {
        ...state.islandCustomization,
        activeFishAvatarId: fishId,
      },
    });
    get().saveToStorage();
  },

  upgradeCollectorSkill: () => {
    const state = get();
    if (!state.hasUnlockedTier5Ever || state.collectorSkillLevel >= 5) return false;
    const costs = [10, 20, 35, 50, 75]; // MP cost for Level 1, 2, 3, 4, 5
    const cost = costs[state.collectorSkillLevel] || 50;
    if (state.mutationPoints < cost) return false;

    set({
      mutationPoints: state.mutationPoints - cost,
      collectorSkillLevel: state.collectorSkillLevel + 1,
    });
    get().saveToStorage();
    return true;
  },

  updateSettings: (newSettings) => {
    const state = get();
    set({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    });
    get().saveToStorage();
  },
}));
