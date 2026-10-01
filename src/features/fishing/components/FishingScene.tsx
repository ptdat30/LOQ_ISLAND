import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Zap, AlertTriangle, Sparkles } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { WORLDS_INFO } from '../data/fishData';
import { BAITS_INFO } from '../data/shopData';
import { getFishImageUrl } from '../data/fishImages';
import { TierBadge } from './shared/TierBadge';
import { TabularNumber } from './shared/TabularNumber';
import { ActionButton } from './shared/ActionButton';
import { TOKENS } from '../constants/tokens';

const BAIT_SHORT_NAMES: Record<string, string> = {
  bait_earthworm: 'Giun',
  bait_glow_blood: 'Dạ Quang',
  bait_amber_fossil: 'Hổ Phách',
  bait_mystic_gold: 'Vàng Ròng',
  bait_boss_awakening: 'Boss',
};

const WORLD_SHORT_NAMES: Record<number, string> = {
  1: 'Ao Hồ',
  2: 'Biển Độc',
  3: 'Cổ Đại',
};

// Deep, restrained water surfaces (no loud neons)
const WATER_BACKGROUNDS: Record<number, string> = {
  1: 'linear-gradient(180deg, #0A1420 0%, #0E1D2D 100%)', // Calm Deep Abyss
  2: 'linear-gradient(180deg, #0A1A14 0%, #0F251E 100%)', // Toxic Depth
  3: 'linear-gradient(180deg, #1C1510 0%, #261D16 100%)', // Sepia Prehistoric
};

export const FishingScene: React.FC = () => {
  const isFishingActive = useFishingStore((s) => s.isFishingActive);
  const setFishingActive = useFishingStore((s) => s.setFishingActive);
  const catchRound = useFishingStore((s) => s.catchRound);
  const lastCaughtFish = useFishingStore((s) => s.lastCaughtFish);
  const lastCatchBatch = useFishingStore((s) => s.lastCatchBatch);
  const currentWorld = useFishingStore((s) => s.currentWorld);
  const currentBaitId = useFishingStore((s) => s.currentBaitId);
  const baitInventory = useFishingStore((s) => s.baitInventory);
  const equipBait = useFishingStore((s) => s.equipBait);
  const bannerMessage = useFishingStore((s) => s.bannerMessage);

  const worldInfo = WORLDS_INFO[currentWorld];
  const activeBait = currentBaitId ? BAITS_INFO[currentBaitId] : null;
  const baitCount = currentBaitId ? baitInventory[currentBaitId] || 0 : 0;
  const waterBg = WATER_BACKGROUNDS[currentWorld] || WATER_BACKGROUNDS[1];

  return (
    <div
      className="relative w-full h-[112px] shrink-0 rounded-[16px] overflow-hidden border border-white/[0.06] select-none flex flex-col justify-between p-3"
      style={{
        background: waterBg,
        boxShadow: TOKENS.shadows.innerHighlight,
      }}
    >
      {/* Subtle Restrained Water Shimmer (Single soft line, no splash) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Calm horizontal water line */}
        <div
          className="absolute top-[38px] left-0 right-0 h-[1px] opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
        />
        {/* Soft breathing bobber ripple */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.05, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[34px] left-[52px] w-8 h-2 rounded-[100%] bg-white/30 blur-[2px]"
        />
      </div>

      {/* Top Header Row in Fishing Scene: World & Bait Left, Controls Right */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        {/* Left: World Pill & Bait */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-[6px] bg-[#14141A]/80 border border-white/[0.08] text-[#8A8A94] flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                isFishingActive ? 'bg-[#32D74B]' : 'bg-[#6E6E78]'
              }`}
            />
            <span>W{currentWorld}: {WORLD_SHORT_NAMES[currentWorld] || worldInfo.name}</span>
          </span>

          {lastCatchBatch && lastCatchBatch.caughtItems.length > 1 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-[6px] bg-[rgba(255,159,10,0.15)] text-[#FF9F0A] border border-[rgba(255,159,10,0.25)] flex items-center gap-0.5 shrink-0 whitespace-nowrap">
              <Zap className="w-2.5 h-2.5" strokeWidth={1.5} />
              +{lastCatchBatch.caughtItems.length}
            </span>
          )}

          {activeBait && (
            <button
              type="button"
              onClick={() => equipBait(null)}
              title={`Mồi đang dùng: ${activeBait.name} (Click để gỡ)`}
              className="text-[10px] font-medium px-2 py-0.5 rounded-[6px] bg-[#14141A]/90 border border-white/[0.08] text-[#F5F5F7] hover:border-white/20 transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>{BAIT_SHORT_NAMES[currentBaitId!] || 'Mồi'}</span>
              <span className="text-[#8A8A94]">({baitCount})</span>
            </button>
          )}
        </div>

        {/* Right: Actions (Manual Reel & Auto Toggle) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ActionButton
            variant="secondary"
            size="sm"
            onClick={() => catchRound()}
            title="Kéo câu tức thì 1 lần"
          >
            Kéo câu
          </ActionButton>

          <ActionButton
            variant={isFishingActive ? 'danger' : 'primary'}
            size="sm"
            onClick={() => setFishingActive(!isFishingActive)}
            title={isFishingActive ? 'Tạm dừng câu tự động' : 'Bật câu tự động liên tục'}
          >
            {isFishingActive ? (
              <>
                <Pause className="w-3 h-3" strokeWidth={1.5} />
                <span>Dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" strokeWidth={1.5} />
                <span>Treo máy</span>
              </>
            )}
          </ActionButton>
        </div>
      </div>

      {/* Middle/Bottom Catch Showcase Row */}
      <div className="relative z-10 flex items-center justify-between min-h-[44px]">
        <AnimatePresence mode="wait">
          {lastCaughtFish ? (
            <motion.div
              key={lastCaughtFish.id + (lastCatchBatch?.caughtItems.length || '')}
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5 min-w-0"
            >
              {/* Fish Icon Frame */}
              <div
                className="w-9 h-9 rounded-[10px] bg-[#14141A] border border-white/[0.08] flex items-center justify-center shrink-0 p-1"
                style={{ boxShadow: TOKENS.shadows.innerHighlight }}
              >
                {getFishImageUrl(lastCaughtFish.id) ? (
                  <img
                    src={getFishImageUrl(lastCaughtFish.id)}
                    alt={lastCaughtFish.name}
                    className="w-7 h-7 object-contain"
                  />
                ) : (
                  <span className="text-base">🐟</span>
                )}
              </div>

              {/* Fish Meta */}
              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#F5F5F7] truncate max-w-[150px]">
                    {lastCaughtFish.name}
                  </span>
                  <TierBadge tier={lastCaughtFish.tier} />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#8A8A94] mt-0.5">
                  <span>Giá bán:</span>
                  <span className="text-[#FFD60A] font-medium">
                    <TabularNumber value={lastCaughtFish.basePrice} /> vàng
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-[#8A8A94] text-[12px] py-1">
              <motion.div
                animate={{ y: [-1, 2, -1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-[#5AC8FA]"
              />
              <span className="font-normal">Đang buông cần dưới mặt nước...</span>
            </div>
          )}
        </AnimatePresence>

        {/* Hazard / Event Banner */}
        {bannerMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-[8px] bg-[#14141A]/90 border border-white/[0.08] text-[11px] text-[#FF9F0A] max-w-[160px] truncate shrink-0"
          >
            {bannerMessage.includes('Nước Độc') ? (
              <AlertTriangle className="w-3 h-3 text-[#FF453A] shrink-0" strokeWidth={1.5} />
            ) : (
              <Sparkles className="w-3 h-3 text-[#FFD60A] shrink-0" strokeWidth={1.5} />
            )}
            <span className="truncate">{bannerMessage}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
