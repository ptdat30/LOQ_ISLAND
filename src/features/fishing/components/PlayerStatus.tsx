import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Sparkles,
  Palette,
  Globe,
  Lock,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { RODS, BAITS_INFO } from '../data/shopData';
import { WORLDS_INFO } from '../data/fishData';
import { TOKENS } from '../constants/tokens';
import type { WorldId } from '../../../types/fishing';

export const PlayerStatus: React.FC = () => {
  const currentWorld = useFishingStore((s) => s.currentWorld);
  const currentRodId = useFishingStore((s) => s.currentRodId);
  const currentBaitId = useFishingStore((s) => s.currentBaitId);
  const baitInventory = useFishingStore((s) => s.baitInventory);
  const switchWorld = useFishingStore((s) => s.switchWorld);
  const setActiveSubTab = useFishingStore((s) => s.setActiveSubTab);

  const [isWorldMenuOpen, setIsWorldMenuOpen] = useState(false);
  const [worldSwitchError, setWorldSwitchError] = useState<string | null>(null);

  const rod = RODS[currentRodId] || RODS.rod_bamboo;
  const bait = currentBaitId ? BAITS_INFO[currentBaitId] : null;
  const baitCount = currentBaitId ? baitInventory[currentBaitId] || 0 : 0;

  const handleSelectWorld = (w: WorldId) => {
    const success = switchWorld(w);
    if (!success) {
      if (w === 2) {
        setWorldSwitchError('Cần "Cần Hợp Kim Chống Bức Xạ" để mở World 2');
      } else if (w === 3) {
        setWorldSwitchError('Cần "Cần Câu Xương Khủng Long" để mở World 3');
      }
      setTimeout(() => setWorldSwitchError(null), 3000);
    } else {
      setIsWorldMenuOpen(false);
    }
  };

  return (
    <div
      className="w-full shrink-0 bg-[#14141A] border border-white/[0.06] rounded-[16px] p-2.5 flex flex-col justify-between select-none relative"
      style={{
        boxShadow: TOKENS.shadows.innerHighlight,
      }}
    >
      {/* Top Row: Sub-view Navigation Buttons (Ghost/Secondary style with 1.5px stroke icons) */}
      <div className="grid grid-cols-4 gap-1.5 w-full">
        <button
          type="button"
          onClick={() => setActiveSubTab('shop')}
          className="h-8 px-2 rounded-[10px] bg-[#1A1A22] hover:bg-[#20202C] text-[#F5F5F7] border border-white/[0.06] cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.96] transition-all"
          title="Cửa hàng trang bị & mồi câu"
        >
          <Store className="w-3.5 h-3.5 text-[#5AC8FA] shrink-0" strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Shop</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('skillTree')}
          className="h-8 px-2 rounded-[10px] bg-[#1A1A22] hover:bg-[#20202C] text-[#F5F5F7] border border-white/[0.06] cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.96] transition-all"
          title="Cây kỹ năng Lưỡi Câu Cốt Lõi"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#BF5AF2] shrink-0" strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Kỹ năng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('library')}
          className="h-8 px-2 rounded-[10px] bg-[#1A1A22] hover:bg-[#20202C] text-[#F5F5F7] border border-white/[0.06] cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.96] transition-all"
          title="Thư viện bách khoa 84 loài cá"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#5AC8FA] shrink-0" strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Thư viện</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('customization')}
          className="h-8 px-2 rounded-[10px] bg-[#1A1A22] hover:bg-[#20202C] text-[#F5F5F7] border border-white/[0.06] cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.96] transition-all"
          title="Tùy biến giao diện đảo"
        >
          <Palette className="w-3.5 h-3.5 text-[#FF9F0A] shrink-0" strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Giao diện</span>
        </button>
      </div>

      {/* Bottom Row: Equipped Rod, Bait, and World Selector */}
      <div className="flex items-center justify-between text-[11px] text-[#8A8A94] pt-1.5">
        <div className="flex items-center gap-3 truncate max-w-[270px]">
          {/* Rod */}
          <div className="truncate flex items-center gap-1">
            <span className="text-[#8A8A94]">Cần:</span>
            <span className="font-medium text-[#F5F5F7] truncate">{rod.name}</span>
          </div>

          {/* Bait */}
          <div className="truncate flex items-center gap-1">
            <span className="text-[#8A8A94]">Mồi:</span>
            <span className="font-medium text-[#F5F5F7] truncate">
              {bait ? `${bait.name} (${baitCount})` : 'Không có'}
            </span>
          </div>
        </div>

        {/* World Selector Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsWorldMenuOpen(!isWorldMenuOpen)}
            className="px-2 py-1 rounded-[8px] bg-white/[0.06] hover:bg-white/[0.1] text-[11px] font-medium text-[#F5F5F7] border border-white/[0.06] cursor-pointer flex items-center gap-1 transition-colors"
          >
            <Globe className="w-3 h-3 text-[#5AC8FA]" strokeWidth={1.5} />
            <span>World {currentWorld}</span>
            <ChevronUp className="w-2.5 h-2.5 text-[#8A8A94]" strokeWidth={1.5} />
          </button>

          {/* World Selector Dropdown */}
          <AnimatePresence>
            {isWorldMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 bottom-8 z-30 w-52 bg-[#14141A] border border-white/[0.08] rounded-[12px] p-1 shadow-2xl space-y-0.5"
                style={{ boxShadow: TOKENS.shadows.card }}
              >
                {([1, 2, 3] as WorldId[]).map((w) => {
                  const info = WORLDS_INFO[w];
                  const isCurrent = currentWorld === w;
                  const isLocked =
                    (w === 2 && !useFishingStore.getState().ownedRodIds.includes('rod_anti_radiation')) ||
                    (w === 3 && !useFishingStore.getState().ownedRodIds.includes('rod_dinosaur_bone'));

                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => handleSelectWorld(w)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-[8px] text-[11px] transition-colors flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-[#5AC8FA]/15 text-[#5AC8FA] border border-[#5AC8FA]/30'
                          : isLocked
                          ? 'text-[#6E6E78] hover:bg-white/[0.04]'
                          : 'text-[#F5F5F7] hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{info.name}</span>
                        <span className="text-[10px] text-[#8A8A94]">
                          {info.subtitle} (×{info.priceMultiplier} vàng)
                        </span>
                      </div>
                      {isLocked && <Lock className="w-3 h-3 text-[#FF453A]" strokeWidth={1.5} />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* World Switch Error Banner */}
      <AnimatePresence>
        {worldSwitchError && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-2 right-2 -bottom-8 z-40 px-2.5 py-1 bg-[#14141A] border border-[#FF453A]/40 rounded-[8px] text-[11px] text-[#FF453A] shadow-xl text-center"
          >
            {worldSwitchError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
