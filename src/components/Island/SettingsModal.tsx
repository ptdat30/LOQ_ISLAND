import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../stores/settingsStore';
import { useShiftScheduleStore } from '../../stores/shiftScheduleStore';
import {
  Settings,
  X,
  Monitor,
  Palette,
  Calendar,
  Bell,
  Plus,
  Trash2,
  FileCode,
  Check,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, displays, updateSettings, setDisplay } = useSettingsStore();
  const {
    tasks,
    settings: notifSettings,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskEnabled,
    importFromJSON,
    updateSettings: updateNotifSettings,
  } = useShiftScheduleStore();

  const [activeTab, setActiveTab] = useState<'schedule' | 'notifications' | 'general'>('schedule');
  const [jsonInput, setJsonInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // New task form state
  const [newTime, setNewTime] = useState('14:30');
  const [newDesc, setNewDesc] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newDesc.trim()) return;
    addTask(newTime, newDesc.trim());
    setNewDesc('');
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;
    const ok = importFromJSON(jsonInput);
    if (ok) {
      setImportSuccess(true);
      setTimeout(() => {
        setIsImporting(false);
        setImportSuccess(false);
        setJsonInput('');
      }, 1200);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-[460px] max-h-[500px] bg-black/95 border border-white/20 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 flex flex-col text-white select-none mt-2 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Cài đặt Dynamic Island</h3>
              <p className="text-[11px] text-white/50">Quản lý lịch di chuyển & thông báo</p>
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl mb-3 shrink-0 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'schedule'
                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Calendar size={13} strokeWidth={1.5} />
            <span>Lịch làm việc</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'notifications'
                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Bell size={13} strokeWidth={1.5} />
            <span>Thông báo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'general'
                ? 'bg-sky-500/20 text-sky-300 font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Settings size={13} strokeWidth={1.5} />
            <span>Chung</span>
          </button>
        </div>

        {/* Tab 1: Lịch làm việc */}
        {activeTab === 'schedule' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            {isImporting ? (
              <div className="space-y-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-semibold text-white/90">Import lịch từ JSON:</span>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='[{"time": "14:30", "raw": "Dọn nhà vệ sinh..."}, ...]'
                  className="w-full h-32 bg-black/60 border border-white/15 rounded-xl p-2.5 font-mono text-[11px] text-white/90 outline-none focus:border-amber-400"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleImport}
                    className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {importSuccess ? <Check size={14} /> : <FileCode size={14} />}
                    <span>{importSuccess ? 'Đã import thành công!' : 'Xác nhận Import'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsImporting(false)}
                    className="py-1.5 px-3 rounded-xl bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/5 hover:border-white/15 transition-all"
                  >
                    {/* Enable Toggle */}
                    <input
                      type="checkbox"
                      checked={task.enabled}
                      onChange={() => toggleTaskEnabled(task.id)}
                      className="accent-amber-400 w-3.5 h-3.5 cursor-pointer shrink-0"
                    />

                    {/* Time Picker */}
                    <input
                      type="time"
                      value={task.time}
                      onChange={(e) => updateTask(task.id, { time: e.target.value })}
                      className="bg-white/10 border border-white/15 rounded-lg px-2 py-1 text-white font-mono text-xs outline-none focus:border-amber-400 shrink-0 cursor-pointer"
                    />

                    {/* Task Description */}
                    <input
                      type="text"
                      value={task.rawDescription}
                      onChange={(e) => updateTask(task.id, { rawDescription: e.target.value })}
                      className="flex-1 min-w-0 bg-transparent px-1.5 py-1 text-white/90 text-xs outline-none focus:bg-white/5 rounded-lg"
                    />

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}

                {/* Add New Task Row */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-3">
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white font-mono text-xs outline-none focus:border-amber-400 shrink-0"
                  />
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Mô tả công việc (vd: Dọn nhà vệ sinh, kiểm phòng)..."
                    className="flex-1 min-w-0 bg-black/40 border border-white/15 px-2.5 py-1 text-white text-xs outline-none focus:border-amber-400 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="py-1.5 px-3 rounded-lg bg-amber-400 text-black font-semibold flex items-center gap-1 hover:bg-amber-300 transition-colors shrink-0"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    <span>Thêm</span>
                  </button>
                </div>

                {/* Import JSON button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsImporting(true)}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white flex items-center justify-center gap-1.5 transition-colors text-xs"
                  >
                    <FileCode size={13} strokeWidth={1.5} />
                    <span>Import lịch từ JSON</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Thông báo */}
        {activeTab === 'notifications' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* Nhắc trước 30 giây */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/5">
              <div>
                <h4 className="font-medium text-white/90">Nhắc trước 30 giây</h4>
                <p className="text-[11px] text-white/50">Pill đổi màu vàng nhẹ khi còn 30 giây</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings.remindBefore30s}
                onChange={(e) => updateNotifSettings({ remindBefore30s: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Pulse effect */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/5">
              <div>
                <h4 className="font-medium text-white/90">Pulse effect</h4>
                <p className="text-[11px] text-white/50">Phát sáng nhẹ màu vàng xung quanh khi đến giờ</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings.pulseEffect}
                onChange={(e) => updateNotifSettings({ pulseEffect: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Giữ expanded 60 giây */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/5">
              <div>
                <h4 className="font-medium text-white/90">Giữ expanded 60 giây</h4>
                <p className="text-[11px] text-white/50">Tự thu nhỏ sau 60s và giữ màu vàng nếu chưa làm</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings.keepExpanded60s}
                onChange={(e) => updateNotifSettings({ keepExpanded60s: e.target.checked })}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Số lần pulse (1-5) */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.04] border border-white/5">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white/90">Số lần pulse</h4>
                <span className="text-amber-400 font-semibold">{notifSettings.pulseCount} lần</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={notifSettings.pulseCount}
                onChange={(e) => updateNotifSettings({ pulseCount: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Âm thanh nhắc nhở (mặc định tắt) */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/5 opacity-60">
              <div>
                <h4 className="font-medium text-white/90">Âm thanh nhắc nhở</h4>
                <p className="text-[11px] text-white/50">Mặc định tắt theo triết lý yên tĩnh</p>
              </div>
              <input
                type="checkbox"
                disabled
                checked={false}
                className="w-4 h-4"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Chung */}
        {activeTab === 'general' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-medium text-white/80">
                <Monitor className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
                <span>Màn hình hiển thị</span>
              </label>
              <select
                value={settings.targetDisplayId ?? ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : null;
                  if (val !== null) setDisplay(val);
                }}
                className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-400 transition-colors cursor-pointer"
              >
                <option value="" className="bg-neutral-900 text-white">
                  Màn hình chính (Primary Display)
                </option>
                {displays.map((disp) => (
                  <option key={disp.id} value={disp.id} className="bg-neutral-900 text-white">
                    {disp.label} {disp.isPrimary ? '(Mặc định)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-medium text-white/80">
                <Palette className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
                <span>Chế độ giao diện</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'oled', label: 'OLED Black (85%)' },
                  { id: 'glass', label: 'Frosted Glass' },
                  { id: 'cyberpunk', label: 'Neon Glow' },
                  { id: 'minimal', label: 'Minimalist' },
                ].map((themeItem) => (
                  <button
                    key={themeItem.id}
                    type="button"
                    onClick={() => updateSettings({ theme: themeItem.id as typeof settings.theme })}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                      settings.theme === themeItem.id
                        ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {themeItem.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
