import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../stores/settingsStore';
import {
  Settings,
  X,
  Monitor,
  Palette,
  Keyboard,
  Shield,
  AlertTriangle,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, displays, shortcutConflict, updateSettings, setDisplay, revokePlugin, plugins } =
    useSettingsStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-[440px] max-h-[460px] bg-black/95 border border-white/20 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 flex flex-col text-white select-none mt-2 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Settings className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Cài đặt Dynamic Island</h3>
              <p className="text-[11px] text-white/50">Tuỳ chỉnh giao diện, vị trí và hành vi</p>
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

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* 1. Màn hình hiển thị */}
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

          {/* 2. Theme & Giao diện */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-medium text-white/80">
              <Palette className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
              <span>Chủ đề giao diện</span>
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
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70'
                  }`}
                >
                  {themeItem.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Vị trí Y Offset */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="font-medium text-white/80">Khoảng cách mép trên (Y-Offset)</label>
              <span className="font-mono text-white/60">{settings.yOffset}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={settings.yOffset}
              onChange={(e) => updateSettings({ yOffset: Number(e.target.value) })}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          {/* 4. Phím tắt toàn cục */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-medium text-white/80">
              <Keyboard className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
              <span>Phím tắt toàn cục ẩn/hiện</span>
            </label>
            <input
              type="text"
              value={settings.globalHotkey}
              onChange={(e) => updateSettings({ globalHotkey: e.target.value })}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-sky-400 transition-colors font-mono"
              placeholder="e.g. CommandOrControl+Alt+I"
            />
            {shortcutConflict && (
              <div className="flex items-center gap-1.5 text-amber-300 text-[11px] mt-1 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                <span>Phím tắt {shortcutConflict} đã bị ứng dụng khác chiếm dụng.</span>
              </div>
            )}
          </div>

          {/* 5. Toggles */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-white/80">Tự ẩn khi có ứng dụng toàn màn hình</span>
              <input
                type="checkbox"
                checked={settings.autoHideOnFullscreen}
                onChange={(e) => updateSettings({ autoHideOnFullscreen: e.target.checked })}
                className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-white/80">Chế độ tiết kiệm pin (adaptive 100ms)</span>
              <input
                type="checkbox"
                checked={settings.batterySaver}
                onChange={(e) => updateSettings({ batterySaver: e.target.checked })}
                className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* 6. Quản lý Plugins */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-medium text-white/80">
                <Shield className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
                <span>Plugins được kết nối</span>
              </label>
              <span className="text-[10px] text-white/50">{plugins.length} active</span>
            </div>

            {plugins.length === 0 ? (
              <p className="text-[11px] text-white/40 italic bg-white/5 p-2 rounded-xl">
                Chưa có plugin ngoài nào được kết nối. Chạy script hoặc mở plugin để liên kết.
              </p>
            ) : (
              <div className="space-y-1">
                {plugins.map((plug) => (
                  <div key={plug.pluginId} className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                    <div>
                      <h6 className="font-medium text-white/90">{plug.name}</h6>
                      <p className="text-[10px] text-white/50">{plug.pluginId}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => revokePlugin(plug.pluginId)}
                      className="px-2 py-1 rounded-md bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[10px] transition-colors"
                    >
                      Thu hồi
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
