import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { Activity } from '../../types/activity';
import { IconRenderer } from './IconRenderer';
import {
  Pin,
  PinOff,
  X,
  Play,
  Pause,
  Layers,
} from 'lucide-react';
import { appleSprings, appleTactile } from '../../animations/physics';

interface PrimaryPillProps {
  activity: Activity | null;
  isExpanded: boolean;
  isPinned: boolean;
  queuedCount: number;
  onTogglePin: () => void;
  onToggleExpand: () => void;
  onToggleDrawer: () => void;
  onDismiss: () => void;
  onActionClick?: (actionId: string) => void;
}

export const PrimaryPill: React.FC<PrimaryPillProps> = ({
  activity,
  isExpanded,
  isPinned,
  queuedCount,
  onTogglePin,
  onToggleExpand,
  onToggleDrawer,
  onDismiss,
  onActionClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // If no active music, disappear completely from screen (Apple stealth mode)
  if (!activity) {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      data-testid="primary-pill"
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        width: isExpanded ? 400 : 230,
        height: isExpanded ? 155 : 36,
        borderRadius: isExpanded ? 24 : 9999,
      }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={appleSprings.islandMorph}
      whileHover={!isExpanded ? { scale: 1.02 } : undefined}
      whileTap={!isExpanded ? { scale: 0.98, transition: { duration: 0.05 } } : undefined}
      drag={isExpanded ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.25}
      onDragEnd={(_e, info) => {
        // Velocity-aware collapse: if pulled down with velocity or > 45px
        if (info.offset.y > 45 || info.velocity.y > 300) {
          onToggleExpand();
        }
      }}
      style={{
        willChange: 'width, height, border-radius, transform',
        transform: 'translateZ(0)',
      }}
      className="shrink-0 relative bg-[#0c0c12] border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85)] overflow-hidden select-none cursor-pointer"
      onClick={(e) => {
        if (!isExpanded) {
          e.stopPropagation();
          onToggleExpand();
        }
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onTogglePin();
      }}
    >
      {/* Subtle glass reflection gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

      {/* ================= COMPACT PILL LAYER ================= */}
      <motion.div
        animate={{
          opacity: isExpanded ? 0 : 1,
          scale: isExpanded ? 0.92 : 1,
          pointerEvents: isExpanded ? 'none' : 'auto',
        }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        className="absolute inset-0 h-[36px] flex items-center justify-between px-3 z-10"
      >
        {/* Left: Thumbnail & Song Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0 border border-white/15 shadow-sm">
            {activity.thumbnail ? (
              <img src={activity.thumbnail} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
              <IconRenderer name={activity.icon} className="w-3 h-3 text-sky-400" />
            )}
          </div>
          <span className="text-xs font-semibold text-white/95 truncate max-w-[155px] leading-none">
            {activity.title}
          </span>
        </div>

        {/* Right: Waveform & Queue */}
        <div className="flex items-center gap-1.5 shrink-0">
          {activity.type === 'media' && (
            <div className="flex items-end gap-0.5 h-3 px-1">
              <span className="w-0.5 h-2 bg-sky-400 rounded-full animate-wave" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-3 bg-sky-400 rounded-full animate-wave" style={{ animationDelay: '200ms' }} />
              <span className="w-0.5 h-1.5 bg-sky-400 rounded-full animate-wave" style={{ animationDelay: '400ms' }} />
            </div>
          )}
          {queuedCount > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDrawer();
              }}
              className="flex items-center gap-0.5 text-[10px] font-bold bg-white/20 hover:bg-white/30 text-white px-1.5 py-0.5 rounded-full cursor-pointer transition-colors"
              title={`${queuedCount} more activities`}
            >
              <Layers className="w-2.5 h-2.5" strokeWidth={1.5} />
              +{queuedCount}
            </button>
          )}
        </div>
      </motion.div>

      {/* ================= EXPANDED CARD LAYER ================= */}
      <motion.div
        animate={{
          opacity: isExpanded ? 1 : 0,
          scale: isExpanded ? 1 : 0.94,
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        className="absolute inset-0 p-3.5 flex flex-col justify-between z-10"
      >
        {/* Header: Channel/App name, Thumbnail, Title, Pin, Dismiss */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center shrink-0 border border-white/15 shadow-md">
              {activity.thumbnail ? (
                <img src={activity.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <IconRenderer name={activity.icon} className="w-4 h-4 text-sky-400" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold leading-none truncate max-w-[210px]">
                {activity.app}
              </h4>
              <span className="text-[12px] font-semibold text-white truncate max-w-[210px] inline-block leading-tight mt-0.5">
                {activity.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {queuedCount > 0 && (
              <button
                type="button"
                onClick={onToggleDrawer}
                className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title="View queued activities"
              >
                <Layers className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}
            <button
              type="button"
              onClick={onTogglePin}
              className={`p-1 rounded-md transition-colors ${
                isPinned ? 'text-sky-400 bg-sky-400/20' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={isPinned ? 'Unpin Expanded View' : 'Pin Expanded View'}
            >
              {isPinned ? <Pin className="w-4 h-4" strokeWidth={1.5} /> : <PinOff className="w-4 h-4" strokeWidth={1.5} />}
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="p-1 rounded-md text-white/60 hover:text-rose-400 hover:bg-white/10 transition-colors"
              title="Dismiss Activity"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Media Controls - Only Play/Pause Button & Status */}
        <div className="flex items-center justify-between px-2 py-1">
          <span className="truncate max-w-[240px] text-xs font-medium text-white/70">
            {activity.subtitle || 'Audio Playing'}
          </span>

          <motion.button
            type="button"
            whileHover={appleTactile.hover}
            whileTap={appleTactile.tap}
            onClick={(e) => {
              e.stopPropagation();
              onActionClick?.('play');
            }}
            className="p-2.5 rounded-full bg-white text-black shadow-xl cursor-pointer flex items-center justify-center shrink-0"
            title={activity.actions?.find((a) => a.id === 'play')?.icon === 'Play' ? 'Phát tiếp' : 'Tạm dừng'}
          >
            {activity.actions?.find((a) => a.id === 'play')?.icon === 'Play' ? (
              <Play className="w-4 h-4 fill-black ml-0.5" strokeWidth={1.5} />
            ) : (
              <Pause className="w-4 h-4 fill-black" strokeWidth={1.5} />
            )}
          </motion.button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-white/40 pt-1.5 border-t border-white/5">
          <span>Double-click to {isPinned ? 'unpin' : 'pin'}</span>
          <span className="flex items-center gap-1">
            Press <kbd className="bg-white/10 px-1 rounded text-white/60">Esc</kbd> to collapse
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
