import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Gem,
  Dna,
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
import type { WorldId } from '../../../types/fishing';

export const PlayerStatus: React.FC = () => {
  const gold = useFishingStore((s) => s.gold);
  const diamonds = useFishingStore((s) => s.diamonds);
  const mutationPoints = useFishingStore((s) => s.mutationPoints);
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
        setWorldSwitchError('Cần "Cần Hợp Kim Chống Bức Xạ" để vào World 2!');
      } else if (w === 3) {
        setWorldSwitchError('Cần "Cần Câu Xương Khủng Long" để vào World 3!');
      }
      setTimeout(() => setWorldSwitchError(null), 3000);
    } else {
      setIsWorldMenuOpen(false);
    }
  };

  return (
    <div className="w-full shrink-0 bg-white/[0.03] border border-white/10 rounded-2xl p-2.5 flex flex-col gap-2 select-none relative">
      {/* Top Row: Currencies (Gold, Diamonds, Mutation Points) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Gold */}
          <div className="flex items-center gap-1.5" title="Vàng kiếm được">
            <Coins className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
            <span className="text-[12px] font-bold text-amber-300 tabular-nums">
              {gold.toLocaleString()}
            </span>
          </div>

          {/* Diamonds */}
          <div className="flex items-center gap-1.5" title="Kim Cương cao cấp">
            <Gem className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
            <span className="text-[12px] font-bold text-sky-300 tabular-nums">
              {diamonds.toLocaleString()}
            </span>
          </div>

          {/* Mutation Points */}
          <div className="flex items-center gap-1.5" title="Điểm Đột Biến (nâng cấp Lưỡi Câu Cốt Lõi)">
            <Dna className="w-3.5 h-3.5 text-purple-400" strokeWidth={1.5} />
            <span className="text-[12px] font-bold text-purple-300 tabular-nums">
              {mutationPoints.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Sub-view Navigation Buttons (Shop, Skill Tree, Customization) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('shop')}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-semibold text-white/90 border border-white/10 cursor-pointer flex items-center gap-1 active:scale-95 transition-all shadow-sm"
            title="Mở Shop (Cần, Mồi, Nâng cấp, Xe)"
          >
            <Store className="w-3 h-3 text-emerald-400" strokeWidth={1.5} />
            <span>Shop</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('skillTree')}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-semibold text-white/90 border border-white/10 cursor-pointer flex items-center gap-1 active:scale-95 transition-all shadow-sm"
            title="Lưỡi Câu Cốt Lõi"
          >
            <Sparkles className="w-3 h-3 text-purple-400" strokeWidth={1.5} />
            <span>Kỹ năng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('library')}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-semibold text-white/90 border border-white/10 cursor-pointer flex items-center gap-1 active:scale-95 transition-all shadow-sm"
            title="Thư Viện Cá (Bộ Sưu Tầm 84 Loài)"
          >
            <BookOpen className="w-3 h-3 text-sky-400" strokeWidth={1.5} />
            <span>Thư viện</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('customization')}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 border border-white/10 cursor-pointer active:scale-95 transition-all shadow-sm"
            title="Tùy biến Dynamic Island"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Bottom Row: Equipped Rod, Bait, and World Selector */}
      <div className="flex items-center justify-between text-[11px] text-white/70 pt-0.5">
        <div className="flex items-center gap-3 truncate max-w-[270px]">
          {/* Rod */}
          <div className="truncate flex items-center gap-1">
            <span className="text-white/40 text-[10px]">Cần:</span>
            <span className="font-medium text-white/90 truncate">{rod.name}</span>
          </div>

          {/* Bait */}
          <div className="truncate flex items-center gap-1">
            <span className="text-white/40 text-[10px]">Mồi:</span>
            <span className="font-medium text-white/90 truncate">
              {bait ? `${bait.name} (${baitCount})` : 'Không có'}
            </span>
          </div>
        </div>

        {/* World Selector Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsWorldMenuOpen(!isWorldMenuOpen)}
            className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] font-medium text-white/90 border border-white/10 cursor-pointer flex items-center gap-1 transition-all"
          >
            <Globe className="w-3 h-3 text-sky-400" strokeWidth={1.5} />
            <span>World {currentWorld}</span>
            <ChevronUp className="w-2.5 h-2.5 text-white/50" strokeWidth={1.5} />
          </button>

          {/* World Selector Dropdown */}
          <AnimatePresence>
            {isWorldMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute right-0 bottom-7 z-30 w-48 bg-black/95 border border-white/20 backdrop-blur-2xl rounded-xl p-1 shadow-2xl space-y-0.5"
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
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] transition-colors flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : isLocked
                          ? 'text-white/40 hover:bg-white/5'
                          : 'text-white/80 hover:bg-white/15'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{info.name}</span>
                        <span className="text-[9px] text-white/50">
                          {info.subtitle} (×{info.priceMultiplier} vàng)
                        </span>
                      </div>
                      {isLocked && <Lock className="w-3 h-3 text-rose-400/80" strokeWidth={1.5} />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* World switch requirement notification */}
      <AnimatePresence>
        {worldSwitchError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] font-medium text-rose-300 bg-rose-500/20 border border-rose-500/30 rounded-lg px-2 py-0.5"
          >
            {worldSwitchError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
