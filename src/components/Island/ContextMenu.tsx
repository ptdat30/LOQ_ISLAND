import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pin,
  PinOff,
  Settings,
  Layers,
  Sparkles,
  Power,
  Trash2,
} from 'lucide-react';

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  isPinned: boolean;
  onTogglePin: () => void;
  onOpenSettings: () => void;
  onOpenDrawer: () => void;
  onOpenSimulator: () => void;
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
  onOpenSimulator,
  onClearAll,
  onQuit,
  onClose,
}) => {
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
          className="absolute w-52 bg-black/95 border border-white/20 backdrop-blur-2xl rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-white select-none text-xs space-y-0.5"
        >
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
              onOpenDrawer();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          >
            <Layers className="w-4 h-4 text-sky-400" strokeWidth={1.5} />
            <span>Hàng đợi hoạt động</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenSimulator();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
            <span>Bộ giả lập (Mock Simulator)</span>
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
