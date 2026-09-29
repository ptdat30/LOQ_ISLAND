import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Activity } from '../../types/activity';
import { useShiftScheduleStore } from '../../stores/shiftScheduleStore';
import { Check, ChevronRight, ChevronDown, X, Trash2, CheckCircle2, BellRing, Clock } from 'lucide-react';

interface QueueDrawerProps {
  isOpen: boolean;
  activities: Activity[];
  activeId?: string;
  onSelect: (index: number) => void;
  onDismiss: (id: string) => void;
  onClose: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { tasks, markDone, deleteTask, testTriggerNow, createRealtimeTestTask } = useShiftScheduleStore();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-40 pointer-events-auto flex flex-col items-center pt-14"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="w-[430px] max-h-[440px] bg-black/95 border border-white/15 backdrop-blur-2xl rounded-[20px] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col text-white select-none overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 shrink-0">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                LỊCH LÀM VIỆC HÔM NAY
              </span>
              <span className="text-[10px] text-white/40">Vuốt phải: Đã xong • Vuốt trái: Xóa</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>

          {/* Quick 1-click test buttons */}
          <div className="grid grid-cols-2 gap-2 mb-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                testTriggerNow();
                onClose();
              }}
              className="py-1.5 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <BellRing size={13} strokeWidth={2} />
              <span>⚡ Thử Alert ngay</span>
            </button>
            <button
              type="button"
              onClick={() => {
                createRealtimeTestTask(1);
                onClose();
              }}
              className="py-1.5 px-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Clock size={13} strokeWidth={2} />
              <span>⏰ Đặt task 1 phút nữa (Test)</span>
            </button>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs">
            {tasks.map((task) => {
              const isDone = task.status === 'done';
              const isAlert = task.status === 'alert' || task.status === 'warning';
              const isExpanded = expandedTaskId === task.id;

              return (
                <div key={task.id} className="relative overflow-hidden rounded-xl">
                  {/* Swipeable container */}
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: -70, right: 70 }}
                    dragElastic={0.15}
                    onDragEnd={(_e, info) => {
                      if (info.offset.x > 50) {
                        markDone(task.id);
                      } else if (info.offset.x < -50) {
                        deleteTask(task.id);
                      }
                    }}
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                    className={`flex flex-col p-2.5 rounded-xl cursor-pointer border transition-colors ${
                      isDone
                        ? 'bg-white/[0.02] border-white/5 text-white/40'
                        : isAlert
                        ? 'bg-amber-500/10 border-amber-500/30 text-white'
                        : 'bg-white/5 hover:bg-white/10 border-transparent text-white/90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      {/* Status Icon */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="shrink-0 flex items-center justify-center">
                          {isDone ? (
                            <div className="w-4 h-4 rounded-full bg-[#30D158]/20 text-[#30D158] flex items-center justify-center">
                              <Check size={11} strokeWidth={2.5} />
                            </div>
                          ) : isAlert ? (
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-white/25" />
                          )}
                        </div>

                        {/* Time */}
                        <span className={`font-semibold shrink-0 ${isAlert ? 'text-amber-300' : isDone ? 'text-white/40' : 'text-white'}`}>
                          {task.time}
                        </span>

                        {/* Description */}
                        <span className={`truncate text-xs ${isDone ? 'line-through text-white/35' : 'text-white/80'}`}>
                          {task.title}
                          {task.subtitle ? ` — ${task.subtitle}` : ''}
                        </span>
                      </div>

                      {/* Chevron */}
                      <div className="shrink-0 text-white/40 flex items-center gap-1">
                        {isExpanded ? (
                          <ChevronDown size={14} strokeWidth={1.5} />
                        ) : (
                          <ChevronRight size={14} strokeWidth={1.5} />
                        )}
                      </div>
                    </div>

                    {/* Expanded Task Details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2 mt-2 border-t border-white/10 text-[11px] text-white/70 space-y-2"
                      >
                        <p className="leading-relaxed text-white/90">{task.rawDescription}</p>
                        <div className="flex items-center gap-2 pt-1">
                          {!isDone && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                markDone(task.id);
                              }}
                              className="py-1 px-2.5 rounded-lg bg-[#30D158]/20 hover:bg-[#30D158]/30 text-[#30D158] font-medium flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 size={12} strokeWidth={2} /> Đã xong
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              testTriggerNow(task.id);
                              onClose();
                            }}
                            className="py-1 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium transition-colors"
                          >
                            Trigger Alert Ngay
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.id);
                            }}
                            className="py-1 px-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors ml-auto"
                          >
                            <Trash2 size={12} strokeWidth={1.5} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
