import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { Activity } from '../../types/activity';
import { IconRenderer } from './IconRenderer';
import { Pin, PinOff, X, Play, Pause, Layers } from 'lucide-react';
import { islandColors } from '../../lib/motion';
import { EggIcon } from './EggTimer/EggIcon';
import { EggTimerCompact } from './EggTimer/EggTimerCompact';
import { EggTimerExpanded } from './EggTimer/EggTimerExpanded';
import { ShiftCompact } from './ShiftReminder/ShiftCompact';
import { ShiftExpanded } from './ShiftReminder/ShiftExpanded';
import { useEggTimerStore } from '../../stores/eggTimerStore';
import { useShiftScheduleStore, getNextTaskInfo } from '../../stores/shiftScheduleStore';
import { useFishingStore } from '../../features/fishing/stores/fishingStore';
import { FishingCompact } from '../../features/fishing/components/FishingCompact';
import { FishingExpanded } from '../../features/fishing/components/FishingExpanded';
import { ISLAND_COLORS } from '../../features/fishing/data/islandCustomizationData';

interface PrimaryPillProps {
  activity: Activity | null;
  isExpanded: boolean;
  isPinned: boolean;
  queuedCount: number;
  isEggTimer?: boolean;
  isFishing?: boolean;
  onTogglePin: () => void;
  onToggleExpand: () => void;
  onToggleDrawer: () => void;
  onDismiss: () => void;
  onActionClick?: (actionId: string) => void;
  onEggStart?: () => void;
  onOpenFishing?: () => void;
  onOpenMedia?: () => void;
  hasMedia?: boolean;
}

// Lightweight spring - settles fast, no lingering micro-movements
const pillSpring = { type: 'spring' as const, stiffness: 380, damping: 32, mass: 0.8 };

export const PrimaryPill: React.FC<PrimaryPillProps> = ({
  activity,
  isExpanded,
  isPinned,
  queuedCount,
  isEggTimer = false,
  isFishing = false,
  onTogglePin,
  onToggleExpand,
  onToggleDrawer,
  onDismiss,
  onActionClick,
  onEggStart,
  onOpenFishing,
  onOpenMedia,
  hasMedia,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { status: eggStatus, dismissAlert: dismissEggAlert, startTimer: startEggTimer } = useEggTimerStore();
  const { tasks, activeAlertTaskId } = useShiftScheduleStore();

  const isFishingStoreActive = useFishingStore((s) => s.isFishingActive);
  const activeSubTab = useFishingStore((s) => s.activeSubTab);
  const isLibraryEnlarged = useFishingStore((s) => s.isLibraryEnlarged);
  const islandCustomization = useFishingStore((s) => s.islandCustomization);
  const fishingSettings = useFishingStore((s) => s.settings);

  const isEggAlert = eggStatus === 'alert';
  const alertShiftTask = tasks.find((t) => t.id === activeAlertTaskId || (t.enabled && t.status === 'alert'));
  const isShiftAlert = !!alertShiftTask;

  const { is30sWarning, hasUnfinishedAlert } = getNextTaskInfo(tasks);
  const isShiftYellow = is30sWarning || hasUnfinishedAlert;

  // Determine what Primary Pill is rendering
  const showShiftAlert = isShiftAlert && alertShiftTask;
  const showEggExpanded = !showShiftAlert && (isEggTimer || isEggAlert || (!activity && eggStatus === 'running'));
  const isEggRunning = eggStatus === 'running';

  const handleClick = (e: React.MouseEvent) => {
    if (isEggAlert) {
      e.stopPropagation();
      dismissEggAlert();
      if (isExpanded) onToggleExpand();
      return;
    }

    if (!isExpanded) {
      e.stopPropagation();
      if (isFishing) {
        onToggleExpand();
      } else if (!activity && !isEggRunning && !isEggAlert && !showShiftAlert) {
        // Idle state: clicking opens Queue Drawer
        onToggleDrawer();
      } else {
        onToggleExpand();
      }
    }
  };

  // Compute dimensions
  let targetWidth = 400;
  let targetHeight = 170;

  if (isFishing) {
    if (activeSubTab === 'library' && isLibraryEnlarged) {
      targetWidth = 630;
      targetHeight = 520;
    } else if (activeSubTab !== 'fishing') {
      targetWidth = 420;
      targetHeight = 400;
    } else {
      targetWidth = 420;
      targetHeight = 340;
    }
  }

  // Compute compact width
  let compactWidth = 240;
  if (isFishing) {
    compactWidth = 260;
  } else if (!activity && !isEggRunning) {
    compactWidth = 270; // Fit Egg slot + Shift Countdown
  } else if (showEggExpanded && isEggRunning) {
    compactWidth = 200;
  }

  // Animation / Glow styling
  let glowClass = '';
  if (isShiftAlert) {
    glowClass = 'animate-yellow-pulse-3';
  } else if (isEggAlert) {
    glowClass = 'animate-pill-glow';
  }

  const activeColorObj = ISLAND_COLORS.find((c) => c.id === islandCustomization.activeColorId);
  const activeBg = activeColorObj?.colorValue || islandColors.bg;

  let effectShadow: string | undefined = undefined;
  if (islandCustomization.activeEffectId === 'effect_glow_light') {
    effectShadow = '0 0 20px rgba(56, 189, 248, 0.4)';
  } else if (islandCustomization.activeEffectId === 'effect_glow_strong') {
    effectShadow = '0 0 35px rgba(56, 189, 248, 0.8)';
  } else if (islandCustomization.activeEffectId === 'effect_aurora') {
    effectShadow = '0 0 40px rgba(168, 85, 247, 0.7), 0 0 80px rgba(56, 189, 248, 0.4)';
  }

  return (
    <motion.div
      ref={containerRef}
      data-testid="primary-pill"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        width: isExpanded ? targetWidth : compactWidth,
        height: isExpanded ? targetHeight : 37,
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
        background: isShiftYellow && !isExpanded ? 'rgba(30, 24, 8, 0.95)' : activeBg,
        border: isShiftYellow && !isExpanded ? '1px solid rgba(255, 214, 10, 0.35)' : undefined,
        boxShadow: isEggAlert || isShiftAlert
          ? undefined
          : effectShadow ||
            (isExpanded
              ? '0 20px 40px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)'
              : islandColors.shadow),
        willChange: 'transform',
      }}
      className={`shrink-0 relative overflow-hidden select-none cursor-pointer ${glowClass}`}
      onClick={handleClick}
      onDoubleClick={(e) => {
        if (!isEggAlert && !isShiftAlert) {
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
        {/* Case 0: Fishing Game in Primary */}
        {isFishing ? (
          <FishingCompact onClick={onToggleExpand} />
        ) : isEggTimer && isEggRunning ? (
          <EggTimerCompact
            onStart={() => {
              if (onEggStart) onEggStart();
              else if (!isExpanded) onToggleExpand();
            }}
          />
        ) : activity ? (
          /* Case 2: Regular Activity (e.g. Spotify) with Egg Quick Action in left slot */
          <>
            <div className="flex items-center gap-2 min-w-0">
              {eggStatus === 'idle' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEggTimer();
                    onEggStart?.();
                  }}
                  title="Luộc trứng (15 phút)"
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all cursor-pointer shrink-0"
                >
                  <EggIcon size={12} className="stroke-[1.5]" />
                </button>
              )}

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
                className="truncate max-w-[130px] leading-none"
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
        ) : (
          /* Case 3: Idle Dynamic Island (Left: Egg Starter & optional Fish Starter, Right: Shift Countdown) */
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 shrink-0 mr-1">
              {/* Slot bên trái: Icon Quả trứng (click để luộc 15p) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startEggTimer();
                  onEggStart?.();
                }}
                title="Click để bắt đầu luộc trứng 15 phút"
                className="w-5 h-5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all cursor-pointer shrink-0"
              >
                <EggIcon size={13} className="stroke-[1.5]" />
              </button>

              {/* Optional Fish Starter icon if enabled */}
              {fishingSettings.showFishIconOnPill && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenFishing?.();
                  }}
                  title="Click để mở Mini-Game Câu Cá (Alt+F)"
                  className="w-5 h-5 rounded-full flex items-center justify-center text-sky-400/70 hover:text-sky-300 hover:bg-white/15 transition-all cursor-pointer shrink-0"
                >
                  <IconRenderer name="Fish" className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Slot chính: Đồng hồ nhắc nhở khung giờ di chuyển (click mở Queue Drawer) */}
            <div className="flex-1 min-w-0 flex items-center justify-between">
              <ShiftCompact onOpenDrawer={onToggleDrawer} />

              {/* 6px Blue dot indicator when fishing is running idle in background */}
              {isFishingStoreActive && (
                <span
                  title="Mini-Game Câu Cá đang chạy idle ngầm"
                  className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)] shrink-0 ml-1"
                />
              )}
            </div>
          </div>
        )}
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
        {/* Priority 0: Fishing Game Expanded */}
        {isFishing ? (
          <FishingExpanded
            onCollapse={onToggleExpand}
            onOpenMedia={onOpenMedia}
            hasMedia={hasMedia}
          />
        ) : showShiftAlert ? (
          <ShiftExpanded task={alertShiftTask} onCollapse={onToggleExpand} />
        ) : showEggExpanded ? (
          /* Priority 2: Egg Timer Expanded */
          <EggTimerExpanded onDismiss={onToggleExpand} />
        ) : activity ? (
          /* Priority 3: Regular Activity Expanded */
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
