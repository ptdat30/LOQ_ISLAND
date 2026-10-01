import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gem, Sparkles } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';

export const CollectionCompletionModal: React.FC = () => {
  const isCelebrationActive = useFishingStore((s) => s.collectionCompletedCelebration);
  const dismiss = useFishingStore((s) => s.dismissCollectionCompletionCelebration);

  useEffect(() => {
    if (isCelebrationActive) {
      const timer = setTimeout(() => {
        dismiss();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isCelebrationActive, dismiss]);

  return (
    <AnimatePresence>
      {isCelebrationActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center p-3 select-none pointer-events-auto"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
          }}
        >
          {/* Rainbow Pulsing Border Glow */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(239, 68, 68, 0.8)',
                '0 0 35px rgba(245, 158, 11, 0.8)',
                '0 0 35px rgba(16, 185, 129, 0.8)',
                '0 0 35px rgba(59, 130, 246, 0.8)',
                '0 0 35px rgba(168, 85, 247, 0.8)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-2xl pointer-events-none"
          />

          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 380 - 190,
                  y: 120,
                  opacity: 1,
                  scale: Math.random() * 0.8 + 0.4,
                }}
                animate={{
                  y: -140,
                  x: (Math.random() - 0.5) * 250,
                  rotate: Math.random() * 360,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                  ease: 'easeOut',
                }}
                className="absolute left-1/2 bottom-0 w-2.5 h-2.5 rounded-sm"
                style={{
                  backgroundColor: ['#FFD60A', '#FF3B30', '#30D158', '#0A84FF', '#BF5AF2', '#FF9F0A'][i % 6],
                }}
              />
            ))}
          </div>

          {/* Card Content */}
          <motion.div
            initial={{ scale: 0.8, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className="relative z-10 w-full max-w-[340px] bg-neutral-900/90 border border-yellow-400/40 rounded-2xl p-4 flex flex-col items-center text-center shadow-2xl backdrop-blur-xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-2">
              <Trophy className="w-8 h-8 text-neutral-950" strokeWidth={2} />
            </div>

            <h2 className="text-[16px] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 uppercase tracking-wide">
              🏆 HOÀN THÀNH BỘ SƯU TẬP!
            </h2>

            <p className="text-[11px] text-white/75 mt-1 leading-snug">
              Chúc mừng bạn đã chinh phục toàn bộ <strong className="text-amber-300">84/84 loài cá</strong> trên mọi đại dương và thời đại!
            </p>

            <div className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-2.5 my-3 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-sky-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Gem className="w-3.5 h-3.5 text-sky-400" />
                  Kim Cương Thưởng:
                </span>
                <span className="text-[13px] tabular-nums font-bold">+10,000 💎</span>
              </div>

              <div className="flex items-center justify-between text-purple-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Hiệu Ứng Độc Quyền:
                </span>
                <span className="text-[11px] font-bold text-amber-200">Collection Master</span>
              </div>
            </div>

            <button
              type="button"
              onClick={dismiss}
              className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-bold text-[12px] hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Nhận Thưởng Ngay
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
