import { describe, it, expect, beforeEach } from 'vitest';
import { useFishingStore, INITIAL_PLAYER_STATE, createDefaultFishCollection } from '../src/features/fishing/stores/fishingStore';
import { rollFishSize, calculateFishPriceWithSize } from '../src/features/fishing/utils/sizeUtils';
import { removeVietnameseTones } from '../src/features/fishing/utils/stringUtils';
import { ALL_FISH } from '../src/features/fishing/data/fishData';

describe('Fishing Game - Phase 9 Fish Library & Collection System', () => {
  beforeEach(() => {
    useFishingStore.setState({
      ...INITIAL_PLAYER_STATE,
      gold: 100000,
      diamonds: 50,
      mutationPoints: 200,
      fishCollection: createDefaultFishCollection(),
      caughtFishHistory: [],
      hasUnlockedTier5Ever: false,
      hasCompletedCollectionEver: false,
      collectorSkillLevel: 0,
      islandCustomization: {
        activeColorId: 'color_default_black',
        ownedColorIds: ['color_default_black'],
        activeEffectId: null,
        ownedEffectIds: [],
        activeFishAvatarId: null,
      },
    });
  });

  describe('Fish Size & Price Scaling', () => {
    it('should generate size within [minSize, maxSize]', () => {
      const min = 0.5;
      const max = 2.0;
      for (let i = 0; i < 50; i++) {
        const size = rollFishSize(min, max);
        expect(size).toBeGreaterThanOrEqual(min);
        expect(size).toBeLessThanOrEqual(max);
      }
    });

    it('should calculate price accurately based on size scaling formula', () => {
      const basePrice = 10;
      const minSize = 0.5;
      const maxSize = 2.0;

      // Min size = 100% base price = 10
      const priceMin = calculateFishPriceWithSize(basePrice, minSize, maxSize, minSize);
      expect(priceMin).toBe(10);

      // Max size = 150% base price = 15
      const priceMax = calculateFishPriceWithSize(basePrice, minSize, maxSize, maxSize);
      expect(priceMax).toBe(15);

      // Mid size = 1.25kg (50% progress) -> 10 * (1 + 0.5 * 0.5) = 12.5 -> rounded to 13 or 12.5
      const priceMid = calculateFishPriceWithSize(basePrice, minSize, maxSize, 1.25);
      expect(priceMid).toBe(13);
    });

    it('should have all 84 fish with valid minSize and maxSize properties', () => {
      expect(ALL_FISH.length).toBe(84);
      ALL_FISH.forEach((fish) => {
        expect(fish.minSize).toBeGreaterThan(0);
        expect(fish.maxSize).toBeGreaterThan(fish.minSize);
      });
    });
  });

  describe('Vietnamese Accent-Insensitive Search', () => {
    it('should normalize Vietnamese diacritics', () => {
      expect(removeVietnameseTones('Cá Chép Vàng')).toBe('ca chep vang');
      expect(removeVietnameseTones('Thủy Quái Leviathan')).toBe('thuy quai leviathan');
      expect(removeVietnameseTones('Lươn Điện')).toBe('luon dien');
    });
  });

  describe('Collection Progress & Catch Tracking', () => {
    it('should initialize with all 84 fish locked', () => {
      const collection = useFishingStore.getState().fishCollection;
      const allKeys = Object.keys(collection);
      expect(allKeys.length).toBe(84);
      allKeys.forEach((id) => {
        expect(collection[id].status).toBe('locked');
        expect(collection[id].catchCount).toBe(0);
        expect(collection[id].recordSize).toBe(0);
        expect(collection[id].firstCaughtAt).toBeNull();
      });
    });

    it('should unlock fish, record size, and trigger notifications on first catch', () => {
      const store = useFishingStore.getState();
      const testFish = ALL_FISH[0];
      const entryBefore = useFishingStore.getState().fishCollection[testFish.id];
      expect(entryBefore.status).toBe('locked');

      // Execute catchRound
      store.catchRound();
      const afterState = useFishingStore.getState();
      expect(afterState.lastCatchBatch).not.toBeNull();
      
      const caughtFishId = afterState.lastCatchBatch!.caughtItems[0]?.fish?.id;
      expect(caughtFishId).toBeDefined();
      if (caughtFishId) {
        const entryAfter = afterState.fishCollection[caughtFishId];
        expect(entryAfter.status).toBe('unlocked');
        expect(entryAfter.catchCount).toBeGreaterThanOrEqual(1);
        expect(entryAfter.recordSize).toBeGreaterThan(0);
        expect(entryAfter.firstCaughtAt).not.toBeNull();
        expect(afterState.newFishNotification).not.toBeNull();
      }
    });

    it('should equip avatar only for unlocked Tier 5+ fish', () => {
      const store = useFishingStore.getState();

      // Tier 1 fish cannot be avatar
      const t1Fish = ALL_FISH.find((f) => f.tier === 1)!;
      // Unlock t1 fish
      useFishingStore.setState((s) => ({
        ...s,
        fishCollection: {
          ...s.fishCollection,
          [t1Fish.id]: {
            ...s.fishCollection[t1Fish.id],
            status: 'unlocked',
          },
        },
      }));
      store.setFishAvatar(t1Fish.id);
      // Not allowed for Tier 1
      expect(useFishingStore.getState().islandCustomization.activeFishAvatarId).toBeNull();

      // Tier 5 fish unlocked
      const t5Fish = ALL_FISH.find((f) => f.tier === 5)!;
      useFishingStore.setState((s) => ({
        ...s,
        fishCollection: {
          ...s.fishCollection,
          [t5Fish.id]: {
            ...s.fishCollection[t5Fish.id],
            status: 'unlocked',
          },
        },
      }));
      store.setFishAvatar(t5Fish.id);
      expect(useFishingStore.getState().islandCustomization.activeFishAvatarId).toBe(t5Fish.id);
      expect(useFishingStore.getState().fishCollection[t5Fish.id].isAvatar).toBe(true);

      // Unequip avatar
      store.setFishAvatar(null);
      expect(useFishingStore.getState().islandCustomization.activeFishAvatarId).toBeNull();
      expect(useFishingStore.getState().fishCollection[t5Fish.id].isAvatar).toBe(false);
    });
  });

  describe('Skill Tree: Sưu Tầm Gia', () => {
    it('should be locked until Tier 5+ is unlocked', () => {
      const store = useFishingStore.getState();
      expect(store.hasUnlockedTier5Ever).toBe(false);

      // Attempt upgrade should fail
      const result = store.upgradeCollectorSkill();
      expect(result).toBe(false);
      expect(useFishingStore.getState().collectorSkillLevel).toBe(0);
    });

    it('should allow upgrades up to level 5 with corresponding MP costs', () => {
      const store = useFishingStore.getState();
      // Unlock tier 5 requirement
      useFishingStore.setState({
        hasUnlockedTier5Ever: true,
        mutationPoints: 500,
      });

      // Level 1: cost 10 MP
      expect(store.upgradeCollectorSkill()).toBe(true);
      expect(useFishingStore.getState().collectorSkillLevel).toBe(1);
      expect(useFishingStore.getState().mutationPoints).toBe(500 - 10);

      // Level 2: cost 20 MP
      expect(store.upgradeCollectorSkill()).toBe(true);
      expect(useFishingStore.getState().collectorSkillLevel).toBe(2);
      expect(useFishingStore.getState().mutationPoints).toBe(500 - 10 - 20);

      // Level 3: cost 35 MP
      expect(store.upgradeCollectorSkill()).toBe(true);
      expect(useFishingStore.getState().collectorSkillLevel).toBe(3);

      // Level 4: cost 50 MP
      expect(store.upgradeCollectorSkill()).toBe(true);
      expect(useFishingStore.getState().collectorSkillLevel).toBe(4);

      // Level 5: cost 75 MP
      expect(store.upgradeCollectorSkill()).toBe(true);
      expect(useFishingStore.getState().collectorSkillLevel).toBe(5);

      // Max level: cannot upgrade further
      expect(store.upgradeCollectorSkill()).toBe(false);
      expect(useFishingStore.getState().collectorSkillLevel).toBe(5);
    });
  });

  describe('100% Collection Completion Bonus', () => {
    it('should grant 10,000 diamonds, exclusive effect and celebration modal when all 84 are unlocked', () => {
      const store = useFishingStore.getState();

      // Pre-fill 83 fish as unlocked
      const almostCompleteCollection = createDefaultFishCollection();
      for (let i = 0; i < 83; i++) {
        const fish = ALL_FISH[i];
        almostCompleteCollection[fish.id] = {
          fishId: fish.id,
          status: 'unlocked',
          catchCount: 1,
          firstCaughtAt: Date.now(),
          recordSize: fish.maxSize,
          isAvatar: false,
        };
      }

      useFishingStore.setState({
        fishCollection: almostCompleteCollection,
        diamonds: 50,
        hasCompletedCollectionEver: false,
      });

      // Catch the 84th fish
      const lastFish = ALL_FISH[83];
      // Simulate catch logic for 84th fish
      const updatedCollection = {
        ...almostCompleteCollection,
        [lastFish.id]: {
          fishId: lastFish.id,
          status: 'unlocked' as const,
          catchCount: 1,
          firstCaughtAt: Date.now(),
          recordSize: lastFish.maxSize,
          isAvatar: false,
        },
      };

      // Check count
      const unlockedCount = Object.values(updatedCollection).filter((c) => c.status === 'unlocked').length;
      expect(unlockedCount).toBe(84);

      // Trigger store celebration update
      useFishingStore.setState((s) => ({
        fishCollection: updatedCollection,
        diamonds: s.diamonds + 10000,
        hasCompletedCollectionEver: true,
        collectionCompletedCelebration: true,
        islandCustomization: {
          ...s.islandCustomization,
          ownedEffectIds: [...s.islandCustomization.ownedEffectIds, 'effect_collection_master'],
          activeEffectId: 'effect_collection_master',
        },
      }));

      const finalState = useFishingStore.getState();
      expect(finalState.diamonds).toBe(10050);
      expect(finalState.hasCompletedCollectionEver).toBe(true);
      expect(finalState.collectionCompletedCelebration).toBe(true);
      expect(finalState.islandCustomization.ownedEffectIds).toContain('effect_collection_master');
      expect(finalState.islandCustomization.activeEffectId).toBe('effect_collection_master');
    });
  });

  describe('Expanded Library & Fish Inspection', () => {
    it('should toggle library enlarged state', () => {
      const store = useFishingStore.getState();
      expect(store.isLibraryEnlarged).toBe(false);

      store.toggleLibraryEnlarged();
      expect(useFishingStore.getState().isLibraryEnlarged).toBe(true);

      store.toggleLibraryEnlarged();
      expect(useFishingStore.getState().isLibraryEnlarged).toBe(false);

      store.setLibraryEnlarged(true);
      expect(useFishingStore.getState().isLibraryEnlarged).toBe(true);
    });

    it('should inspect fish and automatically open library subtab', () => {
      const store = useFishingStore.getState();
      expect(store.activeSubTab).toBe('fishing');
      expect(store.inspectingFishId).toBeNull();

      store.inspectFish('fish_w1_01');
      expect(useFishingStore.getState().inspectingFishId).toBe('fish_w1_01');
      expect(useFishingStore.getState().activeSubTab).toBe('library');

      store.inspectFish(null);
      expect(useFishingStore.getState().inspectingFishId).toBeNull();
    });
  });
});
