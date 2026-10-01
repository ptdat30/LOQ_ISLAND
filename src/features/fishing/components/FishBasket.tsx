import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Coins, ChevronDown, Check } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { FISH_MAP } from '../data/fishData';
import { TIER_COLORS } from '../data/ratesData';
import { getFishImageUrl } from '../data/fishImages';
import { calculateFishPrice } from '../logic/economy';
import type { FishTier } from '../../../types/fishing';

export const FishBasket: React.FC = () => {
  const basket = useFishingStore((s) => s.basket);
  const currentWorld = useFishingStore((s) => s.currentWorld);
  const currentRodId = useFishingStore((s) => s.currentRodId);
  const ownedAutoUpgrades = useFishingStore((s) => s.ownedAutoUpgrades);
  const sellAllFish = useFishingStore((s) => s.sellAllFish);
  const sellFishByTier = useFishingStore((s) => s.sellFishByTier);
  const getBasketEstimatedValue = useFishingStore((s) => s.getBasketEstimatedValue);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [lastSoldNotify, setLastSoldNotify] = useState<string | null>(null);

  const totalCount = basket.reduce((acc, item) => acc + item.count, 0);
  const maxCapacity = ownedAutoUpgrades.quantumBasket ? '∞' : '1.000';
  const estimatedGold = getBasketEstimatedValue();

  const handleSellAll = () => {
    if (totalCount === 0) return;
    const { goldEarned, diamondsEarned } = sellAllFish();
    let msg = `+${goldEarned.toLocaleString()} vàng`;
    if (diamondsEarned > 0) msg += ` & +${diamondsEarned} 💎`;
    setLastSoldNotify(msg);
    setTimeout(() => setLastSoldNotify(null), 2500);
  };

  const handleSellTierRange = (min: FishTier, max: FishTier, label: string) => {
    const { goldEarned, diamondsEarned } = sellFishByTier(min, max);
    if (goldEarned > 0) {
      let msg = `[${label}] +${goldEarned.toLocaleString()} vàng`;
      if (diamondsEarned > 0) msg += ` & +${diamondsEarned} 💎`;
      setLastSoldNotify(msg);
      setTimeout(() => setLastSoldNotify(null), 2500);
    }
    setIsFilterOpen(false);
  };

  return (
    <div className="w-full shrink-0 bg-white/[0.04] border border-white/10 rounded-2xl p-2.5 flex flex-col gap-2 select-none relative">
      {/* Header Row: Capacity & Estimated Value */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
            <ShoppingBag className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-white/95 leading-none">
                Giỏ cá: {totalCount.toLocaleString()}/{maxCapacity}
              </span>
              {ownedAutoUpgrades.quantumBasket && (
                <span className="text-[9px] font-bold text-purple-400 px-1 py-0.2 rounded bg-purple-500/15 border border-purple-500/30">
                  Lượng tử
                </span>
              )}
            </div>
            <span className="text-[10px] text-white/50 leading-none">
              Ước tính:{' '}
              <span className="text-amber-300 font-medium">
                {estimatedGold.toLocaleString()} vàng
              </span>
            </span>
          </div>
        </div>

        {/* Sell Buttons Group */}
        <div className="flex items-center gap-1">
          {/* Quick Filter Menu Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] text-white/80 border border-white/10 cursor-pointer flex items-center gap-0.5"
              title="Bán theo Cấp độ Tier"
            >
              <span>Lọc bán</span>
              <ChevronDown className="w-3 h-3 text-white/60" strokeWidth={1.5} />
            </button>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  className="absolute right-0 top-7 z-30 w-36 bg-black/95 border border-white/20 backdrop-blur-xl rounded-xl p-1 shadow-2xl space-y-0.5"
                >
                  <button
                    type="button"
                    onClick={() => handleSellTierRange(1, 1, 'Tier 1')}
                    className="w-full text-left px-2 py-1 rounded text-[10px] text-white/80 hover:bg-white/15 cursor-pointer flex items-center justify-between"
                  >
                    <span>Bán chỉ Tier 1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSellTierRange(1, 2, 'Tier 1-2')}
                    className="w-full text-left px-2 py-1 rounded text-[10px] text-white/80 hover:bg-white/15 cursor-pointer flex items-center justify-between"
                  >
                    <span>Bán Tier 1 & 2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSellTierRange(1, 3, 'Tier 1-3')}
                    className="w-full text-left px-2 py-1 rounded text-[10px] text-white/80 hover:bg-white/15 cursor-pointer flex items-center justify-between"
                  >
                    <span>Bán Tier 1 đến 3</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSellTierRange(1, 4, 'Tier 1-4')}
                    className="w-full text-left px-2 py-1 rounded text-[10px] text-white/80 hover:bg-white/15 cursor-pointer flex items-center justify-between"
                  >
                    <span>Bán Tier 1 đến 4</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sell All Button */}
          <button
            type="button"
            onClick={handleSellAll}
            disabled={totalCount === 0}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
              totalCount > 0
                ? 'bg-amber-500/25 border-amber-400/40 text-amber-200 hover:bg-amber-500/35 active:scale-95 shadow-sm'
                : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Coins className="w-3 h-3 text-amber-300" strokeWidth={1.5} />
            <span>Bán tất cả</span>
          </button>
        </div>
      </div>

      {/* Floating Sell Success Banner */}
      <AnimatePresence>
        {lastSoldNotify && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 rounded-lg px-2 py-0.5 flex items-center gap-1"
          >
            <Check className="w-3 h-3 text-emerald-400" strokeWidth={1.5} />
            <span>Đã bán: {lastSoldNotify}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal Scroll of Fish In Basket */}
      <div
        className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden py-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {basket.length === 0 ? (
          <span className="text-[10px] text-white/40 italic py-1 px-1">
            Giỏ cá đang trống. Hãy kéo câu hoặc bật treo máy!
          </span>
        ) : (
          basket.map((item) => {
            const fish = FISH_MAP[item.fishId];
            if (!fish) return null;
            const style = TIER_COLORS[fish.tier];
            const unitPrice = calculateFishPrice(fish, currentWorld, currentRodId);

            const fishImg = getFishImageUrl(fish.id);

            return (
              <div
                key={item.fishId}
                className={`shrink-0 px-2 py-1 rounded-xl border flex items-center gap-1.5 ${style.bg} ${style.border}`}
              >
                {fishImg && (
                  <img src={fishImg} alt={fish.name} className="w-5 h-5 object-contain shrink-0 drop-shadow" />
                )}
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-white/90 truncate max-w-[90px] leading-tight">
                    {fish.name}
                  </span>
                  <span className="text-[9px] text-white/50 leading-none">
                    {unitPrice.toLocaleString()}v • T{fish.tier}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-amber-300 bg-black/40 px-1.5 py-0.2 rounded-md">
                  ×{item.count}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
