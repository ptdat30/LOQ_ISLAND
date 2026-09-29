import React from 'react';
import { motion } from 'framer-motion';
import type { Activity } from '../../types/activity';
import { IconRenderer } from './IconRenderer';
import { islandColors } from '../../lib/motion';

interface SecondaryBubbleProps {
  activity: Activity;
  onClick: () => void;
  position?: 'left' | 'right';
}

const bubbleSpring = { type: 'spring' as const, stiffness: 380, damping: 28, mass: 0.8 };

export const SecondaryBubble: React.FC<SecondaryBubbleProps> = ({
  activity, onClick,
}) => {
  const progressPercent = activity.progress ? Math.round(activity.progress * 100) : null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.12 } }}
      transition={bubbleSpring}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      title={`${activity.app}: ${activity.title}`}
      className="shrink-0 relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: islandColors.bg,
        boxShadow: islandColors.shadow,
        willChange: 'transform',
      }}
    >
      {/* Progress Ring */}
      {progressPercent !== null && (
        <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle cx="18" cy="18" r="15" className="fill-none" strokeWidth="1.5"
            style={{ stroke: 'rgba(255,255,255,0.08)' }} />
          <circle cx="18" cy="18" r="15" className="fill-none" strokeWidth="1.5"
            style={{ stroke: islandColors.accent, transition: 'stroke-dashoffset 0.3s ease-out' }}
            strokeLinecap="round"
            strokeDasharray={94.2}
            strokeDashoffset={94.2 - (94.2 * (activity.progress || 0))} />
        </svg>
      )}

      {/* Icon */}
      <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden rounded-full p-1.5">
        {activity.thumbnail ? (
          <img src={activity.thumbnail} alt="" className="w-full h-full object-cover rounded-full" />
        ) : (
          <IconRenderer name={activity.icon} className="w-4 h-4" style={{ color: islandColors.icon }} />
        )}
      </div>
    </motion.button>
  );
};
