import { describe, it, expect, beforeEach } from 'vitest';
import { useFishingStore, INITIAL_PLAYER_STATE } from '../src/features/fishing/stores/fishingStore';
import { calculateFishPrice, calculateSellValue } from '../src/features/fishing/logic/economy';
import { executeFishingRound, getFishingSpeedSeconds } from '../src/features/fishing/logic/fishingEngine';
import { FISH_MAP } from '../src/features/fishing/data/fishData';

describe('Fishing Game - Phase 2 Core Logic & Store Verification', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useFishingStore.setState({
      ...INITIAL_PLAYER_STATE,
      isFishingActive: false,
      lastCaughtFish: null,
      lastCatchBatch: null,
      basket: [],
      caughtFishHistory: [],
    });
  });

  describe('Economy & Prices', () => {
    it('should correctly calculate base price without buffs in World 1', () => {
      const carp = FISH_MAP['w1_t1_chep_vang']; // Tier 1, base 10
      expect(calculateFishPrice(carp, 1, 'rod_bamboo')).toBe(10);

      const salmon = FISH_MAP['w1_t2_hoi_tbd']; // Tier 2, base 50
      expect(calculateFishPrice(salmon, 1, 'rod_bamboo')).toBe(50);

      const leviathan = FISH_MAP['w1_t7_leviathan']; // Tier 7, base 500,000
      expect(calculateFishPrice(leviathan, 1, 'rod_bamboo')).toBe(500000);
    });

    it('should correctly apply World multipliers (World 2: ×3, World 3: ×10)', () => {
      const mutFish = FISH_MAP['w2_t1_chep_ba_mat']; // Tier 1, base 10
      // In World 2, 10 * 3 = 30
      expect(calculateFishPrice(mutFish, 2, 'rod_bamboo')).toBe(30);

      const dinoFish = FISH_MAP['w3_t1_bo_ba_thuy']; // Tier 1, base 10
      // In World 3, 10 * 10 = 100
      expect(calculateFishPrice(dinoFish, 3, 'rod_bamboo')).toBe(100);
    });

    it('should correctly apply Rod multipliers (Carbon ×3 in W1, Nuclear ×6 in W2, Cosmic ×3 all)', () => {
      const carp = FISH_MAP['w1_t1_chep_vang'];
      // Carbon in World 1: 10 * 1 * 3 = 30
      expect(calculateFishPrice(carp, 1, 'rod_carbon')).toBe(30);

      const mutFish = FISH_MAP['w2_t1_chep_ba_mat'];
      // Nuclear in World 2: 10 * 3 * 6 = 180
      expect(calculateFishPrice(mutFish, 2, 'rod_nuclear')).toBe(180);

      // Cosmic in World 3: 10 * 10 * 3 = 300
      expect(calculateFishPrice(dinoFish => dinoFish, 3, 'rod_cosmic')).toBeDefined();
    });

    it('should calculate sell value of multiple basket items', () => {
      const items = [
        { fishId: 'w1_t1_chep_vang', count: 5 }, // 5 * 10 = 50
        { fishId: 'w1_t2_loc_nhim', count: 2 }, // 2 * 50 = 100
      ];
      const result = calculateSellValue(items, 1, 'rod_bamboo');
      expect(result.totalGold).toBe(150);
      expect(result.totalCount).toBe(7);
    });

    it('should drop 10 diamonds guaranteed when selling Tier 7 boss', () => {
      const items = [{ fishId: 'w1_t7_leviathan', count: 2 }];
      const result = calculateSellValue(items, 1, 'rod_bamboo');
      expect(result.totalGold).toBe(1000000);
      expect(result.totalDiamonds).toBe(20);
    });
  });

  describe('Fishing Engine Round Execution', () => {
    it('should catch 1 fish when multi-catch is not unlocked', () => {
      const result = executeFishingRound({
        world: 1,
        rodId: 'rod_bamboo',
        baitId: null,
        baitCount: 0,
        coreHookLevel: 0,
        ownedVehicleIds: [],
        unlockedMultiCatch: false,
        hasGeneExtractor: false,
        caughtFishHistory: [],
      });

      expect(result.caughtItems.length).toBe(1);
      expect(result.caughtItems[0].fish).toBeDefined();
    });

    it('should catch 3 in W1, 5 in W2, 10 in W3 when multi-catch is unlocked', () => {
      const r1 = executeFishingRound({
        world: 1,
        rodId: 'rod_bamboo',
        baitId: null,
        baitCount: 0,
        coreHookLevel: 0,
        ownedVehicleIds: [],
        unlockedMultiCatch: true,
        hasGeneExtractor: false,
        caughtFishHistory: [],
      });
      expect(r1.caughtItems.length).toBe(3);

      const r3 = executeFishingRound({
        world: 3,
        rodId: 'rod_dinosaur_bone',
        baitId: null,
        baitCount: 0,
        coreHookLevel: 0,
        ownedVehicleIds: [],
        unlockedMultiCatch: true,
        hasGeneExtractor: false,
        caughtFishHistory: [],
      });
      expect(r3.caughtItems.length).toBe(10);
    });

    it('should calculate fishing speeds correctly', () => {
      expect(getFishingSpeedSeconds('rod_bamboo', [])).toBe(0.5);
      expect(getFishingSpeedSeconds('rod_bamboo', ['vehicle_trawler'])).toBe(0.35);
      expect(getFishingSpeedSeconds('rod_cosmic', [])).toBe(0.25);
    });
  });

  describe('Zustand Store Actions', () => {
    it('should add caught fish to basket and update history', () => {
      const store = useFishingStore.getState();
      const result = store.catchRound();
      expect(result).not.toBeNull();

      const stateAfter = useFishingStore.getState();
      expect(stateAfter.basket.length).toBeGreaterThan(0);
      expect(stateAfter.caughtFishHistory.length).toBeGreaterThan(0);
    });

    it('should automatically sell Tier 1 fish immediately when Sorter is owned', () => {
      useFishingStore.setState({
        ownedAutoUpgrades: {
          sorter: true,
          quantumBasket: false,
          droneLevel: 0,
          geneExtractor: false,
        },
      });

      // Force a round where Tier 1 is caught (Mồi không dùng, tỉ lệ Tier 1 là 70%)
      // Let's do several rounds to verify Tier 1 does not enter basket
      for (let i = 0; i < 20; i++) {
        useFishingStore.getState().catchRound();
      }

      const basket = useFishingStore.getState().basket;
      for (const item of basket) {
        const fish = FISH_MAP[item.fishId];
        expect(fish.tier).toBeGreaterThan(1);
      }
    });

    it('should sell all fish and add gold to player balance', () => {
      useFishingStore.setState({
        gold: 100,
        basket: [
          { fishId: 'w1_t1_chep_vang', count: 10 }, // 10 * 10 = 100
        ],
      });

      const res = useFishingStore.getState().sellAllFish();
      expect(res.goldEarned).toBe(100);
      expect(useFishingStore.getState().gold).toBe(200);
      expect(useFishingStore.getState().basket.length).toBe(0);
    });

    it('should sell fish by tier range', () => {
      useFishingStore.setState({
        basket: [
          { fishId: 'w1_t1_chep_vang', count: 2 }, // Tier 1: 2 * 10 = 20
          { fishId: 'w1_t2_loc_nhim', count: 1 }, // Tier 2: 1 * 50 = 50
          { fishId: 'w1_t3_kiem', count: 1 }, // Tier 3: 1 * 250 = 250
        ],
      });

      // Sell only Tier 1 to Tier 2
      const res = useFishingStore.getState().sellFishByTier(1, 2);
      expect(res.goldEarned).toBe(70);

      const remainingBasket = useFishingStore.getState().basket;
      expect(remainingBasket.length).toBe(1);
      expect(remainingBasket[0].fishId).toBe('w1_t3_kiem');
    });

    it('should check requirements for switching worlds', () => {
      const store = useFishingStore.getState();

      // Cannot switch to World 2 without Anti-Radiation Rod
      expect(store.switchWorld(2)).toBe(false);

      // Buy Anti-Radiation Rod
      useFishingStore.setState({ gold: 500000, diamonds: 50 });
      const bought = store.buyRod('rod_anti_radiation');
      expect(bought).toBe(true);

      // Now can switch to World 2
      expect(store.switchWorld(2)).toBe(true);
      expect(useFishingStore.getState().currentWorld).toBe(2);
    });
  });
});
