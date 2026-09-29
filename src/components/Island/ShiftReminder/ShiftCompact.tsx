import React from 'react';
import { Clock } from 'lucide-react';
import { useShiftScheduleStore, getNextTaskInfo } from '../../../stores/shiftScheduleStore';

interface ShiftCompactProps {
  onOpenDrawer: () => void;
}

export const ShiftCompact: React.FC<ShiftCompactProps> = ({ onOpenDrawer }) => {
  const { tasks, feedbackMessage } = useShiftScheduleStore();
  const { task, minutesRemaining, is30sWarning, hasUnfinishedAlert } = getNextTaskInfo(tasks);

  const isYellow = is30sWarning || hasUnfinishedAlert;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDrawer();
  };

  // Temporary feedback message after clicking "Đã xong"
  if (feedbackMessage) {
    return (
      <div
        onClick={handleClick}
        className="flex items-center justify-center w-full px-2 text-white font-medium text-[13px] animate-pulse cursor-pointer"
      >
        <span>{feedbackMessage}</span>
      </div>
    );
  }

  // If all tasks are completed
  if (!task) {
    return (
      <div
        onClick={handleClick}
        className="flex items-center justify-between w-full px-2 cursor-pointer hover:opacity-100 transition-opacity"
      >
        <div className="flex items-center gap-1.5 text-white/50">
          <Clock size={14} strokeWidth={1.5} />
          <span className="text-[13px] font-medium text-white/60">Hết lịch hôm nay</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between w-full px-1 cursor-pointer transition-colors duration-200"
    >
      {/* Left: Clock Icon + Countdown */}
      <div className="flex items-center gap-1.5 min-w-0">
        <Clock
          size={14}
          strokeWidth={1.5}
          className={`shrink-0 transition-colors ${isYellow ? 'text-amber-400' : 'text-white/80'}`}
        />
        <span
          className={`text-[13px] whitespace-nowrap transition-colors ${
            isYellow ? 'text-amber-300 font-semibold' : 'text-white/60 font-medium'
          }`}
        >
          {is30sWarning ? 'Còn 30 giây' : `Còn ${minutesRemaining} phút`}
        </span>
        <span className="text-white/30 text-xs px-0.5">—</span>
      </div>

      {/* Right: Task Name */}
      <div className="min-w-0 pl-1 flex items-center justify-end">
        <span
          className={`truncate text-[13px] font-semibold tracking-tight transition-colors max-w-[120px] ${
            isYellow ? 'text-amber-200' : 'text-white'
          }`}
        >
          {task.title}
        </span>
      </div>
    </div>
  );
};
