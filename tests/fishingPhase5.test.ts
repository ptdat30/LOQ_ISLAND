import { describe, it, expect, beforeEach } from 'vitest';
import { useFishingStore, INITIAL_PLAYER_STATE } from '../src/features/fishing/stores/fishingStore';
import { calculateTierRates, rollTier } from '../src/features/fishing/utils/probabilityUtils';
import { BASE_TIER_RATES } from '../src/features/fishing/data/ratesData';

describe('Fishing Game - Phase 5 Baits & Rate Buffs Verification', () => {
  beforeEach(() => {
    useFishingStore.setState({
      ...INITIAL_PLAYER_STATE,
      gold: 100000,
      diamonds: 1000,
      basket: [],
      caughtFishHistory: [],
    });
  });

  describe('Mathematical Rates Verification for All Baits', () => {
    it('Mồi Bột Ngô Tẩm Hương: reduces Tier 1 to 60%, adds +5% to Tier 2 and +5% to Tier 3', () => {
      const rates = calculateTierRates({
        world: 1,
        rodId: 'rod_bamboo',
        baitId: 'bait_corn',
        coreHookLevel: 0,
      });

      expect(rates[1]).toBeCloseTo(60.0, 4);
      expect(rates[2]).toBeCloseTo(27.0, 4);
      expect(rates[3]).toBeCloseTo(11.0, 4);
      expect(rates[4]).toBeCloseTo(1.5, 4);
      expect(rates[5]).toBeCloseTo(0.4, 4);
      expect(rates[6]).toBeCloseTo(0.09, 4);
      expect(rates[7]).toBeCloseTo(0.01, 4);
    });

    it('Mồi Máu Dạ Quang: doubles Tier 4 (3.0%) and Tier 5 (0.8%) in World 2 only', () => {
      // In World 2: buff active
      const ratesW2 = calculateTierRates({
        world: 2,
        rodId: 'rod_bamboo',
        baitId: 'bait_glow_blood',
        coreHookLevel: 0,
      });
      expect(ratesW2[4]).toBeCloseTo(3.0, 4);
      expect(ratesW2[5]).toBeCloseTo(0.8, 4);
      expect(ratesW2[1]).toBeCloseTo(70.0 - (1.5 + 0.4), 4);

      // In World 1: buff NOT active
      const ratesW1 = calculateTierRates({
        world: 1,
        rodId: 'rod_bamboo',
        baitId: 'bait_glow_blood',
        coreHookLevel: 0,
      });
      expect(ratesW1[4]).toBeCloseTo(1.5, 4);
      expect(ratesW1[5]).toBeCloseTo(0.4, 4);
      expect(ratesW1[1]).toBeCloseTo(70.0, 4);
    });

    it('Mồi Hóa Thạch Hổ Phách: increases Tier 5, 6, 7 by 50% in World 3 only', () => {
      // In World 3: buff active
      const ratesW3 = calculateTierRates({
        world: 3,
        rodId: 'rod_bamboo',
        baitId: 'bait_amber_fossil',
        coreHookLevel: 0,
      });
      expect(ratesW3[5]).toBeCloseTo(0.6, 4);
      expect(ratesW3[6]).toBeCloseTo(0.135, 4);
      expect(ratesW3[7]).toBeCloseTo(0.015, 4);

      // In World 1: buff NOT active
      const ratesW1 = calculateTierRates({
        world: 1,
        rodId: 'rod_bamboo',
        baitId: 'bait_amber_fossil',
        coreHookLevel: 0,
      });
      expect(ratesW1[5]).toBeCloseTo(0.4, 4);
      expect(ratesW1[6]).toBeCloseTo(0.09, 4);
      expect(ratesW1[7]).toBeCloseTo(0.01, 4);
    });

    it('Mồi Vàng Ròng Thần Bí: forces all catches to be Tier 4+ (75%, 20%, 4.5%, 0.5%)', () => {
      const rates = calculateTierRates({
        world: 1,
        rodId: 'rod_bamboo',
        baitId: 'bait_mystic_gold',
        coreHookLevel: 0,
      });

      expect(rates[1]).toBe(0);
      expect(rates[2]).toBe(0);
      expect(rates[3]).toBe(0);
      expect(rates[4]).toBe(75.0);
      expect(rates[5]).toBe(20.0);
      expect(rates[6]).toBe(4.5);
      expect(rates[7]).toBe(0.5);

      // Simulate 100 rolls: every single one must be >= Tier 4
      for (let i = 0; i < 100; i++) {
        const tier = rollTier(rates);
        expect(tier).toBeGreaterThanOrEqual(4);
      }
    });

    it('Mồi Thức Tỉnh Boss: strictly rolls Tier 6 or Tier 7 (50% / 50%)', () => {
      const rates = calculateTierRates({
        world: 1,
        rodId: 'rod_bamboo',
        baitId: 'bait_boss_awakening',
        coreHookLevel: 0,
      });

      expect(rates[1]).toBe(0);
      expect(rates[2]).toBe(0);
      expect(rates[3]).toBe(0);
      expect(rates[4]).toBe(0);
      expect(rates[5]).toBe(0);
      expect(rates[6]).toBe(50.0);
      expect(rates[7]).toBe(50.0);

      // Simulate 100 rolls: every single one must be 6 or 7
      for (let i = 0; i < 100; i++) {
        const tier = rollTier(rates);
        expect([6, 7]).toContain(tier);
      }
    });
  });

  describe('Bait Inventory & Depletion Logic', () => {
    it('should consume 1 bait per catch round and auto-unequip when reaching 0', () => {
      useFishingStore.setState({
        currentBaitId: 'bait_corn',
        baitInventory: {
          bait_corn: 1,
          bait_glow_blood: 0,
          bait_amber_fossil: 0,
          bait_mystic_gold: 0,
          bait_boss_awakening: 0,
        },
      });

      // Round 1: consumes the 1 bait
      const res1 = useFishingStore.getState().catchRound();
      expect(res1?.consumedBaitId).toBe('bait_corn');

      const stateAfter = useFishingStore.getState();
      expect(stateAfter.baitInventory.bait_corn).toBe(0);
      expect(stateAfter.currentBaitId).toBeNull();

      // Round 2: no bait consumed, fallback to base rates
      const res2 = useFishingStore.getState().catchRound();
      expect(res2?.consumedBaitId).toBeNull();
    });

    it('should allow manually equipping and unequipping baits', () => {
      const store = useFishingStore.getState();

      store.equipBait('bait_glow_blood');
      expect(useFishingStore.getState().currentBaitId).toBe('bait_glow_blood');

      store.equipBait(null);
      expect(useFishingStore.getState().currentBaitId).toBeNull();
    });
  });
});
