import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFishingStore } from '../stores/fishingStore';
import { ViewHeader } from './shared/ViewHeader';
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
  onOpenMedia?: () => void;
  hasMedia?: boolean;
  renderShopSubView?: React.ReactNode;
  renderSkillTreeSubView?: React.ReactNode;
  renderCustomizationSubView?: React.ReactNode;
  renderLibrarySubView?: React.ReactNode;
}

const SUBVIEW_TITLES: Record<string, string> = {
  shop: 'Cửa hàng',
  skillTree: 'Lưỡi câu cốt lõi',
  customization: 'Tùy biến',
  library: 'Thư viện',
};

export const FishingExpanded: React.FC<FishingExpandedProps> = ({
  onCollapse,
  onOpenMedia,
  hasMedia,
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

  const viewTitle = activeSubTab === 'fishing' ? 'Câu Cá Idle' : (SUBVIEW_TITLES[activeSubTab] || 'Câu Cá');

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-3 select-none text-[#F5F5F7] relative"
      style={{
        backgroundColor: 'rgba(10, 10, 15, 0.94)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Top Header Bar using AAA ViewHeader */}
      <ViewHeader
        title={viewTitle}
        onBack={activeSubTab !== 'fishing' ? () => setActiveSubTab('fishing') : undefined}
        onClose={onCollapse}
        onOpenMedia={onOpenMedia}
        hasMedia={hasMedia}
        gold={gold}
        diamonds={diamonds}
        mutationPoints={mutationPoints}
      />

      {/* New Fish Unlocked Notification Banner (Restrained Apple/Linear Style) */}
      <AnimatePresence>
        {newFishNotification && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="my-1 px-3 py-1.5 rounded-[10px] bg-[#14141A] border border-[rgba(90,200,250,0.3)] flex items-center justify-between text-[12px] text-[#5AC8FA]"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)' }}
          >
            <span className="flex items-center gap-1.5 font-normal truncate">
              <span className="font-semibold text-[#F5F5F7]">Loài mới:</span>
              <span className="truncate">"{newFishNotification}" đã lưu vào thư viện</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveSubTab('library')}
              className="text-[11px] font-medium ml-2 px-1.5 py-0.5 rounded-[6px] bg-[rgba(90,200,250,0.12)] text-[#5AC8FA] hover:bg-[rgba(90,200,250,0.2)] transition-colors cursor-pointer shrink-0"
            >
              Xem ngay
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Earnings Notification Banner (Restrained Style) */}
      <AnimatePresence>
        {offlineEarningsReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="my-1 px-3 py-1.5 rounded-[10px] bg-[#14141A] border border-[rgba(255,159,10,0.25)] flex items-center justify-between text-[12px] text-[#8A8A94]"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)' }}
          >
            <span className="truncate">
              Chào mừng trở lại! Kiếm được{' '}
              <strong className="text-[#FFD60A] font-semibold">{offlineEarningsReport.gold.toLocaleString()} vàng</strong>{' '}
              trong {offlineEarningsReport.hours}h
              {offlineEarningsReport.newFishNames && offlineEarningsReport.newFishNames.length > 0 && (
                <span className="ml-1 text-[#32D74B]">
                  (+{offlineEarningsReport.newFishNames.length} loài mới)
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={dismissOfflineReport}
              className="text-[11px] font-medium ml-2 text-[#8A8A94] hover:text-[#F5F5F7] transition-colors cursor-pointer shrink-0"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full flex flex-col justify-between gap-2"
            >
              {/* Zone 1: Water Surface (40% ~ 130px) */}
              <FishingScene />
              {/* Zone 2: Fish Basket (35% ~ 110px) */}
              <FishBasket />
              {/* Zone 3: Navigation / Status (25% ~ 70px) */}
              <PlayerStatus />
            </motion.div>
          )}

          {activeSubTab === 'shop' && (
            <motion.div
              key="subtab-shop"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
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
              exit={{ opacity: 0, x: -8 }}
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
              exit={{ opacity: 0, x: -8 }}
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
              exit={{ opacity: 0, x: -8 }}
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
