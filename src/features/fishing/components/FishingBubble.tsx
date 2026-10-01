import React from 'react';
import { motion } from 'framer-motion';
import { Fish } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';

interface FishingBubbleProps {
  onClick: () => void;
}

export const FishingBubble: React.FC<FishingBubbleProps> = ({ onClick }) => {
  const isFishingActive = useFishingStore((s) => s.isFishingActive);

  return (
    <motion.button
      type="button"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative w-9 h-9 rounded-full bg-black/90 border border-white/15 backdrop-blur-2xl flex items-center justify-center cursor-pointer shadow-lg hover:border-sky-400/40 transition-all select-none"
      title="Mini-Game Câu Cá (Click để mở)"
    >
      <Fish className="w-4 h-4 text-sky-400" strokeWidth={1.5} />
      {isFishingActive && (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 border border-black animate-pulse" />
      )}
    </motion.button>
  );
};
