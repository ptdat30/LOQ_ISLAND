import React from 'react';
import { EggIcon } from './EggIcon';
import { EggProgressRing } from './EggProgressRing';
import {
  useEggTimerStore,
  formatEggTimer,
  getEggProgress,
  getEggProgressColor,
} from '../../../stores/eggTimerStore';

interface EggTimerCompactProps {
  onStart: () => void;
}

export const EggTimerCompact: React.FC<EggTimerCompactProps> = ({ onStart }) => {
  const { status, remainingMs, durationMs, startTimer } = useEggTimerStore();

  const isAlert = status === 'alert';
  const progress = getEggProgress(remainingMs, durationMs, status);
  const color = getEggProgressColor(remainingMs, status);
  const isUrgent = status === 'running' && remainingMs < 60 * 1000;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === 'idle') {
      startTimer();
      onStart();
    }
  };

  // ─── IDLE STATE: "Luộc trứng" Invitation ───
  if (status === 'idle') {
    return (
      <div
        onClick={handleClick}
        className="group flex items-center gap-2 px-1 py-1 rounded-full cursor-pointer transition-opacity duration-150 hover:opacity-100"
      >
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
          <EggIcon size={14} className="stroke-[1.5]" />
        </div>
        <span
          className="text-white/60 group-hover:text-white/90 transition-colors leading-none"
          style={{ fontSize: 13, fontWeight: 590, letterSpacing: -0.08 }}
        >
          Luộc trứng
        </span>
      </div>
    );
  }

  // ─── RUNNING OR ALERT COMPACT STATE ───
  return (
    <div className="flex items-center justify-between w-full px-1">
      {/* Left: Egg with Mini Progress Ring */}
      <div className="flex items-center gap-2">
        <EggProgressRing
          size={20}
          strokeWidth={1.5}
          progress={progress}
          color={color}
        >
          <div className={isAlert ? 'animate-egg-blink' : ''}>
            <EggIcon
              size={12}
              className={isAlert ? 'text-white' : ''}
              style={{ color: isAlert ? '#ffffff' : color }}
            />
          </div>
        </EggProgressRing>
      </div>

      {/* Right: Tabular MM:SS */}
      <div className="flex items-center">
        <span
          className={`tabular-nums leading-none ${
            isAlert
              ? 'text-white font-semibold'
              : isUrgent
              ? 'text-[#FF453A] animate-urgent-pulse font-semibold'
              : 'text-white font-semibold'
          }`}
          style={{ fontSize: 14, fontWeight: 590, letterSpacing: -0.1 }}
        >
          {isAlert ? '00:00' : formatEggTimer(remainingMs)}
        </span>
      </div>
    </div>
  );
};
