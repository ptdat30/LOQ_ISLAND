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
    <div className="w-full h-full flex flex-col justify-between select-none text-white overflow-hidden">
      {/* Top Header & Resources */}
      <div className="flex items-center justify-between px-1 pb-2 shrink-0">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('rods')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              activeTab === 'rods' ? 'bg-sky-500/30 text-sky-200 shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            Cần câu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('baits')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              activeTab === 'baits' ? 'bg-amber-500/30 text-amber-200 shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            Mồi câu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upgrades')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              activeTab === 'upgrades' ? 'bg-purple-500/30 text-purple-200 shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            Tự động
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vehicles')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              activeTab === 'vehicles' ? 'bg-emerald-500/30 text-emerald-200 shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            Phương tiện
          </button>
        </div>

        {/* Currency balances */}
        <div className="flex items-center gap-2.5 text-[11px] font-bold">
          <div className="flex items-center gap-1 text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
            <span>{gold.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-sky-300">
            <Gem className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
            <span>{diamonds.toLocaleString()}</span>
          </div>
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
          <div className="space-y-1.5">
            {Object.values(RODS).map((rod) => {
              const isOwned = ownedRodIds.includes(rod.id);
              const isEquipped = currentRodId === rod.id;
              const canAfford = gold >= rod.priceGold && diamonds >= rod.priceDiamond;
              const rodHint = getRodLibraryHint(rod);

              return (
                <div
                  key={rod.id}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    isEquipped
                      ? 'bg-sky-500/15 border-sky-400/40'
                      : isOwned
                      ? 'bg-white/[0.04] border-white/10'
                      : 'bg-white/[0.02] border-white/5'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-white truncate">{rod.name}</span>
                      {isEquipped && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-sky-500/25 text-sky-300 border border-sky-400/30">
                          Đang dùng
                        </span>
                      )}
                      {rod.unlocksWorld && !isOwned && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          Vào World {rod.unlocksWorld}
                        </span>
                      )}
                      {rodHint?.isCrucial && !isOwned && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                          Cần thiết cho Thư viện
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/60 line-clamp-1 mt-0.5">{rod.description}</p>
                    {rodHint && (
                      <p className="text-[9.5px] text-amber-300/90 font-medium mt-0.5">
                        💡 {rodHint.hint}
                      </p>
                    )}
                    {!isOwned && (
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold">
                        {rod.priceGold > 0 && (
                          <span className="text-amber-300 flex items-center gap-0.5">
                            <Coins className="w-3 h-3" strokeWidth={1.5} />
                            {rod.priceGold.toLocaleString()}
                          </span>
                        )}
                        {rod.priceDiamond > 0 && (
                          <span className="text-sky-300 flex items-center gap-0.5">
                            <Gem className="w-3 h-3" strokeWidth={1.5} />
                            {rod.priceDiamond.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="shrink-0">
                    {isEquipped ? (
                      <button
                        type="button"
                        disabled
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 cursor-default"
                      >
                        Đang chọn
                      </button>
                    ) : isOwned ? (
                      <button
                        type="button"
                        onClick={() => {
                          equipRod(rod.id);
                          showToast(`Đã trang bị: ${rod.name}`);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer active:scale-95 transition-all"
                      >
                        Trang bị
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const res = buyRod(rod.id);
                          if (res) showToast(`Mua thành công: ${rod.name}`);
                          else showToast('Không đủ tài nguyên để mua!');
                        }}
                        disabled={!canAfford}
                        className={`px-3 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-amber-500/25 border-amber-400/40 text-amber-200 hover:bg-amber-500/35 active:scale-95'
                            : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        Mua
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 2: MỒI CÂU ─── */}
        {activeTab === 'baits' && (
          <div className="space-y-1.5">
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
                  className={`p-2 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    isEquipped ? 'bg-amber-500/10 border-amber-400/40' : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-bold text-white truncate">{bait.name}</span>
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded-md">
                          Có: {inventoryCount.toLocaleString()}
                        </span>
                        {baitHint?.isCrucial && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                            Cần thiết cho Thư viện
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/60 line-clamp-1 mt-0.5">{bait.description}</p>
                      {baitHint && (
                        <p className="text-[9.5px] text-amber-300/90 font-medium mt-0.5">
                          💡 {baitHint.hint}
                        </p>
                      )}
                    </div>

                    {/* Equip / Unequip */}
                    <div className="shrink-0 flex items-center gap-1">
                      {isEquipped ? (
                        <button
                          type="button"
                          onClick={() => {
                            equipBait(null);
                            showToast('Đã tháo mồi câu');
                          }}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-pointer"
                        >
                          Tháo
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={inventoryCount === 0}
                          onClick={() => {
                            equipBait(bait.id);
                            showToast(`Đã dùng: ${bait.name}`);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                            inventoryCount > 0
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed'
                          }`}
                        >
                          Dùng
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Pack Selector & Buy Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    {/* Pack Radio Selector */}
                    <div className="flex items-center gap-1">
                      {bait.packs.map((p, idx) => (
                        <button
                          key={p.quantity}
                          type="button"
                          onClick={() =>
                            setSelectedBaitPackIdx((prev) => ({ ...prev, [bait.id]: idx }))
                          }
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
                            selectedPackIdx === idx
                              ? 'bg-amber-400 text-black border-amber-400'
                              : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/15'
                          }`}
                        >
                          {p.quantity.toLocaleString()} mồi
                        </button>
                      ))}
                    </div>

                    {/* Price and Buy Button */}
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] font-bold">
                        {pack.priceGold > 0 && (
                          <span className="text-amber-300 flex items-center gap-0.5">
                            <Coins className="w-3 h-3" strokeWidth={1.5} />
                            {pack.priceGold.toLocaleString()}
                          </span>
                        )}
                        {pack.priceDiamond > 0 && (
                          <span className="text-sky-300 flex items-center gap-0.5">
                            <Gem className="w-3 h-3" strokeWidth={1.5} />
                            {pack.priceDiamond.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyBaitPack(bait.id, selectedPackIdx);
                          if (res) showToast(`Đã mua ${pack.quantity.toLocaleString()} ${bait.name}`);
                          else showToast('Không đủ tài nguyên để mua!');
                        }}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-amber-500/25 border-amber-400/40 text-amber-200 hover:bg-amber-500/35 active:scale-95'
                            : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        Mua
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 3: NÂNG CẤP TỰ ĐỘNG ─── */}
        {activeTab === 'upgrades' && (
          <div className="space-y-1.5">
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
                  className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    isMaxed ? 'bg-purple-500/15 border-purple-400/40' : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-white truncate">{config.name}</span>
                      {isMaxed && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/25 text-purple-300 border border-purple-400/30 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" strokeWidth={1.5} />
                          {upgradeId === 'upgrade_drone' ? `Cấp ${currentLvl} (Max)` : 'Đã sở hữu'}
                        </span>
                      )}
                      {!isMaxed && upgradeId === 'upgrade_drone' && currentLvl > 0 && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          Cấp {currentLvl}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/60 line-clamp-1 mt-0.5">{config.description}</p>
                    {!isMaxed && (
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold">
                        {nextPriceGold > 0 && (
                          <span className="text-amber-300 flex items-center gap-0.5">
                            <Coins className="w-3 h-3" strokeWidth={1.5} />
                            {nextPriceGold.toLocaleString()}
                          </span>
                        )}
                        {nextPriceDiamond > 0 && (
                          <span className="text-sky-300 flex items-center gap-0.5">
                            <Gem className="w-3 h-3" strokeWidth={1.5} />
                            {nextPriceDiamond.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isMaxed ? (
                      <button
                        type="button"
                        disabled
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 cursor-default"
                      >
                        Tối đa
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyAutoUpgrade(upgradeId);
                          if (res) showToast(`Nâng cấp thành công: ${config.name}`);
                          else showToast('Không đủ tài nguyên!');
                        }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-purple-500/25 border-purple-400/40 text-purple-200 hover:bg-purple-500/35 active:scale-95'
                            : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        {actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 4: PHƯƠNG TIỆN ─── */}
        {activeTab === 'vehicles' && (
          <div className="space-y-1.5">
            {Object.values(VEHICLES).map((vehicle) => {
              const isOwned = ownedVehicleIds.includes(vehicle.id);
              const isEquipped = currentVehicleId === vehicle.id;
              const canAfford = gold >= vehicle.priceGold && diamonds >= vehicle.priceDiamond;

              return (
                <div
                  key={vehicle.id}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    isEquipped
                      ? 'bg-emerald-500/15 border-emerald-400/40'
                      : isOwned
                      ? 'bg-white/[0.04] border-white/10'
                      : 'bg-white/[0.02] border-white/5'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-white truncate">{vehicle.name}</span>
                      {isEquipped && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                          Đang dùng
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/60 line-clamp-1 mt-0.5">{vehicle.description}</p>
                    {!isOwned && (
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold">
                        {vehicle.priceGold > 0 && (
                          <span className="text-amber-300 flex items-center gap-0.5">
                            <Coins className="w-3 h-3" strokeWidth={1.5} />
                            {vehicle.priceGold.toLocaleString()}
                          </span>
                        )}
                        {vehicle.priceDiamond > 0 && (
                          <span className="text-sky-300 flex items-center gap-0.5">
                            <Gem className="w-3 h-3" strokeWidth={1.5} />
                            {vehicle.priceDiamond.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isEquipped ? (
                      <button
                        type="button"
                        disabled
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                      >
                        Đang chọn
                      </button>
                    ) : isOwned ? (
                      <button
                        type="button"
                        onClick={() => {
                          equipVehicle(vehicle.id);
                          showToast(`Đã chọn: ${vehicle.name}`);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer active:scale-95 transition-all"
                      >
                        Sử dụng
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyVehicle(vehicle.id);
                          if (res) showToast(`Mua thành công: ${vehicle.name}`);
                          else showToast('Không đủ tài nguyên!');
                        }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-emerald-500/25 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/35 active:scale-95'
                            : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        Mua
                      </button>
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
