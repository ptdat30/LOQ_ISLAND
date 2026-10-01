import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Fish as FishIcon, Zap, AlertTriangle, Sparkles } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { TIER_COLORS } from '../data/ratesData';
import { WORLDS_INFO } from '../data/fishData';
import { BAITS_INFO } from '../data/shopData';

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
  const tierColor = lastCaughtFish ? TIER_COLORS[lastCaughtFish.tier] : TIER_COLORS[1];

  // Water background based on World
  const waterGradients: Record<number, string> = {
    1: 'linear-gradient(180deg, rgba(8, 47, 73, 0.4) 0%, rgba(3, 105, 161, 0.6) 100%)', // Ocean Blue
    2: 'linear-gradient(180deg, rgba(20, 83, 45, 0.4) 0%, rgba(13, 148, 136, 0.6) 100%)', // Radioactive Green/Teal
    3: 'linear-gradient(180deg, rgba(67, 20, 7, 0.4) 0%, rgba(120, 53, 15, 0.6) 100%)', // Prehistoric Amber/Sepia
  };

  const waterColor = waterGradients[currentWorld] || waterGradients[1];

  return (
    <div className="relative w-full h-[88px] shrink-0 rounded-2xl overflow-hidden border border-white/10 select-none flex flex-col justify-between p-2.5 shadow-inner">
      {/* Dynamic Animated Water Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{ background: waterColor }}
      >
        {/* Soft Wave Ripple 1 */}
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-4 -left-10 -right-10 h-10 opacity-30 rounded-[100%]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
        />
        {/* Soft Wave Ripple 2 */}
        <motion.div
          animate={{ x: [20, -20, 20] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 -left-10 -right-10 h-6 opacity-20 rounded-[100%]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, transparent 60%)' }}
        />
      </div>

      {/* Top Bar inside Fishing Scene */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold tracking-wide text-white/90 uppercase px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFishingActive ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'
              }`}
            />
            {worldInfo.name}
          </span>

          {lastCatchBatch && lastCatchBatch.caughtItems.length > 1 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" strokeWidth={1.5} />
              +{lastCatchBatch.caughtItems.length} cá
            </span>
          )}

          {activeBait && (
            <button
              type="button"
              onClick={() => equipBait(null)}
              title="Click để tháo mồi câu"
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer transition-all ${
                currentBaitId === 'bait_boss_awakening'
                  ? 'bg-rose-500/30 border-rose-400 text-rose-200 animate-pulse'
                  : currentBaitId === 'bait_mystic_gold'
                  ? 'bg-amber-400/25 border-amber-300 text-amber-200 shadow-sm'
                  : 'bg-white/15 border-white/20 text-white/90 hover:bg-white/25'
              }`}
            >
              <span>{activeBait.name.split(' ')[1] || activeBait.name}</span>
              <span className="opacity-75">({baitCount})</span>
            </button>
          )}
        </div>

        {/* Fishing Toggle Button & Manual Reel */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => catchRound()}
            className="px-2.5 py-1 text-[11px] font-medium text-white/90 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-lg border border-white/15 cursor-pointer flex items-center gap-1 shadow-sm"
            title="Bấm để câu 1 lần ngay lập tức"
          >
            <span>Kéo câu</span>
          </button>

          <button
            type="button"
            onClick={() => setFishingActive(!isFishingActive)}
            className={`px-3 py-1 text-[11px] font-semibold transition-all rounded-lg border cursor-pointer flex items-center gap-1.5 shadow-md ${
              isFishingActive
                ? 'bg-rose-500/25 border-rose-500/40 text-rose-200 hover:bg-rose-500/35'
                : 'bg-emerald-500/30 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/40'
            }`}
          >
            {isFishingActive ? (
              <>
                <Pause className="w-3 h-3 text-rose-300" strokeWidth={1.5} />
                <span>Dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-300 fill-emerald-300" strokeWidth={1.5} />
                <span>Treo máy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Catch Showcase / Fish Floating */}
      <div className="relative z-10 flex items-center justify-between px-1">
        <AnimatePresence mode="wait">
          {lastCaughtFish ? (
            <motion.div
              key={lastCaughtFish.id + (lastCatchBatch?.caughtItems.length || '')}
              initial={{ opacity: 0, y: 12, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              className="flex items-center gap-2 min-w-0"
            >
              {/* Fish Icon with Glow */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-lg shrink-0 ${tierColor.bg} ${tierColor.border}`}
                style={{ boxShadow: `0 0 16px ${tierColor.glow}` }}
              >
                <FishIcon className={`w-4 h-4 ${tierColor.text}`} strokeWidth={1.5} />
              </div>

              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-semibold text-white truncate max-w-[170px]">
                    {lastCaughtFish.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${tierColor.bg} ${tierColor.border} ${tierColor.text}`}
                  >
                    Tier {lastCaughtFish.tier}
                  </span>
                </div>
                <span className="text-[10px] text-white/60 truncate">
                  {tierColor.name} • {lastCaughtFish.basePrice.toLocaleString()} vàng
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-white/50 text-xs py-1">
              <motion.div
                animate={{ y: [-1, 2, -1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FishIcon className="w-5 h-5 text-white/40" strokeWidth={1.5} />
              </motion.div>
              <span>Đang thả câu dưới nước...</span>
            </div>
          )}
        </AnimatePresence>

        {/* Hazard / Time Rift / Info Banner Pill */}
        {bannerMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 border border-white/15 text-[10px] text-amber-300 max-w-[150px] truncate"
          >
            {bannerMessage.includes('Nước Độc') ? (
              <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" strokeWidth={1.5} />
            ) : (
              <Sparkles className="w-3 h-3 text-yellow-300 shrink-0" strokeWidth={1.5} />
            )}
            <span className="truncate">{bannerMessage}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
