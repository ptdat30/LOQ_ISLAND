import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Gem,
  Check,
} from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { RODS, BAITS_INFO, AUTO_UPGRADES_CONFIG, VEHICLES } from '../data/shopData';
import { ALL_FISH } from '../data/fishData';
import { ActionButton } from './shared/ActionButton';
import { TabularNumber } from './shared/TabularNumber';
import { TOKENS } from '../constants/tokens';
import type { BaitId, AutoUpgradeId, Rod } from '../../../types/fishing';

type ShopTab = 'rods' | 'baits' | 'upgrades' | 'vehicles';

export const ShopSubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ShopTab>('rods');
  const [selectedBaitPackIdx, setSelectedBaitPackIdx] = useState<Record<BaitId, number>>({
    bait_corn: 0,
    bait_glow_blood: 0,
    bait_amber_fossil: 0,
    bait_mystic_gold: 0,
    bait_boss_awakening: 0,
  });

  const gold = useFishingStore((s) => s.gold);
  const diamonds = useFishingStore((s) => s.diamonds);
  const currentRodId = useFishingStore((s) => s.currentRodId);
  const ownedRodIds = useFishingStore((s) => s.ownedRodIds);
  const currentBaitId = useFishingStore((s) => s.currentBaitId);
  const baitInventory = useFishingStore((s) => s.baitInventory);
  const currentVehicleId = useFishingStore((s) => s.currentVehicleId);
  const ownedVehicleIds = useFishingStore((s) => s.ownedVehicleIds);
  const ownedAutoUpgrades = useFishingStore((s) => s.ownedAutoUpgrades);
  const fishCollection = useFishingStore((s) => s.fishCollection);

  const buyRod = useFishingStore((s) => s.buyRod);
  const equipRod = useFishingStore((s) => s.equipRod);
  const buyBaitPack = useFishingStore((s) => s.buyBaitPack);
  const equipBait = useFishingStore((s) => s.equipBait);
  const buyAutoUpgrade = useFishingStore((s) => s.buyAutoUpgrade);
  const buyVehicle = useFishingStore((s) => s.buyVehicle);
  const equipVehicle = useFishingStore((s) => s.equipVehicle);

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const getBaitLibraryHint = (baitId: BaitId) => {
    if (baitId === 'bait_boss_awakening') {
      const lockedBoss = [
        { id: 'w1_t7_leviathan', name: 'Leviathan' },
        { id: 'w2_t7_gojira_fish', name: 'Gojira-Fish' },
        { id: 'w3_t7_megalodon', name: 'Megalodon' },
      ].find((b) => fishCollection[b.id]?.status !== 'unlocked');
      if (lockedBoss) {
        return { hint: `Mồi này giúp câu được ${lockedBoss.name} trong Thư viện`, isCrucial: true };
      }
    }
    if (baitId === 'bait_mystic_gold') {
      const lockedTier5 = ALL_FISH.find((f) => f.tier >= 5 && fishCollection[f.id]?.status !== 'unlocked');
      if (lockedTier5) {
        return { hint: `Mồi này giúp câu được ${lockedTier5.name} trong Thư viện`, isCrucial: true };
      }
    }
    if (baitId === 'bait_glow_blood') {
      const lockedW2 = ALL_FISH.find((f) => f.world === 2 && fishCollection[f.id]?.status !== 'unlocked');
      if (lockedW2) {
        return { hint: `Mồi này giúp câu được ${lockedW2.name} trong Thư viện`, isCrucial: false };
      }
    }
    if (baitId === 'bait_amber_fossil') {
      const lockedW3 = ALL_FISH.find((f) => f.world === 3 && fishCollection[f.id]?.status !== 'unlocked');
      if (lockedW3) {
        return { hint: `Mồi này giúp câu được ${lockedW3.name} trong Thư viện`, isCrucial: false };
      }
    }
    if (baitId === 'bait_corn') {
      const lockedW1 = ALL_FISH.find((f) => f.world === 1 && fishCollection[f.id]?.status !== 'unlocked');
      if (lockedW1) {
        return { hint: `Mồi này giúp câu được ${lockedW1.name} trong Thư viện`, isCrucial: false };
      }
    }
    return null;
  };

  const getRodLibraryHint = (rod: Rod) => {
    if (rod.unlocksWorld) {
      const remainingInWorld = ALL_FISH.filter((f) => f.world === rod.unlocksWorld && fishCollection[f.id]?.status !== 'unlocked');
      if (remainingInWorld.length > 0) {
        return { hint: `Cần thiết cho Thư viện (Mở ${remainingInWorld.length} loài World ${rod.unlocksWorld})`, isCrucial: true };
      }
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none text-[#F5F5F7] overflow-hidden">
      {/* Top Tabs */}
      <div className="flex items-center justify-between pb-2 shrink-0">
        <div className="flex items-center gap-1 bg-[#14141A] p-0.5 rounded-[10px] border border-white/[0.06] w-full">
          {(
            [
              { id: 'rods', label: 'Cần câu' },
              { id: 'baits', label: 'Mồi câu' },
              { id: 'upgrades', label: 'Tự động' },
              { id: 'vehicles', label: 'Phương tiện' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-1 rounded-[8px] text-[11px] font-medium transition-all cursor-pointer text-center ${
                activeTab === t.id
                  ? 'bg-white/[0.1] text-[#F5F5F7] shadow-sm'
                  : 'text-[#8A8A94] hover:text-[#F5F5F7]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-1 text-center py-0.5 px-2 bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[10px] font-medium rounded-lg shrink-0"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
        {/* ─── TAB 1: CẦN CÂU ─── */}
        {activeTab === 'rods' && (
          <div className="space-y-2">
            {Object.values(RODS).map((rod) => {
              const isOwned = ownedRodIds.includes(rod.id);
              const isEquipped = currentRodId === rod.id;
              const canAfford = gold >= rod.priceGold && diamonds >= rod.priceDiamond;
              const rodHint = getRodLibraryHint(rod);

              return (
                <div
                  key={rod.id}
                  className={`p-2.5 rounded-[12px] border transition-all flex items-center justify-between gap-3 ${
                    isEquipped
                      ? 'bg-[#14141A] border-[#5AC8FA]/40'
                      : 'bg-[#14141A] border-white/[0.06]'
                  }`}
                  style={{ boxShadow: TOKENS.shadows.innerHighlight }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-medium text-[#F5F5F7] truncate">{rod.name}</span>
                      {isEquipped && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-[6px] bg-[#5AC8FA]/15 text-[#5AC8FA] border border-[#5AC8FA]/30">
                          Đang dùng
                        </span>
                      )}
                      {rod.unlocksWorld && !isOwned && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-[6px] bg-[#FF9F0A]/15 text-[#FF9F0A] border border-[#FF9F0A]/30">
                          Vào World {rod.unlocksWorld}
                        </span>
                      )}
                      {rodHint?.isCrucial && !isOwned && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-[6px] bg-[#BF5AF2]/15 text-[#BF5AF2] border border-[#BF5AF2]/30">
                          Thư viện
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8A8A94] line-clamp-1 mt-0.5">{rod.description}</p>
                    {!isOwned && (
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-medium">
                        {rod.priceGold > 0 && (
                          <span className="text-[#FFD60A] flex items-center gap-0.5 tabular-nums">
                            <Coins className="w-3 h-3 text-[#FFD60A]" strokeWidth={1.5} />
                            <TabularNumber value={rod.priceGold} />
                          </span>
                        )}
                        {rod.priceDiamond > 0 && (
                          <span className="text-[#5AC8FA] flex items-center gap-0.5 tabular-nums">
                            <Gem className="w-3 h-3 text-[#5AC8FA]" strokeWidth={1.5} />
                            <TabularNumber value={rod.priceDiamond} />
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="shrink-0">
                    {isEquipped ? (
                      <ActionButton variant="ghost" size="sm" disabled>
                        Đang dùng
                      </ActionButton>
                    ) : isOwned ? (
                      <ActionButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          equipRod(rod.id);
                          showToast(`Đã trang bị: ${rod.name}`);
                        }}
                      >
                        Trang bị
                      </ActionButton>
                    ) : (
                      <ActionButton
                        variant="primary"
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyRod(rod.id);
                          if (res) showToast(`Mua thành công: ${rod.name}`);
                          else showToast('Không đủ tài nguyên để mua!');
                        }}
                      >
                        Mua
                      </ActionButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 2: MỒI CÂU ─── */}
        {activeTab === 'baits' && (
          <div className="space-y-2">
            {Object.values(BAITS_INFO).map((bait) => {
              const isEquipped = currentBaitId === bait.id;
              const inventoryCount = baitInventory[bait.id] || 0;
              const selectedPackIdx = selectedBaitPackIdx[bait.id] || 0;
              const pack = bait.packs[selectedPackIdx] || bait.packs[0];
              const canAfford = gold >= pack.priceGold && diamonds >= pack.priceDiamond;
              const baitHint = getBaitLibraryHint(bait.id);

              return (
                <div
                  key={bait.id}
                  className={`p-2.5 rounded-[12px] border transition-all flex flex-col gap-2 ${
                    isEquipped
                      ? 'bg-[#14141A] border-[#FF9F0A]/40'
                      : 'bg-[#14141A] border-white/[0.06]'
                  }`}
                  style={{ boxShadow: TOKENS.shadows.innerHighlight }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[13px] font-medium text-[#F5F5F7] truncate">{bait.name}</span>
                        <span className="text-[10px] font-medium text-[#FFD60A] bg-[#FFD60A]/10 border border-[#FFD60A]/20 px-1.5 py-0.2 rounded-[6px] tabular-nums">
                          Có: {inventoryCount.toLocaleString()}
                        </span>
                        {baitHint?.isCrucial && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-[6px] bg-[#BF5AF2]/15 text-[#BF5AF2] border border-[#BF5AF2]/30">
                            Thư viện
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8A8A94] line-clamp-1 mt-0.5">{bait.description}</p>
                    </div>

                    {/* Equip / Unequip */}
                    <div className="shrink-0 flex items-center gap-1">
                      {isEquipped ? (
                        <ActionButton
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            equipBait(null);
                            showToast('Đã tháo mồi câu');
                          }}
                        >
                          Tháo
                        </ActionButton>
                      ) : (
                        <ActionButton
                          variant="secondary"
                          size="sm"
                          disabled={inventoryCount === 0}
                          onClick={() => {
                            equipBait(bait.id);
                            showToast(`Đã dùng: ${bait.name}`);
                          }}
                        >
                          Dùng
                        </ActionButton>
                      )}
                    </div>
                  </div>

                  {/* Pack Selector & Buy Button */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                    {/* Pack Radio Selector */}
                    <div className="flex items-center gap-1">
                      {bait.packs.map((p, idx) => (
                        <button
                          key={p.quantity}
                          type="button"
                          onClick={() =>
                            setSelectedBaitPackIdx((prev) => ({ ...prev, [bait.id]: idx }))
                          }
                          className={`px-1.5 py-0.5 rounded-[6px] text-[10px] font-medium border transition-all cursor-pointer ${
                            selectedPackIdx === idx
                              ? 'bg-white/[0.15] text-[#F5F5F7] border-white/30'
                              : 'bg-white/[0.04] text-[#8A8A94] border-white/[0.06] hover:bg-white/[0.08]'
                          }`}
                        >
                          {p.quantity.toLocaleString()} mồi
                        </button>
                      ))}
                    </div>

                    {/* Price and Buy Button */}
                    <div className="flex items-center gap-2">
                      <div className="text-[11px] font-medium flex items-center gap-1.5">
                        {pack.priceGold > 0 && (
                          <span className="text-[#FFD60A] flex items-center gap-0.5 tabular-nums">
                            <Coins className="w-3 h-3 text-[#FFD60A]" strokeWidth={1.5} />
                            <TabularNumber value={pack.priceGold} />
                          </span>
                        )}
                        {pack.priceDiamond > 0 && (
                          <span className="text-[#5AC8FA] flex items-center gap-0.5 tabular-nums">
                            <Gem className="w-3 h-3 text-[#5AC8FA]" strokeWidth={1.5} />
                            <TabularNumber value={pack.priceDiamond} />
                          </span>
                        )}
                      </div>

                      <ActionButton
                        variant="primary"
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyBaitPack(bait.id, selectedPackIdx);
                          if (res) showToast(`Đã mua ${pack.quantity.toLocaleString()} ${bait.name}`);
                          else showToast('Không đủ tài nguyên để mua!');
                        }}
                      >
                        Mua
                      </ActionButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 3: NÂNG CẤP TỰ ĐỘNG ─── */}
        {activeTab === 'upgrades' && (
          <div className="space-y-2">
            {Object.entries(AUTO_UPGRADES_CONFIG).map(([id, config]) => {
              const upgradeId = id as AutoUpgradeId;
              let isMaxed = false;
              let currentLvl = 0;
              let nextPriceGold = 0;
              let nextPriceDiamond = 0;
              let actionLabel = 'Kích hoạt';

              if (upgradeId === 'upgrade_sorter') {
                isMaxed = ownedAutoUpgrades.sorter;
                nextPriceGold = config.levels[0].priceGold;
                nextPriceDiamond = config.levels[0].priceDiamond;
              } else if (upgradeId === 'upgrade_quantum_basket') {
                isMaxed = ownedAutoUpgrades.quantumBasket;
                nextPriceGold = config.levels[0].priceGold;
                nextPriceDiamond = config.levels[0].priceDiamond;
              } else if (upgradeId === 'upgrade_drone') {
                currentLvl = ownedAutoUpgrades.droneLevel;
                isMaxed = currentLvl >= 3;
                if (!isMaxed) {
                  const nextLvlConfig = config.levels[currentLvl];
                  nextPriceGold = nextLvlConfig.priceGold;
                  nextPriceDiamond = nextLvlConfig.priceDiamond;
                  actionLabel = nextLvlConfig.label;
                }
              } else if (upgradeId === 'upgrade_gene_extractor') {
                isMaxed = ownedAutoUpgrades.geneExtractor;
                nextPriceGold = config.levels[0].priceGold;
                nextPriceDiamond = config.levels[0].priceDiamond;
              }

              const canAfford = gold >= nextPriceGold && diamonds >= nextPriceDiamond;

              return (
                <div
                  key={upgradeId}
                  className={`p-2.5 rounded-[12px] border transition-all flex items-center justify-between gap-3 ${
                    isMaxed
                      ? 'bg-[#14141A] border-[#BF5AF2]/40'
                      : 'bg-[#14141A] border-white/[0.06]'
                  }`}
                  style={{ boxShadow: TOKENS.shadows.innerHighlight }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-medium text-[#F5F5F7] truncate">{config.name}</span>
                      {isMaxed && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-[6px] bg-[#BF5AF2]/15 text-[#BF5AF2] border border-[#BF5AF2]/30 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" strokeWidth={1.5} />
                          {upgradeId === 'upgrade_drone' ? `Cấp ${currentLvl} (Max)` : 'Đã có'}
                        </span>
                      )}
                      {!isMaxed && upgradeId === 'upgrade_drone' && currentLvl > 0 && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-[6px] bg-[#FF9F0A]/15 text-[#FF9F0A] border border-[#FF9F0A]/30">
                          Cấp {currentLvl}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8A8A94] line-clamp-1 mt-0.5">{config.description}</p>
                    {!isMaxed && (
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-medium">
                        {nextPriceGold > 0 && (
                          <span className="text-[#FFD60A] flex items-center gap-0.5 tabular-nums">
                            <Coins className="w-3 h-3 text-[#FFD60A]" strokeWidth={1.5} />
                            <TabularNumber value={nextPriceGold} />
                          </span>
                        )}
                        {nextPriceDiamond > 0 && (
                          <span className="text-[#5AC8FA] flex items-center gap-0.5 tabular-nums">
                            <Gem className="w-3 h-3 text-[#5AC8FA]" strokeWidth={1.5} />
                            <TabularNumber value={nextPriceDiamond} />
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isMaxed ? (
                      <ActionButton variant="ghost" size="sm" disabled>
                        Tối đa
                      </ActionButton>
                    ) : (
                      <ActionButton
                        variant="primary"
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyAutoUpgrade(upgradeId);
                          if (res) showToast(`Nâng cấp thành công: ${config.name}`);
                          else showToast('Không đủ tài nguyên!');
                        }}
                      >
                        {actionLabel}
                      </ActionButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 4: PHƯƠNG TIỆN ─── */}
        {activeTab === 'vehicles' && (
          <div className="space-y-2">
            {Object.values(VEHICLES).map((vehicle) => {
              const isOwned = ownedVehicleIds.includes(vehicle.id);
              const isEquipped = currentVehicleId === vehicle.id;
              const canAfford = gold >= vehicle.priceGold && diamonds >= vehicle.priceDiamond;

              return (
                <div
                  key={vehicle.id}
                  className={`p-2.5 rounded-[12px] border transition-all flex items-center justify-between gap-3 ${
                    isEquipped
                      ? 'bg-[#14141A] border-[#32D74B]/40'
                      : 'bg-[#14141A] border-white/[0.06]'
                  }`}
                  style={{ boxShadow: TOKENS.shadows.innerHighlight }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-medium text-[#F5F5F7] truncate">{vehicle.name}</span>
                      {isEquipped && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-[6px] bg-[#32D74B]/15 text-[#32D74B] border border-[#32D74B]/30">
                          Đang dùng
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8A8A94] line-clamp-1 mt-0.5">{vehicle.description}</p>
                    {!isOwned && (
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-medium">
                        {vehicle.priceGold > 0 && (
                          <span className="text-[#FFD60A] flex items-center gap-0.5 tabular-nums">
                            <Coins className="w-3 h-3 text-[#FFD60A]" strokeWidth={1.5} />
                            <TabularNumber value={vehicle.priceGold} />
                          </span>
                        )}
                        {vehicle.priceDiamond > 0 && (
                          <span className="text-[#5AC8FA] flex items-center gap-0.5 tabular-nums">
                            <Gem className="w-3 h-3 text-[#5AC8FA]" strokeWidth={1.5} />
                            <TabularNumber value={vehicle.priceDiamond} />
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isEquipped ? (
                      <ActionButton variant="ghost" size="sm" disabled>
                        Đang dùng
                      </ActionButton>
                    ) : isOwned ? (
                      <ActionButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          equipVehicle(vehicle.id);
                          showToast(`Đã dùng: ${vehicle.name}`);
                        }}
                      >
                        Trang bị
                      </ActionButton>
                    ) : (
                      <ActionButton
                        variant="primary"
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyVehicle(vehicle.id);
                          if (res) showToast(`Mua thành công: ${vehicle.name}`);
                          else showToast('Không đủ tài nguyên!');
                        }}
                      >
                        Mua
                      </ActionButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
