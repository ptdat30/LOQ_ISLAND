import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { Activity } from '../../types/activity';
import { IconRenderer } from './IconRenderer';
import { Pin, PinOff, X, Play, Pause, Layers } from 'lucide-react';
import { islandColors } from '../../lib/motion';
import { EggTimerCompact } from './EggTimer/EggTimerCompact';
import { EggTimerExpanded } from './EggTimer/EggTimerExpanded';
import { useEggTimerStore } from '../../stores/eggTimerStore';

interface PrimaryPillProps {
  activity: Activity | null;
  isExpanded: boolean;
  isPinned: boolean;
  queuedCount: number;
  isEggTimer?: boolean;
  onTogglePin: () => void;
  onToggleExpand: () => void;
  onToggleDrawer: () => void;
  onDismiss: () => void;
  onActionClick?: (actionId: string) => void;
  onEggStart?: () => void;
}

// Lightweight spring - settles fast, no lingering micro-movements
const pillSpring = { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.8 };

export const PrimaryPill: React.FC<PrimaryPillProps> = ({
  activity,
  isExpanded,
  isPinned,
  queuedCount,
  isEggTimer = false,
  onTogglePin,
  onToggleExpand,
  onToggleDrawer,
  onDismiss,
  onActionClick,
  onEggStart,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { status: eggStatus, dismissAlert } = useEggTimerStore();

  const isAlert = eggStatus === 'alert';
  const showEgg = isEggTimer || !activity;

  const handleClick = (e: React.MouseEvent) => {
    if (isAlert) {
      e.stopPropagation();
      dismissAlert();
      if (isExpanded) onToggleExpand();
      return;
    }

    if (!isExpanded) {
      e.stopPropagation();
      onToggleExpand();
    }
  };

  return (
    <motion.div
      ref={containerRef}
      data-testid="primary-pill"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        width: isExpanded ? 400 : (showEgg && eggStatus === 'idle' ? 200 : 230),
        height: isExpanded ? 170 : 37,
        borderRadius: isExpanded ? 32 : 9999,
      }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={pillSpring}
      whileHover={!isExpanded ? { scale: 1.03 } : undefined}
      whileTap={!isExpanded ? { scale: 0.97 } : undefined}
      drag={isExpanded ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_e, info) => {
        if (info.offset.y > 45 || info.velocity.y > 300) onToggleExpand();
      }}
      style={{
        background: islandColors.bg,
        boxShadow: isAlert
          ? undefined
          : isExpanded
          ? '0 20px 40px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)'
          : islandColors.shadow,
        willChange: 'transform',
      }}
      className={`shrink-0 relative overflow-hidden select-none cursor-pointer ${
        isAlert ? 'animate-pill-glow' : ''
      }`}
      onClick={handleClick}
      onDoubleClick={(e) => {
        if (!isAlert) {
          e.stopPropagation();
          onTogglePin();
        }
      }}
    >
      {/* ─── COMPACT VIEW ─── */}
      <div
        className="absolute inset-0 flex items-center justify-between px-3"
        style={{
          height: 37,
          opacity: isExpanded ? 0 : 1,
          pointerEvents: isExpanded ? 'none' : 'auto',
          transition: 'opacity 0.12s ease-out',
        }}
      >
        {showEgg ? (
          <EggTimerCompact
            onStart={() => {
              if (onEggStart) onEggStart();
              else if (!isExpanded) onToggleExpand();
            }}
          />
        ) : activity ? (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                {activity.thumbnail ? (
                  <img src={activity.thumbnail} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <IconRenderer name={activity.icon} className="w-3 h-3 text-white/85" />
                )}
              </div>
              <span
                className="truncate max-w-[155px] leading-none"
                style={{ color: '#fff', fontSize: 13, fontWeight: 590, letterSpacing: -0.08 }}
              >
                {activity.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {activity.type === 'media' && (
                <div className="flex items-end gap-0.5 h-3 px-1">
                  <span className="w-0.5 h-2 rounded-full animate-wave" style={{ background: islandColors.accent, animationDelay: '0ms' }} />
                  <span className="w-0.5 h-3 rounded-full animate-wave" style={{ background: islandColors.accent, animationDelay: '200ms' }} />
                  <span className="w-0.5 h-1.5 rounded-full animate-wave" style={{ background: islandColors.accent, animationDelay: '400ms' }} />
                </div>
              )}
              {queuedCount > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDrawer();
                  }}
                  className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                >
                  <Layers className="w-2.5 h-2.5" strokeWidth={1.5} />+{queuedCount}
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* ─── EXPANDED VIEW ─── */}
      <div
        className="absolute inset-0 flex flex-col justify-between"
        style={{
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? 'auto' : 'none',
          transition: 'opacity 0.15s ease-out',
        }}
      >
        {showEgg ? (
          <EggTimerExpanded onDismiss={onToggleExpand} />
        ) : activity ? (
          <div className="flex flex-col justify-between h-full p-4">
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  {activity.thumbnail ? (
                    <img src={activity.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <IconRenderer name={activity.icon} className="w-4 h-4" style={{ color: islandColors.accent }} />
                  )}
                </div>
                <div className="min-w-0">
                  <h4
                    className="uppercase tracking-wider leading-none truncate max-w-[210px]"
                    style={{ fontSize: 10, fontWeight: 590, color: islandColors.accent }}
                  >
                    {activity.app}
                  </h4>
                  <span
                    className="truncate max-w-[210px] inline-block leading-tight mt-0.5"
                    style={{ fontSize: 15, fontWeight: 590, letterSpacing: -0.24, color: '#fff' }}
                  >
                    {activity.title}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {queuedCount > 0 && (
                  <button type="button" onClick={onToggleDrawer} className="p-1 rounded-md text-white/60 hover:text-white transition-colors">
                    <Layers className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onTogglePin}
                  className="p-1 rounded-md transition-colors"
                  style={{
                    color: isPinned ? islandColors.accent : 'rgba(255,255,255,0.6)',
                    background: isPinned ? 'rgba(10,132,255,0.15)' : 'transparent',
                  }}
                >
                  {isPinned ? <Pin className="w-4 h-4" strokeWidth={1.5} /> : <PinOff className="w-4 h-4" strokeWidth={1.5} />}
                </button>
                <button type="button" onClick={onDismiss} className="p-1 rounded-md text-white/60 hover:text-rose-400 transition-colors">
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-2 py-1">
              <span className="truncate max-w-[240px]" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                {activity.subtitle || 'Audio Playing'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick?.('play');
                }}
                className="p-2.5 rounded-full flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-transform"
                style={{ background: '#fff', color: '#000', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
              >
                {activity.actions?.find((a) => a.id === 'play')?.icon === 'Play' ? (
                  <Play className="w-4 h-4 fill-black ml-0.5" strokeWidth={1.5} />
                ) : (
                  <Pause className="w-4 h-4 fill-black" strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between pt-1.5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}
            >
              <span>Double-click to {isPinned ? 'unpin' : 'pin'}</span>
              <span className="flex items-center gap-1">
                Press <kbd className="px-1 rounded" style={{ background: 'rgba(255,255,255,0.08)' }}>Esc</kbd> to collapse
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};
