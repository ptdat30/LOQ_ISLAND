import { describe, it, expect, beforeEach } from 'vitest';
import { useFishingStore, INITIAL_PLAYER_STATE } from '../src/features/fishing/stores/fishingStore';
import { calculateTierRates } from '../src/features/fishing/utils/probabilityUtils';
import { CORE_HOOK_LEVELS } from '../src/features/fishing/data/ratesData';

describe('Fishing Game - Phase 7 Core Hook Skill Tree Verification', () => {
  beforeEach(() => {
    useFishingStore.setState({
      ...INITIAL_PLAYER_STATE,
      mutationPoints: 10000,
      currentRodId: 'rod_bamboo',
      coreHookLevelByRod: {
        rod_bamboo: 0,
        rod_carbon: 0,
        rod_anti_radiation: 0,
        rod_nuclear: 0,
        rod_dinosaur_bone: 0,
        rod_cosmic: 0,
      },
    });
  });

  it('should upgrade Core Hook step-by-step from Level 0 to Level 5', () => {
    const store = useFishingStore.getState();

    // Level 0 -> 1 (Cost 10)
    expect(store.upgradeCoreHook('rod_bamboo')).toBe(true);
    expect(useFishingStore.getState().coreHookLevelByRod.rod_bamboo).toBe(1);
    expect(useFishingStore.getState().mutationPoints).toBe(10000 - 10);

    // Level 1 -> 2 (Cost 50)
    expect(store.upgradeCoreHook('rod_bamboo')).toBe(true);
    expect(useFishingStore.getState().coreHookLevelByRod.rod_bamboo).toBe(2);

    // Level 2 -> 3 (Cost 250)
    expect(store.upgradeCoreHook('rod_bamboo')).toBe(true);
    expect(useFishingStore.getState().coreHookLevelByRod.rod_bamboo).toBe(3);

    // Level 3 -> 4 (Cost 1000)
    expect(store.upgradeCoreHook('rod_bamboo')).toBe(true);
    expect(useFishingStore.getState().coreHookLevelByRod.rod_bamboo).toBe(4);

    // Level 4 -> 5 (Cost 5000)
    expect(store.upgradeCoreHook('rod_bamboo')).toBe(true);
    expect(useFishingStore.getState().coreHookLevelByRod.rod_bamboo).toBe(5);

    // Attempting Level 5 -> 6 should fail (max level)
    expect(store.upgradeCoreHook('rod_bamboo')).toBe(false);
    expect(useFishingStore.getState().coreHookLevelByRod.rod_bamboo).toBe(5);
  });

  it('should not allow upgrading if mutation points are insufficient', () => {
    useFishingStore.setState({ mutationPoints: 5 });
    const store = useFishingStore.getState();

    expect(store.upgradeCoreHook('rod_bamboo')).toBe(false);
    expect(useFishingStore.getState().coreHookLevelByRod.rod_bamboo).toBe(0);
  });

  it('should correctly apply Core Hook level 5 rates (+25% T5, +15% T6, +5% T7)', () => {
    const rates = calculateTierRates({
      world: 1,
      rodId: 'rod_bamboo',
      baitId: null,
      coreHookLevel: 5,
    });

    // Base: T5 = 0.4 + 25 = 25.4%
    expect(rates[5]).toBeCloseTo(25.4, 3);
    // Base: T6 = 0.09 + 15 = 15.09%
    expect(rates[6]).toBeCloseTo(15.09, 3);
    // Base: T7 = 0.01 + 5 = 5.01%
    expect(rates[7]).toBeCloseTo(5.01, 3);

    // Total should still sum to 100%
    const sum = Object.values(rates).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(100, 3);
  });
});
