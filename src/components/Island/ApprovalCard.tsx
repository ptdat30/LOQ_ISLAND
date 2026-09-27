import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Check, X } from 'lucide-react';

interface ApprovalCardProps {
  request: {
    approvalId: string;
    pluginId: string;
    name: string;
  };
  onRespond: (approved: boolean) => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ request, onRespond }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="w-[360px] bg-black/90 border border-sky-500/30 backdrop-blur-2xl rounded-2xl p-3.5 shadow-2xl z-50 text-white select-none"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-white/95 truncate">Yêu cầu quyền hiển thị</h4>
            <span className="text-[10px] text-white/50 font-mono">Plugin</span>
          </div>
          <p className="text-xs text-white/70 mt-0.5">
            <strong className="text-sky-300 font-semibold">{request.name}</strong> muốn gửi Live Activity lên Dynamic Island.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => onRespond(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium transition-colors shadow-md"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Cho phép</span>
            </button>
            <button
              type="button"
              onClick={() => onRespond(false)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Từ chối</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
