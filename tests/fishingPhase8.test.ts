import { describe, it, expect, beforeEach } from 'vitest';
import { useFishingStore, INITIAL_PLAYER_STATE } from '../src/features/fishing/stores/fishingStore';

describe('Fishing Game - Phase 8 Dynamic Island Customization Verification', () => {
  beforeEach(() => {
    useFishingStore.setState({
      ...INITIAL_PLAYER_STATE,
      gold: 5000000,
      diamonds: 2000,
      islandCustomization: {
        activeColorId: 'color_default_black',
        ownedColorIds: ['color_default_black'],
        activeEffectId: null,
        ownedEffectIds: [],
        activeFishAvatarId: null,
      },
      caughtFishHistory: ['w1_t5_tam_hoang_gia'], // Only caught Beluga
    });
  });

  it('should purchase and equip Island Colors', () => {
    const store = useFishingStore.getState();

    // Buy Royal Purple (50,000 gold)
    expect(store.buyIslandColor('color_royal_purple')).toBe(true);
    expect(useFishingStore.getState().islandCustomization.ownedColorIds).toContain('color_royal_purple');
    expect(useFishingStore.getState().islandCustomization.activeColorId).toBe('color_royal_purple');
    expect(useFishingStore.getState().gold).toBe(5000000 - 50000);

    // Buy Rainbow (10 diamonds)
    expect(store.buyIslandColor('color_rainbow')).toBe(true);
    expect(useFishingStore.getState().islandCustomization.ownedColorIds).toContain('color_rainbow');
    expect(useFishingStore.getState().diamonds).toBe(2000 - 10);

    // Equip default black again
    store.equipIslandColor('color_default_black');
    expect(useFishingStore.getState().islandCustomization.activeColorId).toBe('color_default_black');
  });

  it('should purchase and equip Island Effects', () => {
    const store = useFishingStore.getState();

    // Buy Aurora borealis (1,000 diamonds)
    expect(store.buyIslandEffect('effect_aurora')).toBe(true);
    expect(useFishingStore.getState().islandCustomization.ownedEffectIds).toContain('effect_aurora');
    expect(useFishingStore.getState().islandCustomization.activeEffectId).toBe('effect_aurora');

    // Unequip effect
    store.equipIslandEffect(null);
    expect(useFishingStore.getState().islandCustomization.activeEffectId).toBeNull();
  });

  it('should only allow equipping Fish Avatar if the fish has been caught', () => {
    const store = useFishingStore.getState();

    // Beluga has been caught in history
    store.equipFishAvatar('w1_t5_tam_hoang_gia');
    expect(useFishingStore.getState().islandCustomization.activeFishAvatarId).toBe('w1_t5_tam_hoang_gia');

    // Leviathan has not been caught yet
    store.equipFishAvatar('w1_t7_leviathan');
    // Should NOT equip Leviathan because it was not in caughtFishHistory
    expect(useFishingStore.getState().islandCustomization.activeFishAvatarId).toBe('w1_t5_tam_hoang_gia');
  });
});
