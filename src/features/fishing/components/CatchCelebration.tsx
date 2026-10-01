import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Crown, X } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { TIER_COLORS } from '../data/ratesData';
import { getFishImageUrl } from '../data/fishImages';

export const CatchCelebration: React.FC = () => {
  const celebrationTier = useFishingStore((s) => s.celebrationTier);
  const lastCaughtFish = useFishingStore((s) => s.lastCaughtFish);
  const clearCelebration = useFishingStore((s) => s.clearCelebration);

  // Freeze the celebrated fish upon mount to prevent any auto-fishing jump or overwrite
  const [celebratedFish] = useState(() => lastCaughtFish);

  const activeFish = celebratedFish || lastCaughtFish;

  if (!celebrationTier || !activeFish) return null;

  const style = TIER_COLORS[celebrationTier];
  const isTier7 = celebrationTier === 7;
  const isTier6 = celebrationTier === 6;

  // Lightweight particle count optimized for 60fps
  const particleCount = isTier7 ? 14 : isTier6 ? 8 : 6;

  // Memoize particle coordinates so they NEVER recompute or jitter
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => {
      const offsetX = (i / particleCount - 0.5) * 300 + Math.sin(i * 1.7) * 25;
      return {
        id: i,
        startX: offsetX,
        endX: offsetX + Math.cos(i * 1.3) * 35,
        scale: 0.5 + (i % 3) * 0.25,
        duration: 1.4 + (i % 4) * 0.25,
        delay: (i * 0.09) % 0.5,
      };
    });
  }, [particleCount]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      className={`absolute inset-0 z-50 rounded-[32px] overflow-hidden flex flex-col items-center justify-center p-4 backdrop-blur-3xl select-none text-white transform-gpu will-change-transform ${
        isTier7
          ? 'bg-gradient-to-b from-amber-950/95 via-black/95 to-amber-900/95 border-2 border-yellow-300 shadow-[0_0_80px_rgba(253,224,71,0.6)]'
          : isTier6
          ? 'bg-black/95 border border-rose-500/60 shadow-[0_0_50px_rgba(244,63,94,0.4)]'
          : 'bg-black/95 border border-amber-500/50 shadow-[0_0_35px_rgba(245,158,11,0.3)]'
      }`}
    >
      {/* Floating Particles with GPU Acceleration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: p.startX,
              y: 120,
              opacity: 0,
              scale: p.scale,
            }}
            animate={{
              y: -140,
              opacity: [0, 1, 1, 0],
              x: p.endX,
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeOut',
              delay: p.delay,
            }}
            className="absolute left-1/2 bottom-0 w-2 h-2 rounded-full will-change-transform transform-gpu"
            style={{
              background: isTier7
                ? '#fde047'
                : isTier6
                ? '#fb7185'
                : '#fbbf24',
              boxShadow: `0 0 10px ${style.glow}`,
            }}
          />
        ))}
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={clearCelebration}
        className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
      >
        <X className="w-4 h-4" strokeWidth={1.5} />
      </button>

      {/* Header icon badge */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: [0, 1.2, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-2xl mb-2 will-change-transform transform-gpu"
        style={{
          background: style.glow,
          borderColor: isTier7 ? '#fde047' : '#ffffff40',
        }}
      >
        {getFishImageUrl(activeFish.id) ? (
          <img
            src={getFishImageUrl(activeFish.id)}
            alt={activeFish.name}
            className="w-12 h-12 object-contain drop-shadow-2xl"
          />
        ) : isTier7 ? (
          <Crown className="w-8 h-8 text-yellow-200 fill-yellow-300 drop-shadow-md" strokeWidth={1.5} />
        ) : (
          <Trophy className="w-7 h-7 text-white drop-shadow-md" strokeWidth={1.5} />
        )}
      </motion.div>

      {/* Tier Category */}
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className={`text-[11px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full border mb-1 ${style.bg} ${style.border} ${style.text}`}
      >
        {isTier7 ? '👑 BOSS ĐỘC TÔN (DIVINE)' : `${style.name.toUpperCase()} (TIER ${celebrationTier})`}
      </motion.span>

      {/* Fish Name */}
      <motion.h2
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[17px] font-black text-center text-white drop-shadow-lg max-w-[360px] leading-tight"
      >
        {activeFish.name}
      </motion.h2>

      {/* Reward Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        className="flex items-center gap-3 mt-2 text-[12px] font-bold"
      >
        <span className="text-amber-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
          +{activeFish.basePrice.toLocaleString()} vàng
        </span>
        {isTier7 && (
          <span className="text-sky-300 flex items-center gap-1 bg-sky-500/20 px-2 py-0.5 rounded-lg border border-sky-400/40">
            💎 Chắc chắn rớt 10 Kim Cương!
          </span>
        )}
      </motion.div>

      {/* First-time catch unlock callout */}
      {activeFish.description && (
        <p className="text-[10px] text-white/60 text-center max-w-[340px] italic mt-1 line-clamp-2">
          "{activeFish.description}"
        </p>
      )}
    </motion.div>
  );
};
