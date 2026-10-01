import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Sparkles, Check, ChevronRight, Lock, BookOpen } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { RODS } from '../data/shopData';
import { CORE_HOOK_LEVELS } from '../data/ratesData';
import { ActionButton } from './shared/ActionButton';
import { TabularNumber } from './shared/TabularNumber';
import { TOKENS } from '../constants/tokens';
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
    <div className="w-full h-full flex flex-col justify-between select-none text-[#F5F5F7] overflow-hidden">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between pb-2 shrink-0 border-b border-white/[0.06]">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#14141A] p-0.5 rounded-[10px] border border-white/[0.06] text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('hook')}
            className={`px-2.5 py-1 rounded-[8px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hook'
                ? 'bg-white/[0.1] text-[#F5F5F7] shadow-sm'
                : 'text-[#8A8A94] hover:text-[#F5F5F7]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#BF5AF2]" strokeWidth={1.5} />
            <span>Lưỡi Câu Cốt Lõi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('collector')}
            className={`px-2.5 py-1 rounded-[8px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'collector'
                ? 'bg-white/[0.1] text-[#F5F5F7] shadow-sm'
                : 'text-[#8A8A94] hover:text-[#F5F5F7]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#5AC8FA]" strokeWidth={1.5} />
            <span>Sưu Tầm Gia</span>
            {!hasUnlockedTier5Ever && <Lock className="w-3 h-3 text-[#6E6E78]" strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mutation Points Balance */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] bg-[#14141A] border border-[#BF5AF2]/30 text-[#BF5AF2] text-[11px] font-medium tabular-nums">
          <Dna className="w-3.5 h-3.5 text-[#BF5AF2]" strokeWidth={1.5} />
          <span><TabularNumber value={mutationPoints} /> MP</span>
        </div>
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {notifyMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="my-1 text-center py-1 px-2.5 bg-[#BF5AF2]/15 border border-[#BF5AF2]/30 text-[#BF5AF2] text-[11px] font-medium rounded-[8px]"
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
                  className={`shrink-0 px-2.5 py-1 rounded-[10px] text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#14141A] border-[#BF5AF2] text-[#F5F5F7] shadow-sm'
                      : 'bg-[#14141A]/60 border-white/[0.06] text-[#8A8A94] hover:text-[#F5F5F7]'
                  }`}
                  style={{ boxShadow: TOKENS.shadows.innerHighlight }}
                >
                  <span>{rod.name.split(' ')[1] || rod.name}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded-[4px] bg-black/40 text-[#BF5AF2] tabular-nums font-semibold">
                    Lvl {lvl}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Linear Progress Bar (5 Segmented Dots / Levels) */}
          <div
            className="flex items-center justify-between px-3 py-2 bg-[#14141A] border border-white/[0.06] rounded-[12px] my-1 shrink-0"
            style={{ boxShadow: TOKENS.shadows.innerHighlight }}
          >
            {CORE_HOOK_LEVELS.map((node, idx) => {
              const isAchieved = currentLevel >= node.level;
              const isCurrent = currentLevel === node.level;

              return (
                <React.Fragment key={node.level}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-all ${
                        isCurrent
                          ? 'bg-[#BF5AF2] text-[#0A0A0F] border-[#BF5AF2] shadow-sm'
                          : isAchieved
                          ? 'bg-[#BF5AF2]/20 text-[#BF5AF2] border-[#BF5AF2]/50'
                          : 'bg-white/[0.04] text-[#8A8A94] border-white/[0.08]'
                      }`}
                    >
                      {isAchieved && node.level > 0 ? (
                        <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                      ) : (
                        node.level
                      )}
                    </div>
                    <span className="text-[9px] text-[#8A8A94] mt-0.5">Cấp {node.level}</span>
                  </div>

                  {idx < CORE_HOOK_LEVELS.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-1.5 rounded-full transition-colors ${
                        currentLevel > node.level ? 'bg-[#BF5AF2]' : 'bg-white/[0.08]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Current Level Stats Card */}
          <div
            className="bg-[#14141A] border border-white/[0.06] rounded-[16px] p-3 flex flex-col justify-between flex-1 my-1"
            style={{ boxShadow: TOKENS.shadows.innerHighlight }}
          >
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-medium text-[#F5F5F7]">
                    Lưỡi Câu Cốt Lõi (Cấp {currentLevel})
                  </h4>
                  <p className="text-[11px] text-[#8A8A94] mt-0.5">
                    {currentLevel === 0 ? 'Chưa cường hóa' : 'Tăng tỉ lệ xuất hiện cá hiếm Tier 5 đến 7'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#8A8A94] block">Tổng tỉ lệ cộng</span>
                  <span className="text-[13px] font-semibold text-[#FFD60A] tabular-nums">
                    +{currentConfig.tier5Bonus + currentConfig.tier6Bonus + currentConfig.tier7Bonus}%
                  </span>
                </div>
              </div>

              {/* Bonus Badges Grid */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="p-2 rounded-[10px] bg-white/[0.03] border border-white/[0.06] text-center">
                  <span className="text-[10px] text-[#8A8A94] block">Tier 5</span>
                  <span className="text-[12px] font-semibold text-[#FF9F0A] tabular-nums">
                    +{currentConfig.tier5Bonus}%
                  </span>
                </div>
                <div className="p-2 rounded-[10px] bg-white/[0.03] border border-white/[0.06] text-center">
                  <span className="text-[10px] text-[#8A8A94] block">Tier 6</span>
                  <span className="text-[12px] font-semibold text-[#FF453A] tabular-nums">
                    +{currentConfig.tier6Bonus}%
                  </span>
                </div>
                <div className="p-2 rounded-[10px] bg-white/[0.03] border border-white/[0.06] text-center">
                  <span className="text-[10px] text-[#8A8A94] block">Tier 7</span>
                  <span className="text-[12px] font-semibold text-[#FFD60A] tabular-nums">
                    +{currentConfig.tier7Bonus}%
                  </span>
                </div>
              </div>
            </div>

            {/* Next Level Preview */}
            {!isMaxLevel && nextConfig && (
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8A8A94]">
                    Cấp tiếp theo ({nextConfig.level}):
                  </span>
                  <span className="text-[#BF5AF2] font-medium tabular-nums">
                    +{nextConfig.tier5Bonus}% T5 • +{nextConfig.tier6Bonus}% T6 • +{nextConfig.tier7Bonus}% T7
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Upgrade Button Row */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between shrink-0">
            {!isMaxLevel && nextConfig ? (
              <>
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#BF5AF2]">
                  <Dna className="w-3.5 h-3.5 text-[#BF5AF2]" strokeWidth={1.5} />
                  <span>Chi phí: <TabularNumber value={nextConfig.costPoints} /> MP</span>
                </div>

                <ActionButton
                  variant="primary"
                  size="md"
                  onClick={handleUpgrade}
                  disabled={mutationPoints < nextConfig.costPoints}
                >
                  <span>Nâng cấp</span>
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </ActionButton>
              </>
            ) : (
              <div className="w-full text-center py-1.5 text-[12px] font-medium text-[#32D74B] bg-[#32D74B]/10 border border-[#32D74B]/20 rounded-[10px]">
                Đã đạt cấp tối đa (+25% T5, +15% T6, +5% T7)
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: Sưu Tầm Gia */
        <div className="flex-1 flex flex-col justify-between py-2 min-h-0">
          {!hasUnlockedTier5Ever ? (
            <div
              className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-[#14141A] border border-white/[0.06] rounded-[16px]"
              style={{ boxShadow: TOKENS.shadows.innerHighlight }}
            >
              <div className="w-10 h-10 rounded-[12px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-2">
                <Lock className="w-5 h-5 text-[#6E6E78]" strokeWidth={1.5} />
              </div>
              <h4 className="text-[13px] font-medium text-[#F5F5F7]">
                Kỹ Năng "Sưu Tầm Gia" Đang Bị Khóa
              </h4>
              <p className="text-[11px] text-[#8A8A94] max-w-[280px] mt-1 leading-relaxed">
                Hãy bắt ít nhất một loài cá Tier 5+ (Thần Thoại hoặc Boss) để mở khóa kỹ năng này.
              </p>
            </div>
          ) : (
            <div
              className="flex-1 flex flex-col justify-between bg-[#14141A] border border-white/[0.06] rounded-[16px] p-3"
              style={{ boxShadow: TOKENS.shadows.innerHighlight }}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-[10px] bg-[#5AC8FA]/15 border border-[#5AC8FA]/30 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-[#5AC8FA]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-medium text-[#F5F5F7]">Sưu Tầm Gia</h4>
                      <span className="text-[11px] text-[#8A8A94]">
                        Cấp độ: {collectorSkillLevel}/5
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[#32D74B]/10 border border-[#32D74B]/20 text-[#32D74B] tabular-nums">
                    +{collectorSkillLevel * 5}% Tỉ Lệ Cá Mới
                  </span>
                </div>

                <p className="text-[11px] text-[#8A8A94] mt-2 leading-relaxed">
                  Tăng xác suất xuất hiện các loài cá chưa từng câu được trong Thư Viện. Giúp bạn hoàn thiện bộ sưu tập 84 loài nhanh hơn.
                </p>

                {/* Level Nodes */}
                <div className="flex items-center justify-between px-3 py-2 bg-black/30 border border-white/[0.06] rounded-[12px] my-3">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isReached = collectorSkillLevel >= lvl;
                    return (
                      <div key={lvl} className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-all ${
                            isReached
                              ? 'bg-[#5AC8FA] text-[#0A0A0F] border-[#5AC8FA]'
                              : 'bg-white/[0.04] text-[#8A8A94] border-white/[0.06]'
                          }`}
                        >
                          {isReached ? <Check className="w-3.5 h-3.5" strokeWidth={1.5} /> : lvl}
                        </div>
                        <span className="text-[9px] text-[#8A8A94] mt-1">+{lvl * 5}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collector Upgrade Button */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                {collectorSkillLevel < 5 ? (
                  <>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-[#BF5AF2]">
                      <Dna className="w-3.5 h-3.5 text-[#BF5AF2]" strokeWidth={1.5} />
                      <span>Chi phí: <TabularNumber value={nextCollectorCost} /> MP</span>
                    </div>

                    <ActionButton
                      variant="primary"
                      size="md"
                      onClick={handleUpgradeCollector}
                      disabled={mutationPoints < nextCollectorCost}
                    >
                      <span>Nâng cấp (+5%)</span>
                      <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </ActionButton>
                  </>
                ) : (
                  <div className="w-full text-center py-1 text-[11px] font-medium text-[#32D74B] bg-[#32D74B]/10 border border-[#32D74B]/20 rounded-[10px]">
                    Đã đạt cấp tối đa (+25% tỉ lệ cá mới)
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
