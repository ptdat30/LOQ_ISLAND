import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { FISH_MAP } from '../data/fishData';
import { getFishImageUrl } from '../data/fishImages';
import { calculateFishPrice } from '../logic/economy';
import { TierBadge } from './shared/TierBadge';
import { TabularNumber } from './shared/TabularNumber';
import { ActionButton } from './shared/ActionButton';
import { TOKENS } from '../constants/tokens';
import type { FishTier } from '../../../types/fishing';

export const FishBasket: React.FC = () => {
  const basket = useFishingStore((s) => s.basket);
  const currentWorld = useFishingStore((s) => s.currentWorld);
  const currentRodId = useFishingStore((s) => s.currentRodId);
  const ownedAutoUpgrades = useFishingStore((s) => s.ownedAutoUpgrades);
  const sellAllFish = useFishingStore((s) => s.sellAllFish);
  const sellFishByTier = useFishingStore((s) => s.sellFishByTier);
  const getBasketEstimatedValue = useFishingStore((s) => s.getBasketEstimatedValue);
  const inspectFish = useFishingStore((s) => s.inspectFish);

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
    <div
      className="w-full shrink-0 rounded-[16px] bg-[#14141A] border border-white/[0.06] p-3 flex flex-col justify-between select-none relative"
      style={{
        boxShadow: TOKENS.shadows.innerHighlight,
      }}
    >
      {/* Header Row: Tension Layout (Left: Title + Count + Gold, Right: Sell Controls) */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {/* Left: Summary Metrics */}
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-[13px] font-semibold text-[#F5F5F7] tracking-tight">
            Giỏ cá
          </span>
          <span className="text-[11px] text-[#8A8A94] tabular-nums font-normal">
            {totalCount.toLocaleString()}/{maxCapacity}
          </span>
          {estimatedGold > 0 && (
            <span className="text-[12px] font-medium text-[#FFD60A] tabular-nums">
              ≈ <TabularNumber value={estimatedGold} /> vàng
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Filter Menu Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="h-7 px-2 rounded-[8px] bg-white/[0.06] hover:bg-white/[0.1] text-[11px] text-[#8A8A94] hover:text-[#F5F5F7] border border-white/[0.06] cursor-pointer flex items-center gap-1 transition-colors"
              title="Bán theo nhóm Tier"
            >
              <span>Lọc bán</span>
              <ChevronDown className="w-3 h-3 text-[#8A8A94]" strokeWidth={1.5} />
            </button>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-8 z-30 w-36 bg-[#14141A] border border-white/[0.08] rounded-[10px] p-1 shadow-2xl space-y-0.5"
                  style={{ boxShadow: TOKENS.shadows.card }}
                >
                  <button
                    type="button"
                    onClick={() => handleSellTierRange(1, 1, 'T1')}
                    className="w-full text-left px-2 py-1 rounded-[6px] text-[11px] text-[#8A8A94] hover:text-[#F5F5F7] hover:bg-white/[0.08] cursor-pointer"
                  >
                    Bán chỉ Tier 1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSellTierRange(1, 2, 'T1-2')}
                    className="w-full text-left px-2 py-1 rounded-[6px] text-[11px] text-[#8A8A94] hover:text-[#F5F5F7] hover:bg-white/[0.08] cursor-pointer"
                  >
                    Bán Tier 1 & 2
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSellTierRange(1, 3, 'T1-3')}
                    className="w-full text-left px-2 py-1 rounded-[6px] text-[11px] text-[#8A8A94] hover:text-[#F5F5F7] hover:bg-white/[0.08] cursor-pointer"
                  >
                    Bán Tier 1 đến 3
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSellTierRange(1, 4, 'T1-4')}
                    className="w-full text-left px-2 py-1 rounded-[6px] text-[11px] text-[#8A8A94] hover:text-[#F5F5F7] hover:bg-white/[0.08] cursor-pointer"
                  >
                    Bán Tier 1 đến 4
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sell All Button */}
          <ActionButton
            variant="primary"
            size="sm"
            onClick={handleSellAll}
            disabled={totalCount === 0}
            title={totalCount > 0 ? `Bán tất cả ${totalCount} cá thu về vàng` : 'Giỏ đang trống'}
          >
            Bán tất cả
          </ActionButton>
        </div>
      </div>

      {/* Floating Sell Success Banner */}
      <AnimatePresence>
        {lastSoldNotify && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="text-[11px] font-medium text-[#32D74B] bg-[#32D74B]/10 border border-[#32D74B]/20 rounded-[8px] px-2 py-1 mb-2 flex items-center gap-1.5"
          >
            <Check className="w-3 h-3 text-[#32D74B]" strokeWidth={1.5} />
            <span>Đã bán: {lastSoldNotify}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal Scroll of Recent / Basket Catches */}
      <div
        className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden py-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {basket.length === 0 ? (
          <div className="w-full py-3 text-center text-[12px] text-[#8A8A94] italic">
            Giỏ cá trống. Kéo câu hoặc bật treo máy để bắt đầu.
          </div>
        ) : (
          basket.map((item) => {
            const fish = FISH_MAP[item.fishId];
            if (!fish) return null;
            const unitPrice = calculateFishPrice(fish, currentWorld, currentRodId);
            const fishImg = getFishImageUrl(fish.id);

            return (
              <div
                key={item.fishId}
                onClick={() => inspectFish(fish.id)}
                className="shrink-0 w-[84px] h-[78px] rounded-[12px] bg-[#1A1A22] border border-white/[0.06] p-1.5 flex flex-col justify-between cursor-pointer hover:border-white/20 active:scale-[0.96] transition-all relative group"
                style={{ boxShadow: TOKENS.shadows.innerHighlight }}
                title={`${fish.name} - Bấm để xem chi tiết`}
              >
                {/* Top: Tier Badge & Count */}
                <div className="flex items-center justify-between w-full">
                  <TierBadge tier={fish.tier} />
                  <span className="text-[10px] font-semibold text-[#FFD60A] tabular-nums bg-black/40 px-1 py-0.2 rounded-[4px]">
                    ×{item.count}
                  </span>
                </div>

                {/* Middle: Fish Thumbnail */}
                <div className="flex items-center justify-center my-0.5">
                  {fishImg ? (
                    <img
                      src={fishImg}
                      alt={fish.name}
                      className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="text-sm">🐟</span>
                  )}
                </div>

                {/* Bottom: Name & Price */}
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-medium text-[#F5F5F7] truncate">
                    {fish.name}
                  </span>
                  <span className="text-[9px] text-[#8A8A94] tabular-nums">
                    {unitPrice.toLocaleString()}v
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
