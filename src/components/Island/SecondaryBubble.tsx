import React from 'react';
import { motion } from 'framer-motion';
import type { Activity } from '../../types/activity';
import { IconRenderer } from './IconRenderer';

interface SecondaryBubbleProps {
  activity: Activity;
  onClick: () => void;
  position?: 'left' | 'right';
}

export const SecondaryBubble: React.FC<SecondaryBubbleProps> = ({
  activity,
  onClick,
}) => {
  const progressPercent = activity.progress ? Math.round(activity.progress * 100) : null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      title={`${activity.app}: ${activity.title} (Click to switch)`}
      className="shrink-0 relative w-9 h-9 rounded-full flex items-center justify-center 
        bg-[#0c0c12] border border-white/20 shadow-lg cursor-pointer
        hover:border-white/40 transition-colors group overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 pointer-events-none" />

      {/* Mini Circular Progress Ring if progress exists */}
      {progressPercent !== null && (
        <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle
            cx="18"
            cy="18"
            r="15"
            className="stroke-white/10 fill-none"
            strokeWidth="1.5"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            className="stroke-sky-400 fill-none transition-all duration-300"
            strokeWidth="1.5"
            strokeDasharray={94.2}
            strokeDashoffset={94.2 - (94.2 * (activity.progress || 0))}
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Mini Icon or Thumbnail */}
      <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden rounded-full p-1.5">
        {activity.thumbnail ? (
          <img src={activity.thumbnail} alt="" className="w-full h-full object-cover rounded-full" />
        ) : (
          <IconRenderer name={activity.icon} className="w-4 h-4 text-white/90 group-hover:text-sky-300 transition-colors" />
        )}
      </div>
    </motion.button>
  );
};
