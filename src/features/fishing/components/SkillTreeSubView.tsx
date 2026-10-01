import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Sparkles, Check, ChevronRight, Lock, BookOpen } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { RODS } from '../data/shopData';
import { CORE_HOOK_LEVELS } from '../data/ratesData';
import type { RodId } from '../../../types/fishing';

export const SkillTreeSubView: React.FC = () => {
  const mutationPoints = useFishingStore((s) => s.mutationPoints);
  const currentRodId = useFishingStore((s) => s.currentRodId);
  const ownedRodIds = useFishingStore((s) => s.ownedRodIds);
  const coreHookLevelByRod = useFishingStore((s) => s.coreHookLevelByRod);
  const upgradeCoreHook = useFishingStore((s) => s.upgradeCoreHook);
  const hasUnlockedTier5Ever = useFishingStore((s) => s.hasUnlockedTier5Ever);
  const collectorSkillLevel = useFishingStore((s) => s.collectorSkillLevel);
  const upgradeCollectorSkill = useFishingStore((s) => s.upgradeCollectorSkill);

  const [activeTab, setActiveTab] = useState<'hook' | 'collector'>('hook');
  const [selectedRodId, setSelectedRodId] = useState<RodId>(currentRodId);
  const [notifyMsg, setNotifyMsg] = useState<string | null>(null);

  const currentLevel = coreHookLevelByRod[selectedRodId] || 0;
  const isMaxLevel = currentLevel >= 5;
  const nextConfig = CORE_HOOK_LEVELS.find((h) => h.level === currentLevel + 1);
  const currentConfig = CORE_HOOK_LEVELS.find((h) => h.level === currentLevel) || CORE_HOOK_LEVELS[0];

  const collectorCosts = [10, 20, 35, 50, 75];
  const nextCollectorCost = collectorCosts[collectorSkillLevel] || 0;

  const handleUpgrade = () => {
    if (!nextConfig) return;
    const success = upgradeCoreHook(selectedRodId);
    if (success) {
      setNotifyMsg(`Nâng cấp thành công lên Cấp ${currentLevel + 1}!`);
    } else {
      setNotifyMsg('Không đủ Điểm Đột Biến!');
    }
    setTimeout(() => setNotifyMsg(null), 2500);
  };

  const handleUpgradeCollector = () => {
    const success = upgradeCollectorSkill();
    if (success) {
      setNotifyMsg(`Nâng cấp "Sưu Tầm Gia" lên Cấp ${collectorSkillLevel + 1}!`);
    } else {
      setNotifyMsg('Không đủ Điểm Đột Biến hoặc chưa mở khóa!');
    }
    setTimeout(() => setNotifyMsg(null), 2500);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none text-white overflow-hidden">
      {/* Header & Mutation Points */}
      <div className="flex items-center justify-between pb-1.5 shrink-0 border-b border-white/10">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab('hook')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'hook'
                ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Lưỡi Câu Cốt Lõi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('collector')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'collector'
                ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-3 h-3 text-sky-400" />
            <span>Sưu Tầm Gia</span>
            {!hasUnlockedTier5Ever && <Lock className="w-2.5 h-2.5 text-white/40" />}
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[11px] font-bold">
          <Dna className="w-3.5 h-3.5 text-purple-400" strokeWidth={1.5} />
          <span>{mutationPoints.toLocaleString()} MP</span>
        </div>
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {notifyMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="my-0.5 text-center py-0.5 px-2 bg-purple-500/25 border border-purple-400/40 text-purple-200 text-[10px] font-medium rounded-lg"
          >
            {notifyMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab 1: Hook View */}
      {activeTab === 'hook' ? (
        <div className="flex-1 flex flex-col justify-between py-1 min-h-0">
          {/* Rod Horizontal Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
            {ownedRodIds.map((id) => {
              const rod = RODS[id];
              const isSelected = selectedRodId === id;
              const lvl = coreHookLevelByRod[id] || 0;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedRodId(id)}
                  className={`shrink-0 px-2 py-1 rounded-xl text-[10px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-purple-500/30 border-purple-400 text-purple-100 shadow-md'
                      : 'bg-white/[0.04] border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span>{rod.name.split(' ')[1] || rod.name}</span>
                  <span className="text-[9px] px-1 rounded bg-black/40 text-purple-300">
                    Lvl {lvl}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Level Progression Tree Visualizer */}
          <div className="flex items-center justify-between px-2 py-1 bg-white/[0.03] border border-white/10 rounded-xl my-1 shrink-0">
            {CORE_HOOK_LEVELS.map((node, idx) => {
              const isAchieved = currentLevel >= node.level;
              const isCurrent = currentLevel === node.level;

              return (
                <React.Fragment key={node.level}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                        isCurrent
                          ? 'bg-purple-500 text-white border-purple-300 ring-2 ring-purple-400/40 shadow-lg'
                          : isAchieved
                          ? 'bg-purple-500/30 text-purple-200 border-purple-400/50'
                          : 'bg-white/5 text-white/30 border-white/10'
                      }`}
                    >
                      {isAchieved && node.level > 0 ? (
                        <Check className="w-3 h-3 text-purple-200" strokeWidth={1.5} />
                      ) : (
                        node.level
                      )}
                    </div>
                    <span className="text-[8px] text-white/50 mt-0.5">Cấp {node.level}</span>
                  </div>

                  {idx < CORE_HOOK_LEVELS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 rounded transition-colors ${
                        currentLevel > node.level ? 'bg-purple-500' : 'bg-white/10'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Current Level Stats Card */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-2.5 flex flex-col justify-between flex-1 my-1">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[12px] font-bold text-white/95">
                    Lưỡi Câu Cốt Lõi (Cấp {currentLevel})
                  </h4>
                  <p className="text-[10px] text-white/60 leading-tight mt-0.5">
                    {currentLevel === 0 ? 'Chưa cường hóa' : 'Cường hóa tỉ lệ câu cá hiếm Tier 5-7'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-white/40 block">Tỉ lệ Tier 5-7</span>
                  <span className="text-[11px] font-extrabold text-amber-300">
                    +{currentConfig.tier5Bonus + currentConfig.tier6Bonus + currentConfig.tier7Bonus}%
                  </span>
                </div>
              </div>

              {/* Bonus Badges Grid */}
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                <div className="p-1 rounded-lg bg-white/5 border border-white/10 text-center">
                  <span className="text-[9px] text-white/50 block">Tier 5</span>
                  <span className="text-[11px] font-bold text-amber-300">
                    +{currentConfig.tier5Bonus}%
                  </span>
                </div>
                <div className="p-1 rounded-lg bg-white/5 border border-white/10 text-center">
                  <span className="text-[9px] text-white/50 block">Tier 6</span>
                  <span className="text-[11px] font-bold text-rose-300">
                    +{currentConfig.tier6Bonus}%
                  </span>
                </div>
                <div className="p-1 rounded-lg bg-white/5 border border-white/10 text-center">
                  <span className="text-[9px] text-white/50 block">Tier 7</span>
                  <span className="text-[11px] font-bold text-yellow-300">
                    +{currentConfig.tier7Bonus}%
                  </span>
                </div>
              </div>
            </div>

            {/* Next Level Preview */}
            {!isMaxLevel && nextConfig && (
              <div className="pt-1 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-white/40 uppercase font-bold tracking-wider">
                    Cấp tiếp theo (Cấp {nextConfig.level})
                  </span>
                  <span className="text-purple-300 font-semibold">
                    +{nextConfig.tier5Bonus}% T5 • +{nextConfig.tier6Bonus}% T6 • +{nextConfig.tier7Bonus}% T7
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Upgrade Button */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between shrink-0">
            {!isMaxLevel && nextConfig ? (
              <>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-300">
                  <Dna className="w-3.5 h-3.5 text-purple-400" strokeWidth={1.5} />
                  <span>Chi phí: {nextConfig.costPoints.toLocaleString()} MP</span>
                </div>

                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={mutationPoints < nextConfig.costPoints}
                  className={`px-4 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-md ${
                    mutationPoints >= nextConfig.costPoints
                      ? 'bg-purple-500/30 border-purple-400 text-purple-100 hover:bg-purple-500/40 active:scale-95'
                      : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <span>Nâng cấp</span>
                  <ChevronRight className="w-3 h-3 text-purple-300" strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <div className="w-full text-center py-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 rounded-xl">
                ✨ Đã đạt cấp tối đa (Cấp 5: +25% T5, +15% T6, +5% T7)
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: Sưu Tầm Gia */
        <div className="flex-1 flex flex-col justify-between py-2 min-h-0">
          {!hasUnlockedTier5Ever ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                <Lock className="w-6 h-6 text-white/40" />
              </div>
              <h4 className="text-[13px] font-bold text-white/80">
                Kỹ Năng "Sưu Tầm Gia" Đang Bị Khóa
              </h4>
              <p className="text-[11px] text-white/50 max-w-[300px] mt-1.5 leading-relaxed">
                Hãy bắt được ít nhất một loài cá <strong className="text-amber-300">Tier 5+</strong> (Cá Thần Thoại / Thủy Quái) để mở khóa kỹ năng đặc biệt này.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between bg-white/[0.04] border border-purple-500/30 rounded-2xl p-3">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-white">Sưu Tầm Gia</h4>
                      <span className="text-[10px] text-purple-300 font-semibold">
                        Cấp độ: {collectorSkillLevel}/5
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                    +{collectorSkillLevel * 5}% Tỉ Lệ Cá Mới
                  </span>
                </div>

                <p className="text-[11px] text-white/70 mt-2.5 leading-relaxed">
                  Tăng xác suất xuất hiện các loài cá <strong className="text-sky-300">chưa từng câu được</strong> trong Thư Viện. Giúp bạn hoàn thiện bộ sưu tập 84/84 nhanh hơn!
                </p>

                {/* Level Nodes */}
                <div className="flex items-center justify-between px-2 py-2 bg-black/30 border border-white/10 rounded-xl my-3">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isReached = collectorSkillLevel >= lvl;
                    return (
                      <div key={lvl} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                            isReached
                              ? 'bg-purple-500 text-white border-purple-300 shadow-md'
                              : 'bg-white/5 text-white/30 border-white/10'
                          }`}
                        >
                          {isReached ? <Check className="w-3.5 h-3.5 text-white" /> : lvl}
                        </div>
                        <span className="text-[8px] text-white/50 mt-1">+{lvl * 5}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collector Upgrade Button */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                {collectorSkillLevel < 5 ? (
                  <>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-300">
                      <Dna className="w-3.5 h-3.5 text-purple-400" strokeWidth={1.5} />
                      <span>Chi phí: {nextCollectorCost} MP</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleUpgradeCollector}
                      disabled={mutationPoints < nextCollectorCost}
                      className={`px-4 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-md ${
                        mutationPoints >= nextCollectorCost
                          ? 'bg-purple-500/30 border-purple-400 text-purple-100 hover:bg-purple-500/40 active:scale-95'
                          : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      <span>Nâng cấp (+5%)</span>
                      <ChevronRight className="w-3 h-3 text-purple-300" strokeWidth={1.5} />
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center py-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 rounded-xl">
                    ✨ Đã đạt cấp tối đa (+25% tỉ lệ cá mới chưa có)
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
