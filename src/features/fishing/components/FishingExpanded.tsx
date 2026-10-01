import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Fish, Coins, Gem, Dna } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { FishingScene } from './FishingScene';
import { FishBasket } from './FishBasket';
import { PlayerStatus } from './PlayerStatus';
import { ShopSubView } from './ShopSubView';
import { SkillTreeSubView } from './SkillTreeSubView';
import { CustomizationSubView } from './CustomizationSubView';
import { FishLibrarySubView } from './FishLibrarySubView';
import { CollectionCompletionModal } from './CollectionCompletionModal';
import { CatchCelebration } from './CatchCelebration';

interface FishingExpandedProps {
  onCollapse: () => void;
  renderShopSubView?: React.ReactNode;
  renderSkillTreeSubView?: React.ReactNode;
  renderCustomizationSubView?: React.ReactNode;
  renderLibrarySubView?: React.ReactNode;
}

export const FishingExpanded: React.FC<FishingExpandedProps> = ({
  onCollapse,
  renderShopSubView,
  renderSkillTreeSubView,
  renderCustomizationSubView,
  renderLibrarySubView,
}) => {
  const gold = useFishingStore((s) => s.gold);
  const diamonds = useFishingStore((s) => s.diamonds);
  const mutationPoints = useFishingStore((s) => s.mutationPoints);
  const activeSubTab = useFishingStore((s) => s.activeSubTab);
  const setActiveSubTab = useFishingStore((s) => s.setActiveSubTab);
  const offlineEarningsReport = useFishingStore((s) => s.offlineEarningsReport);
  const dismissOfflineReport = useFishingStore((s) => s.dismissOfflineReport);
  const newFishNotification = useFishingStore((s) => s.newFishNotification);
  const clearNewFishNotification = useFishingStore((s) => s.clearNewFishNotification);
  const celebrationTier = useFishingStore((s) => s.celebrationTier);
  const lastCaughtFish = useFishingStore((s) => s.lastCaughtFish);
  const clearCelebration = useFishingStore((s) => s.clearCelebration);

  // Auto clear new fish notification after 3 seconds
  React.useEffect(() => {
    if (newFishNotification) {
      const timer = setTimeout(() => {
        clearNewFishNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newFishNotification, clearNewFishNotification]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 select-none text-white relative">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-1.5 border-b border-white/10 shrink-0 gap-2">
        <div className="flex items-center gap-2 shrink-0">
          {activeSubTab !== 'fishing' ? (
            <button
              type="button"
              onClick={() => setActiveSubTab('fishing')}
              className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Quay lại</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-sky-500/20 flex items-center justify-center">
                <Fish className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
              </div>
              <span className="text-[12px] font-semibold text-white/90 tracking-tight whitespace-nowrap">
                Câu Cá Idle
              </span>
            </div>
          )}
        </div>

        {/* Currency Display Bar (Always visible in all subviews!) */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2.5 px-2.5 py-0.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs shadow-inner">
            {/* Gold */}
            <div className="flex items-center gap-1 shrink-0" title={`Tổng vàng hiện có: ${gold.toLocaleString()}`}>
              <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" strokeWidth={1.5} />
              <span className="text-[11px] font-bold text-amber-300 tabular-nums whitespace-nowrap">
                {gold.toLocaleString()}
              </span>
            </div>

            {/* Diamonds */}
            <div className="flex items-center gap-1 shrink-0" title={`Kim Cương: ${diamonds.toLocaleString()}`}>
              <Gem className="w-3.5 h-3.5 text-sky-400 shrink-0" strokeWidth={1.5} />
              <span className="text-[11px] font-bold text-sky-300 tabular-nums whitespace-nowrap">
                {diamonds.toLocaleString()}
              </span>
            </div>

            {/* Mutation Points (only when > 0) */}
            {mutationPoints > 0 && (
              <div className="flex items-center gap-1 shrink-0" title={`Điểm Đột Biến: ${mutationPoints.toLocaleString()}`}>
                <Dna className="w-3.5 h-3.5 text-purple-400 shrink-0" strokeWidth={1.5} />
                <span className="text-[11px] font-bold text-purple-300 tabular-nums whitespace-nowrap">
                  {mutationPoints.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onCollapse}
            className="p-1 rounded-md text-white/60 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Thu nhỏ về Dynamic Island"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* New Fish Unlocked Notification Banner (3 seconds) */}
      <AnimatePresence>
        {newFishNotification && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className="my-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/30 via-indigo-500/30 to-purple-500/30 border border-sky-400/50 flex items-center justify-between text-[11px] text-sky-200 shadow-lg shadow-sky-500/20"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <span>🆕</span>
              <span>
                Loài mới! <strong className="text-white">"{newFishNotification}"</strong> đã được thêm vào Thư viện.
              </span>
            </span>
            <button
              type="button"
              onClick={() => setActiveSubTab('library')}
              className="text-[10px] underline font-bold ml-2 cursor-pointer text-sky-300 hover:text-white"
            >
              Xem ngay
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Earning Notification Banner if any */}
      <AnimatePresence>
        {offlineEarningsReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="my-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-yellow-500/25 border border-yellow-400/40 flex items-center justify-between text-[11px] text-amber-200"
          >
            <span>
              🎉 Chào mừng trở lại! Bạn kiếm được{' '}
              <strong className="text-white">{offlineEarningsReport.gold.toLocaleString()} vàng</strong> trong{' '}
              {offlineEarningsReport.hours} giờ qua.
              {offlineEarningsReport.newFishNames && offlineEarningsReport.newFishNames.length > 0 && (
                <span className="ml-1 text-emerald-300">
                  (+{offlineEarningsReport.newFishNames.length} loài cá mới!)
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={dismissOfflineReport}
              className="text-[10px] underline font-bold ml-2 cursor-pointer text-amber-300"
            >
              Đóng
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main SubTab Content Switcher */}
      <div className="flex-1 flex flex-col justify-between py-1 min-h-0">
        <AnimatePresence mode="wait">
          {activeSubTab === 'fishing' && (
            <motion.div
              key="subtab-fishing"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="h-full flex flex-col justify-between gap-1.5"
            >
              <FishingScene />
              <FishBasket />
              <PlayerStatus />
            </motion.div>
          )}

          {activeSubTab === 'shop' && (
            <motion.div
              key="subtab-shop"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {renderShopSubView || <ShopSubView />}
            </motion.div>
          )}

          {activeSubTab === 'skillTree' && (
            <motion.div
              key="subtab-skillTree"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {renderSkillTreeSubView || <SkillTreeSubView />}
            </motion.div>
          )}

          {activeSubTab === 'customization' && (
            <motion.div
              key="subtab-customization"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {renderCustomizationSubView || <CustomizationSubView />}
            </motion.div>
          )}

          {activeSubTab === 'library' && (
            <motion.div
              key="subtab-library"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {renderLibrarySubView || <FishLibrarySubView />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Catch Celebration Overlay (Tier 5+) */}
      <AnimatePresence>
        {celebrationTier && lastCaughtFish && (
          <CatchCelebration
            key={lastCaughtFish.id + '-' + celebrationTier}
            fish={lastCaughtFish}
            tier={celebrationTier}
            onClose={clearCelebration}
          />
        )}
      </AnimatePresence>

      {/* 84/84 Full Collection Modal */}
      <CollectionCompletionModal />
    </div>
  );
};
