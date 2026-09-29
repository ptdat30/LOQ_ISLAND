import React from 'react';
import { motion } from 'framer-motion';
import { EggIcon } from './EggIcon';
import { EggProgressRing } from './EggProgressRing';
import {
  useEggTimerStore,
  getEggProgress,
  getEggProgressColor,
} from '../../../stores/eggTimerStore';
import { islandColors } from '../../../lib/motion';

interface EggTimerBubbleProps {
  onClick: () => void;
}

const bubbleSpring = { type: 'spring' as const, stiffness: 380, damping: 28, mass: 0.8 };

export const EggTimerBubble: React.FC<EggTimerBubbleProps> = ({ onClick }) => {
  const { status, remainingMs, durationMs } = useEggTimerStore();

  const isAlert = status === 'alert';
  const progress = getEggProgress(remainingMs, durationMs, status);
  const color = getEggProgressColor(remainingMs, status);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.12 } }}
      transition={bubbleSpring}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      title="Hẹn giờ luộc trứng 15 phút"
      className={`shrink-0 relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer overflow-hidden ${
        isAlert ? 'animate-pill-glow' : ''
      }`}
      style={{
        background: islandColors.bg,
        boxShadow: islandColors.shadow,
        willChange: 'transform',
      }}
    >
      <EggProgressRing
        size={32}
        strokeWidth={1.5}
        progress={progress}
        color={color}
      >
        <div className={isAlert ? 'animate-egg-blink' : ''}>
          <EggIcon
            size={14}
            className={isAlert ? 'text-white' : ''}
            style={{ color: isAlert ? '#ffffff' : color }}
          />
        </div>
      </EggProgressRing>
    </motion.button>
  );
};
