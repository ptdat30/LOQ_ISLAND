import { describe, it, expect } from 'vitest';
import { ALL_FISH, FISH_MAP, WORLDS_INFO, getFishByWorldAndTier } from '../src/features/fishing/data/fishData';
import { BASE_TIER_RATES, CORE_HOOK_LEVELS } from '../src/features/fishing/data/ratesData';
import { calculateTierRates, rollTier, rollFishSpecies } from '../src/features/fishing/utils/probabilityUtils';
import type { WorldId, FishTier } from '../src/types/fishing';

describe('Fishing Game - Phase 1 Data Structure & Rates Verification', () => {
  it('should have all defined fish with unique IDs and valid attributes', () => {
    expect(ALL_FISH.length).toBe(84); // 4 species * 7 tiers * 3 worlds = 84 fish

    const idSet = new Set<string>();
    ALL_FISH.forEach((fish) => {
      expect(idSet.has(fish.id)).toBe(false);
      idSet.add(fish.id);
      expect(fish.name).toBeTruthy();
      expect(fish.world).toBeGreaterThanOrEqual(1);
      expect(fish.world).toBeLessThanOrEqual(3);
      expect(fish.tier).toBeGreaterThanOrEqual(1);
      expect(fish.tier).toBeLessThanOrEqual(7);
      expect(fish.basePrice).toBeGreaterThan(0);
    });
  });

  it('should have exactly 4 species for Tier 1-7 in each world', () => {
    const worlds: WorldId[] = [1, 2, 3];
    worlds.forEach((world) => {
      for (let t = 1; t <= 7; t++) {
        const fishList = getFishByWorldAndTier(world, t as FishTier);
        expect(fishList.length).toBe(4);
      }
      const bossList = getFishByWorldAndTier(world, 7);
      expect(bossList.length).toBe(4);
      expect(bossList.some((b) => b.isBoss)).toBe(true);
    });

    // Check specific Boss names
    expect(FISH_MAP['w1_t7_leviathan'].name).toBe('Vua Biển Cả Leviathan');
    expect(FISH_MAP['w2_t7_gojira_fish'].name).toBe('Bạo Chúa Hạt Nhân Gojira-Fish');
    expect(FISH_MAP['w3_t7_megalodon'].name).toBe('Hủy Diệt Cổ Đại - Siêu Cá Mập Megalodon');
  });

  it('should have base tier rates summing to 100%', () => {
    const sum = Object.values(BASE_TIER_RATES).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(100, 5);
  });

  it('should correctly apply Mồi Bột Ngô Tẩm Hương (+5% Tier 2, +5% Tier 3, -10% Tier 1)', () => {
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

    const sum = Object.values(rates).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(100, 5);
  });

  it('should correctly apply Cần Hợp Kim Chống Bức Xạ (+50% Tier 4, 5, 6 in World 2)', () => {
    const rates = calculateTierRates({
      world: 2,
      rodId: 'rod_anti_radiation',
      baitId: null,
      coreHookLevel: 0,
    });

    // Tier 4: 1.5 * 1.5 = 2.25
    expect(rates[4]).toBeCloseTo(2.25, 4);
    // Tier 5: 0.4 * 1.5 = 0.6
    expect(rates[5]).toBeCloseTo(0.6, 4);
    // Tier 6: 0.09 * 1.5 = 0.135
    expect(rates[6]).toBeCloseTo(0.135, 4);

    const sum = Object.values(rates).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(100, 5);
  });

  it('should correctly normalize Mồi Vàng Ròng Thần Bí (Tier 4=75%, 5=20%, 6=4.5%, 7=0.5%)', () => {
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

    const sum = Object.values(rates).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it('should correctly handle Mồi Thức Tỉnh Boss (Tier 6=50%, Tier 7=50%)', () => {
    const rates = calculateTierRates({
      world: 3,
      rodId: 'rod_dinosaur_bone',
      baitId: 'bait_boss_awakening',
      coreHookLevel: 0,
    });

    expect(rates[6]).toBe(50.0);
    expect(rates[7]).toBe(50.0);
    expect(rates[1]).toBe(0);
    const sum = Object.values(rates).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it('should correctly apply Core Hook levels up to level 5 with sum = 100%', () => {
    for (let lvl = 0; lvl <= 5; lvl++) {
      const rates = calculateTierRates({
        world: 1,
        rodId: 'rod_bamboo',
        baitId: null,
        coreHookLevel: lvl,
      });

      const sum = Object.values(rates).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(100, 4);
    }
  });

  it('should roll a valid tier and species', () => {
    const rates = calculateTierRates({
      world: 1,
      rodId: 'rod_bamboo',
      baitId: null,
      coreHookLevel: 0,
    });

    for (let i = 0; i < 50; i++) {
      const tier = rollTier(rates);
      expect(tier).toBeGreaterThanOrEqual(1);
      expect(tier).toBeLessThanOrEqual(7);

      const fish = rollFishSpecies(1, tier);
      expect(fish).toBeDefined();
      expect(fish.world).toBe(1);
      expect(fish.tier).toBe(tier);
    }
  });
});
