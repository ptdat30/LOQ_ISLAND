import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Activity } from '../../types/activity';
import { IconRenderer } from './IconRenderer';
import { X, Layers, ArrowUpRight } from 'lucide-react';

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
  activities,
  activeId,
  onSelect,
  onDismiss,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-[380px] max-h-[280px] bg-black/90 border border-white/15 backdrop-blur-2xl rounded-2xl p-3 shadow-2xl z-40 flex flex-col text-white select-none mt-2"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <Layers className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
            <span>Hàng đợi hoạt động ({activities.length})</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {activities.map((act, index) => {
            const isActive = act.id === activeId;
            return (
              <div
                key={act.id}
                onClick={() => onSelect(index)}
                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? 'bg-sky-500/20 border border-sky-500/40 text-white'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent text-white/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <IconRenderer name={act.icon} className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="truncate">
                    <h5 className="text-xs font-medium truncate">{act.title}</h5>
                    <p className="text-[10px] text-white/50 truncate">{act.app}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isActive ? (
                    <span className="text-[10px] font-medium bg-sky-400/20 text-sky-300 px-2 py-0.5 rounded-full">
                      Đang phát
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(index);
                      }}
                      className="p-1 rounded-md text-white/40 hover:text-sky-300 hover:bg-white/10 transition-colors"
                      title="Chuyển lên chính"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(act.id);
                    }}
                    className="p-1 rounded-md text-white/40 hover:text-rose-400 hover:bg-white/10 transition-colors"
                    title="Xóa"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
