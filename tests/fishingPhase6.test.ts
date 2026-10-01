import { describe, it, expect, beforeEach } from 'vitest';
import { useFishingStore, INITIAL_PLAYER_STATE } from '../src/features/fishing/stores/fishingStore';

describe('Fishing Game - Phase 6 Auto Upgrades & Offline Earning Verification', () => {
  beforeEach(() => {
    useFishingStore.setState({
      ...INITIAL_PLAYER_STATE,
      gold: 0,
      diamonds: 0,
      mutationPoints: 0,
      currentWorld: 1,
      basket: [],
      caughtFishHistory: [],
      celebrationTier: null,
      collectionCompletedCelebration: false,
    });
  });

  it('Gene Extractor: should grant +1 Mutation Point when catching Tier >= 3', () => {
    useFishingStore.setState({
      ownedAutoUpgrades: {
        sorter: false,
        quantumBasket: false,
        droneLevel: 0,
        geneExtractor: true,
      },
      currentBaitId: 'bait_mystic_gold', // 100% catches are Tier 4+
      baitInventory: {
        bait_corn: 0,
        bait_glow_blood: 0,
        bait_amber_fossil: 0,
        bait_mystic_gold: 10,
        bait_boss_awakening: 0,
      },
    });

    const initialPoints = useFishingStore.getState().mutationPoints;
    const res = useFishingStore.getState().catchRound();

    expect(res).not.toBeNull();
    const stateAfter = useFishingStore.getState();
    expect(stateAfter.mutationPoints).toBe(initialPoints + (res?.caughtItems.length || 0));
  });

  it('Quantum Basket: allows basket to expand beyond 1,000 capacity without auto-selling', () => {
    useFishingStore.setState({
      ownedAutoUpgrades: {
        sorter: false,
        quantumBasket: true,
        droneLevel: 0,
        geneExtractor: false,
      },
      basket: [
        { fishId: 'w1_t2_loc_nhim', count: 1000 },
      ],
    });

    // Catch more fish
    useFishingStore.getState().catchRound();

    const state = useFishingStore.getState();
    const totalCount = state.basket.reduce((sum, item) => sum + item.count, 0);
    expect(totalCount).toBeGreaterThan(1000);
  });

  it('Offline Earning: calculates gold earned based on drone level capped at 24 hours', () => {
    const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000;

    // Set mock saved state with Drone level 2 (75%)
    const mockSavedState = {
      ...INITIAL_PLAYER_STATE,
      gold: 1000,
      currentWorld: 1,
      ownedAutoUpgrades: {
        sorter: false,
        quantumBasket: false,
        droneLevel: 2, // 75%
        geneExtractor: false,
      },
      stats: {
        ...INITIAL_PLAYER_STATE.stats,
        lastSavedTimestamp: fourHoursAgo,
      },
    };

    // Mock localStorage
    const storage: Record<string, string> = {
      dynamic_island_fishing_save_v1: JSON.stringify(mockSavedState),
    };
    const originalLocalStorage = global.localStorage;
    global.localStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, val: string) => { storage[key] = val; },
      removeItem: (key: string) => { delete storage[key]; },
      clear: () => {},
      key: () => null,
      length: 1,
    };

    useFishingStore.getState().initStore();

    const state = useFishingStore.getState();
    // 4 hours * 60000 * 1 * 0.75 = 180000
    expect(state.gold).toBeGreaterThan(100000);
    expect(state.offlineEarningsReport).not.toBeNull();
    expect(state.offlineEarningsReport?.hours).toBeCloseTo(4, 1);

    global.localStorage = originalLocalStorage;
  });
});
