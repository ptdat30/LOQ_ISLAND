import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pin,
  PinOff,
  Settings,
  Layers,
  Power,
  Trash2,
  Egg,
  Fish,
  BookOpen,
} from 'lucide-react';
import { useEggTimerStore } from '../../stores/eggTimerStore';
import { useFishingStore } from '../../features/fishing/stores/fishingStore';

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  isPinned: boolean;
  onTogglePin: () => void;
  onOpenSettings: () => void;
  onOpenDrawer: () => void;
  onOpenFishing?: () => void;
  onClearAll: () => void;
  onQuit: () => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  isPinned,
  onTogglePin,
  onOpenSettings,
  onOpenDrawer,
  onOpenFishing,
  onClearAll,
  onQuit,
  onClose,
}) => {
  const { status: eggStatus, startTimer, cancelTimer, dismissAlert: dismissEggAlert } = useEggTimerStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 pointer-events-auto"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -4 }}
          transition={{ duration: 0.14 }}
          style={{ top: position.y, left: position.x }}
          onClick={(e) => e.stopPropagation()}
          className="absolute w-64 bg-black/95 border border-white/20 backdrop-blur-2xl rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-white select-none text-xs space-y-0.5 whitespace-nowrap"
        >
          {/* ─── EGG TIMER ACTION ─── */}
          <button
            type="button"
            onClick={() => {
              if (eggStatus === 'idle') {
                startTimer();
              } else if (eggStatus === 'alert') {
                dismissEggAlert();
              } else {
                cancelTimer();
              }
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          >
            <Egg className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
            <span>
              {eggStatus === 'idle'
                ? 'Bắt đầu luộc trứng (15p)'
                : eggStatus === 'alert'
                ? 'Tắt báo hiệu luộc trứng'
                : 'Hủy hẹn giờ luộc trứng'}
            </span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            type="button"
            onClick={() => {
              onOpenDrawer();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          >
            <Layers className="w-4 h-4 text-sky-400" strokeWidth={1.5} />
            <span>Xem lịch hôm nay</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onTogglePin();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          >
            {isPinned ? <PinOff className="w-4 h-4 text-sky-400" strokeWidth={1.5} /> : <Pin className="w-4 h-4 text-white/70" strokeWidth={1.5} />}
            <span>{isPinned ? 'Bỏ ghim mở rộng' : 'Ghim mở rộng'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 text-white/70" strokeWidth={1.5} />
            <span>Cài đặt</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenFishing?.();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 transition-colors cursor-pointer"
          >
            <Fish className="w-4 h-4 text-sky-400" strokeWidth={1.5} />
            <span>Mini-Game Câu Cá (Alt+F)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenFishing?.();
              useFishingStore.getState().setActiveSubTab('library');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-sky-400" strokeWidth={1.5} />
            <span>Thư Viện Cá (Alt+L)</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            type="button"
            onClick={() => {
              onClearAll();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white/60" strokeWidth={1.5} />
            <span>Xóa tất cả hoạt động</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onQuit();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition-colors"
          >
            <Power className="w-4 h-4 text-rose-400" strokeWidth={1.5} />
            <span>Thoát Dynamic Island</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
