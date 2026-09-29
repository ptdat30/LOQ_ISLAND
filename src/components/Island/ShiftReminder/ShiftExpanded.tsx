import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShiftTaskIcon } from './ShiftTaskIcon';
import type { ScheduleTask } from '../../../types/shiftSchedule';
import { useShiftScheduleStore } from '../../../stores/shiftScheduleStore';
import { Check, Clock, X } from 'lucide-react';

interface ShiftExpandedProps {
  task: ScheduleTask;
  onCollapse: () => void;
}

export const ShiftExpanded: React.FC<ShiftExpandedProps> = ({ task, onCollapse }) => {
  const { markDone, snooze, feedbackMessage, dismissAlert } = useShiftScheduleStore();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleDone = () => {
    setIsFinishing(true);
    markDone(task.id);
    setTimeout(() => {
      onCollapse();
    }, 2000);
  };

  const handleSnooze = () => {
    snooze(task.id, 5);
    onCollapse();
  };

  const handleClose = () => {
    dismissAlert(task.id);
    onCollapse();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 select-none relative">
      {/* Top right dismiss button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-3 right-3 p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors z-20"
      >
        <X size={14} strokeWidth={1.5} />
      </button>

      <AnimatePresence mode="wait">
        {feedbackMessage ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col items-center justify-center text-center gap-1.5"
          >
            <div className="w-8 h-8 rounded-full bg-[#30D158]/20 text-[#30D158] flex items-center justify-center">
              <Check size={18} strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">{feedbackMessage}</span>
          </motion.div>
        ) : (
          <motion.div
            key="task-content"
            initial={{ opacity: 1 }}
            animate={{
              opacity: isFinishing ? 0 : 1,
              y: isFinishing ? -8 : 0,
            }}
            transition={{ duration: 0.15 }}
            className="flex flex-col justify-between h-full"
          >
            {/* Header: Icon + Titles */}
            <div className="flex items-start gap-3.5 pr-6">
              {/* Task Icon ~32px */}
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <ShiftTaskIcon taskTitle={task.title} size={26} />
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase">
                    {task.time}
                  </span>
                  <span className="text-[11px] text-white/40">• KHUNG GIỜ LÀM VIỆC</span>
                </div>
                <h3
                  className="font-semibold uppercase tracking-tight text-white truncate max-w-[280px] mt-0.5"
                  style={{ fontSize: 17, lineHeight: 1.25 }}
                >
                  {task.title}
                </h3>
                {task.subtitle && (
                  <p
                    className="text-white/70 line-clamp-2 mt-1 leading-snug"
                    style={{ fontSize: 13 }}
                  >
                    {task.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions: "Đã xong" & "Nhắc lại 5 phút" */}
            <div className="flex items-center gap-2.5 pt-2">
              {/* Đã xong Button (#30D158) */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={handleDone}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-[#30D158] hover:bg-[#30D158]/90 text-black font-semibold text-xs flex items-center justify-center gap-1.5 shadow-[0_2px_12px_rgba(48,209,88,0.25)] cursor-pointer transition-colors"
              >
                <Check size={15} strokeWidth={2.5} />
                <span>Đã xong</span>
              </motion.button>

              {/* Nhắc lại 5 phút Button */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={handleSnooze}
                className="py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Clock size={14} strokeWidth={1.5} />
                <span>Nhắc lại 5 phút</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
