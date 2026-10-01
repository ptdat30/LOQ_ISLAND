import { describe, it, expect, beforeEach } from 'vitest';
import { useFishingStore, INITIAL_PLAYER_STATE } from '../src/features/fishing/stores/fishingStore';
import { RODS, BAITS_INFO, VEHICLES } from '../src/features/fishing/data/shopData';

describe('Fishing Game - Phase 4 Shop System Verification', () => {
  beforeEach(() => {
    useFishingStore.setState({
      ...INITIAL_PLAYER_STATE,
      gold: 500000000, // Rich testing balance
      diamonds: 50000,
      ownedRodIds: ['rod_bamboo'],
      ownedVehicleIds: ['vehicle_coracle'],
      baitInventory: {
        bait_corn: 0,
        bait_glow_blood: 0,
        bait_amber_fossil: 0,
        bait_mystic_gold: 0,
        bait_boss_awakening: 0,
      },
      ownedAutoUpgrades: {
        sorter: false,
        quantumBasket: false,
        droneLevel: 0,
        geneExtractor: false,
      },
    });
  });

  it('should buy and equip Rods, unlocking worlds accordingly', () => {
    const store = useFishingStore.getState();

    // Buy Anti-Radiation Rod (500k gold + 50 diamonds)
    const boughtAntiRad = store.buyRod('rod_anti_radiation');
    expect(boughtAntiRad).toBe(true);

    const state1 = useFishingStore.getState();
    expect(state1.ownedRodIds).toContain('rod_anti_radiation');
    expect(state1.currentRodId).toBe('rod_anti_radiation');
    expect(state1.unlockedWorlds).toContain(2);

    // Buy Cosmic Rod (100M gold + 10k diamonds)
    const boughtCosmic = store.buyRod('rod_cosmic');
    expect(boughtCosmic).toBe(true);
    expect(useFishingStore.getState().currentRodId).toBe('rod_cosmic');
  });

  it('should not allow buying when balance is insufficient', () => {
    useFishingStore.setState({ gold: 10, diamonds: 0 });
    const store = useFishingStore.getState();

    const bought = store.buyRod('rod_carbon'); // requires 50k gold
    expect(bought).toBe(false);
    expect(useFishingStore.getState().ownedRodIds).not.toContain('rod_carbon');
  });

  it('should buy Bait packs and update inventory correctly', () => {
    const store = useFishingStore.getState();

    // Buy 10,000 Mồi Bột Ngô (pack index 1)
    const boughtCorn = store.buyBaitPack('bait_corn', 1);
    expect(boughtCorn).toBe(true);
    expect(useFishingStore.getState().baitInventory.bait_corn).toBe(10000);
    expect(useFishingStore.getState().currentBaitId).toBe('bait_corn');

    // Buy 1,000 Mồi Vàng Ròng (pack index 0)
    const boughtGold = store.buyBaitPack('bait_mystic_gold', 0);
    expect(boughtGold).toBe(true);
    expect(useFishingStore.getState().baitInventory.bait_mystic_gold).toBe(1000);
  });

  it('should buy all Auto-Upgrades and progress Drone levels 1 -> 2 -> 3', () => {
    const store = useFishingStore.getState();

    // Sorter
    expect(store.buyAutoUpgrade('upgrade_sorter')).toBe(true);
    expect(useFishingStore.getState().ownedAutoUpgrades.sorter).toBe(true);

    // Quantum Basket
    expect(store.buyAutoUpgrade('upgrade_quantum_basket')).toBe(true);
    expect(useFishingStore.getState().ownedAutoUpgrades.quantumBasket).toBe(true);

    // Gene Extractor
    expect(store.buyAutoUpgrade('upgrade_gene_extractor')).toBe(true);
    expect(useFishingStore.getState().ownedAutoUpgrades.geneExtractor).toBe(true);

    // Drone level 1
    expect(store.buyAutoUpgrade('upgrade_drone')).toBe(true);
    expect(useFishingStore.getState().ownedAutoUpgrades.droneLevel).toBe(1);

    // Drone level 2
    expect(store.buyAutoUpgrade('upgrade_drone')).toBe(true);
    expect(useFishingStore.getState().ownedAutoUpgrades.droneLevel).toBe(2);

    // Drone level 3 (max)
    expect(store.buyAutoUpgrade('upgrade_drone')).toBe(true);
    expect(useFishingStore.getState().ownedAutoUpgrades.droneLevel).toBe(3);

    // Attempting to buy level 4 should return false
    expect(store.buyAutoUpgrade('upgrade_drone')).toBe(false);
  });

  it('should buy and equip Vehicles', () => {
    const store = useFishingStore.getState();

    // Buy Tàu Đánh Cá Viễn Dương (200k gold)
    expect(store.buyVehicle('vehicle_trawler')).toBe(true);
    const state = useFishingStore.getState();
    expect(state.ownedVehicleIds).toContain('vehicle_trawler');
    expect(state.currentVehicleId).toBe('vehicle_trawler');

    // Buy Anti-Toxic Submarine
    expect(store.buyVehicle('vehicle_anti_toxic_sub')).toBe(true);
    expect(useFishingStore.getState().currentVehicleId).toBe('vehicle_anti_toxic_sub');
  });
});
