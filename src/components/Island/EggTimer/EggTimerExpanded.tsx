import React from 'react';
import { X } from 'lucide-react';
import { EggIcon } from './EggIcon';
import { EggProgressRing } from './EggProgressRing';
import {
  useEggTimerStore,
  formatEggTimer,
  getEggProgress,
  getEggProgressColor,
} from '../../../stores/eggTimerStore';

interface EggTimerExpandedProps {
  onDismiss: () => void;
}

export const EggTimerExpanded: React.FC<EggTimerExpandedProps> = ({ onDismiss }) => {
  const { status, remainingMs, durationMs, cancelTimer, dismissAlert } = useEggTimerStore();

  const isAlert = status === 'alert';
  const progress = getEggProgress(remainingMs, durationMs, status);
  const color = getEggProgressColor(remainingMs, status);
  const isUrgent = status === 'running' && remainingMs < 60 * 1000;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAlert) {
      dismissAlert();
    } else {
      cancelTimer();
    }
    onDismiss();
  };

  return (
    <div className="w-full h-full flex items-center justify-between px-6 py-4 select-none">
      {/* ─── LEFT: Progress Ring + Centered Egg ─── */}
      <div className="flex items-center gap-3 shrink-0">
        <EggProgressRing
          size={52}
          strokeWidth={2}
          progress={progress}
          color={color}
        >
          <div className={isAlert ? 'animate-egg-blink' : ''}>
            <EggIcon
              size={22}
              className={isAlert ? 'text-white' : ''}
              style={{ color: isAlert ? '#ffffff' : color }}
            />
          </div>
        </EggProgressRing>
      </div>

      {/* ─── CENTER: Countdown MM:SS + Subtitle ─── */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <span
          className={`font-semibold tabular-nums tracking-tight ${
            isUrgent ? 'text-[#FF453A] animate-urgent-pulse' : 'text-white'
          }`}
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: -0.5,
            lineHeight: 1.1,
          }}
        >
          {isAlert ? '00:00' : formatEggTimer(remainingMs)}
        </span>
        <span
          className="mt-1 text-xs text-white/60 tracking-normal"
          style={{ fontSize: 13, fontWeight: 400 }}
        >
          {isAlert ? 'Trứng đã chín!' : 'Luộc trứng'}
        </span>
      </div>

      {/* ─── RIGHT: Cancel [X] Button ─── */}
      <div className="flex items-center justify-end shrink-0">
        <button
          type="button"
          onClick={handleClose}
          title={isAlert ? 'Tắt báo hiệu' : 'Hủy hẹn giờ'}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};
