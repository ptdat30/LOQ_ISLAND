import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_ACTIVITIES } from '../../providers/mockSimulator';
import { useActivityStore } from '../../stores/activityStore';
import { useEggTimerStore } from '../../stores/eggTimerStore';
import { useShiftScheduleStore } from '../../stores/shiftScheduleStore';
import { Sparkles, X, PlusCircle, Trash2, Layers, Egg, BellRing, FastForward, RotateCcw, Calendar, AlertCircle } from 'lucide-react';

interface SimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulatorDrawer: React.FC<SimulatorDrawerProps> = ({ isOpen, onClose }) => {
  const { addOrUpdateActivity, clearActivities } = useActivityStore();
  const { startTimer, cancelTimer, fastForwardTo, status: eggStatus } = useEggTimerStore();
  const { tasks, testTriggerNow, testWarningNow, resetAllToPending } = useShiftScheduleStore();

  if (!isOpen) return null;

  const handleInject = (key: keyof typeof MOCK_ACTIVITIES) => {
    const generator = MOCK_ACTIVITIES[key];
    if (generator) {
      addOrUpdateActivity(generator());
    }
  };

  const handleInjectAllMulti = () => {
    addOrUpdateActivity(MOCK_ACTIVITIES.spotify());
    setTimeout(() => addOrUpdateActivity(MOCK_ACTIVITIES.pomodoro()), 80);
    setTimeout(() => addOrUpdateActivity(MOCK_ACTIVITIES.download()), 160);
    setTimeout(() => addOrUpdateActivity(MOCK_ACTIVITIES.grabFood()), 240);
  };

  const firstPendingTask = tasks.find((t) => t.enabled && t.status !== 'done') || tasks[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-[430px] max-h-[500px] bg-black/95 border border-amber-500/25 backdrop-blur-2xl rounded-3xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-50 flex flex-col text-white select-none mt-2 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Live Activities & Shift Simulator</h3>
              <p className="text-[11px] text-white/50">Thử nghiệm các hoạt động theo thời gian thực</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* ─── SHIFT REMINDER TESTING CONTROLS ─── */}
        <div className="mb-2.5 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
              Nhắc nhở di chuyển: {firstPendingTask ? `${firstPendingTask.time} - ${firstPendingTask.title}` : 'Đã xong hết'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => {
                if (firstPendingTask) {
                  testTriggerNow(firstPendingTask.id);
                  onClose();
                }
              }}
              className="py-1.5 px-2 rounded-xl bg-amber-400 text-black font-semibold flex items-center justify-center gap-1 hover:bg-amber-300 transition-all cursor-pointer"
            >
              <BellRing className="w-3 h-3" strokeWidth={2} /> Trigger Alert Giờ Này
            </button>
            <button
              type="button"
              onClick={() => {
                if (firstPendingTask) {
                  testWarningNow(firstPendingTask.id);
                  onClose();
                }
              }}
              className="py-1.5 px-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <AlertCircle className="w-3 h-3" strokeWidth={1.5} /> Cảnh Báo 30s
            </button>
            <button
              type="button"
              onClick={resetAllToPending}
              className="py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 font-medium flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={1.5} /> Reset Pending
            </button>
          </div>
        </div>

        {/* ─── EGG TIMER TESTING CONTROLS ─── */}
        <div className="mb-2.5 p-2 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-white/90">
              <Egg className="w-3.5 h-3.5 text-amber-300" strokeWidth={1.5} />
              Luộc trứng: <span className="uppercase text-amber-400 font-semibold">{eggStatus}</span>
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[11px]">
            <button
              type="button"
              onClick={startTimer}
              className="py-1.5 px-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center justify-center gap-1 transition-all"
            >
              <Egg className="w-3 h-3" strokeWidth={1.5} /> Bắt đầu
            </button>
            <button
              type="button"
              onClick={() => fastForwardTo(5000)}
              className="py-1.5 px-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium flex items-center justify-center gap-1 transition-all"
            >
              <FastForward className="w-3 h-3" strokeWidth={1.5} /> Còn 5s
            </button>
            <button
              type="button"
              onClick={() => fastForwardTo(0)}
              className="py-1.5 px-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-medium flex items-center justify-center gap-1 transition-all"
            >
              <BellRing className="w-3 h-3" strokeWidth={1.5} /> Alert 0s
            </button>
            <button
              type="button"
              onClick={cancelTimer}
              className="py-1.5 px-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 font-medium flex items-center justify-center gap-1 transition-all"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={1.5} /> Reset
            </button>
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2 mb-2 shrink-0">
          <button
            type="button"
            onClick={handleInjectAllMulti}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-sky-500/20 hover:from-amber-500/30 hover:to-sky-500/30 border border-white/10 text-white text-xs font-medium transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" strokeWidth={1.5} />
            <span>Kích hoạt 4 Activities (Đa Slot)</span>
          </button>
          <button
            type="button"
            onClick={clearActivities}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 border border-white/10 transition-colors"
            title="Xóa hết hoạt động"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Activities List to Inject */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-xs">
          {[
            { key: 'spotify', title: 'Spotify Music', subtitle: 'Blinding Lights — The Weeknd', icon: '🎵' },
            { key: 'pomodoro', title: 'Focus Pomodoro', subtitle: 'Deep Work Session (25 min)', icon: '⏱️' },
            { key: 'download', title: 'Steam Download', subtitle: 'Cyberpunk 2077 Update (45.2 MB/s)', icon: '⬇️' },
            { key: 'grabFood', title: 'GrabFood Delivery', subtitle: 'Tài xế đang giao Phúc Long (6 mins)', icon: '🛵' },
            { key: 'flight', title: 'Flighty Flight Tracker', subtitle: 'VN230 SGN ✈️ HAN (FL360)', icon: '✈️' },
            { key: 'sports', title: 'Live Sports Score', subtitle: 'Arsenal 2 - 1 Chelsea (78\')', icon: '🏆' },
            { key: 'github', title: 'GitHub Actions Build', subtitle: 'Build & Deploy Production #482', icon: '🐙' },
            { key: 'system', title: 'System Resource Monitor', subtitle: 'CPU 24% • RAM 58% • Net Traffic', icon: '📊' },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => handleInject(item.key as keyof typeof MOCK_ACTIVITIES)}
              className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{item.icon}</span>
                <div>
                  <h5 className="font-medium text-white/90 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h5>
                  <p className="text-[10px] text-white/50">{item.subtitle}</p>
                </div>
              </div>
              <PlusCircle className="w-4 h-4 text-white/40 group-hover:text-amber-300 transition-colors shrink-0" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
