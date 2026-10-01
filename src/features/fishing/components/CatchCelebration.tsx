import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { getFishImageUrl } from '../data/fishImages';
import { TierBadge } from './shared/TierBadge';
import { TabularNumber } from './shared/TabularNumber';
import { ActionButton } from './shared/ActionButton';
import { TOKENS, TierNumber } from '../constants/tokens';
import type { Fish as FishType } from '../../../types/fishing';

interface CatchCelebrationProps {
  fish?: FishType | null;
  tier?: number | null;
  onClose?: () => void;
}

export const CatchCelebration: React.FC<CatchCelebrationProps> = ({
  fish: propFish,
  tier: propTier,
  onClose: propOnClose,
}) => {
  const storeTier = useFishingStore((s) => s.celebrationTier);
  const storeFish = useFishingStore((s) => s.lastCaughtFish);
  const storeClear = useFishingStore((s) => s.clearCelebration);

  const celebrationTier = propTier ?? storeTier;
  const activeFish = propFish ?? storeFish;
  const clearCelebration = propOnClose ?? storeClear;

  const validTier = (celebrationTier && celebrationTier >= 1 && celebrationTier <= 7
    ? celebrationTier
    : 5) as TierNumber;
  const tierConfig = TOKENS.colors.tier[validTier];
  const isTier7 = celebrationTier === 7;
  const isTier6 = celebrationTier === 6;

  // Auto dismiss after 3.2s
  useEffect(() => {
    if (!celebrationTier || !activeFish) return;
    const timer = setTimeout(() => {
      clearCelebration();
    }, 3200);
    return () => clearTimeout(timer);
  }, [celebrationTier, activeFish, clearCelebration]);

  if (!celebrationTier || !activeFish) return null;

  const fishImage = getFishImageUrl(activeFish.id);

  return (
    <AnimatePresence>
      <motion.div
        key="quiet-catch-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-50 rounded-[18px] overflow-hidden flex flex-col justify-between p-4 select-none"
        style={{
          backgroundColor: isTier7 ? '#101018' : TOKENS.colors.bgOpacity,
          backdropFilter: TOKENS.blur.rootPill,
          boxShadow: isTier7
            ? `0 0 30px ${tierConfig.glow}, ${TOKENS.colors.innerHighlightStrong}`
            : isTier6
            ? `0 0 20px ${tierConfig.glow}, ${TOKENS.colors.innerHighlight}`
            : TOKENS.shadow.elevated,
        }}
      >
        {/* Tier 7 Quick Flash (chớp trắng 3 lần) */}
        {isTier7 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0, 0.4, 0, 0.4, 0] }}
            transition={{ duration: 0.8, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1] }}
            className="absolute inset-0 bg-white pointer-events-none z-30"
          />
        )}

        {/* Subtle radial center glow (ánh sáng tỏa từ tâm icon, không dùng particle) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${tierConfig.glow} 0%, transparent 65%)`,
            opacity: 0.25,
          }}
        />

        {/* Top Header: Tension (Left: Label & Tier Badge, Right: Dismiss) */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <TierBadge tier={validTier} />
            <span
              className="text-[#8A8A94] font-medium tracking-wide uppercase font-mono"
              style={{ fontSize: TOKENS.typography.micro.fontSize }}
            >
              {isTier7 ? 'Thần Thú Thức Tỉnh' : isTier6 ? 'Sinh Vật Thần Thoại' : 'Chiến Tích Quý Hiếm'}
            </span>
          </div>

          <button
            type="button"
            onClick={clearCelebration}
            className="p-1 rounded-md text-[#8A8A94] hover:text-[#F5F5F7] transition-colors cursor-pointer active:scale-95"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Center: Scaled Fish Artwork with Haptic Shake */}
        <motion.div
          initial={{ scale: 0.8, x: 0 }}
          animate={{
            scale: [0.8, 1.15, 1.0],
            x: [0, -2, 2, -2, 2, 0],
          }}
          transition={{
            scale: { duration: 0.38, ease: [0.34, 1.56, 0.64, 1] },
            x: { duration: 0.22, delay: 0.1 },
          }}
          className="relative flex items-center justify-center my-auto py-2 z-10"
        >
          {fishImage ? (
            <img
              src={fishImage}
              alt={activeFish.name}
              className="w-24 h-24 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-[#5AC8FA]">
              <span className="text-2xl font-bold font-mono">T{validTier}</span>
            </div>
          )}
        </motion.div>

        {/* Bottom Details: Tension (Tên + Kích thước căn trái, Giá bán + Nút Thu cất căn phải) */}
        <div
          className="flex items-center justify-between pt-2.5 z-10"
          style={{ borderTop: `1px solid ${TOKENS.colors.borderSubtle}` }}
        >
          <div className="flex flex-col min-w-0 pr-2">
            <h3
              className="text-[#F5F5F7] font-semibold truncate leading-tight font-display"
              style={{ fontSize: TOKENS.typography.body.fontSize }}
            >
              {activeFish.name}
            </h3>
            <span
              className="text-[#8A8A94] font-mono text-[11px] mt-0.5"
            >
              Kích thước: {activeFish.minSize} ~ {activeFish.maxSize} kg
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right font-mono">
              <span className="text-[10px] text-[#8A8A94] block uppercase">Giá trị</span>
              <TabularNumber
                value={activeFish.basePrice}
                suffix=" vàng"
                className="text-xs font-bold text-[#FFD60A]"
              />
            </div>

            <ActionButton
              variant="primary"
              size="sm"
              onClick={clearCelebration}
              icon={<Check className="w-3.5 h-3.5 text-[#0A0A0F]" strokeWidth={2} />}
            >
              Thu cất
            </ActionButton>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
