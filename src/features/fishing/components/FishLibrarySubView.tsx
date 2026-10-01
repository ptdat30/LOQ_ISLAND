import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Lock,
  Star,
  X,
  Fish as FishIcon,
  Sparkles,
  Info,
  Calendar,
  Weight,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { ALL_FISH, WORLDS_INFO } from '../data/fishData';
import { getFishImageUrl } from '../data/fishImages';
import { removeVietnameseTones } from '../utils/stringUtils';
import { formatFishSize } from '../utils/sizeUtils';
import type { Fish, FishTier } from '../../../types/fishing';

// Color map for tiers exactly matching specifications
export const TIER_HEX_MAP: Record<FishTier, { hex: string; bg: string; border: string; glow?: string }> = {
  1: { hex: '#8E8E93', bg: 'bg-[#8E8E93]/20', border: 'border-[#8E8E93]/40' },
  2: { hex: '#30D158', bg: 'bg-[#30D158]/20', border: 'border-[#30D158]/40' },
  3: { hex: '#0A84FF', bg: 'bg-[#0A84FF]/20', border: 'border-[#0A84FF]/40' },
  4: { hex: '#BF5AF2', bg: 'bg-[#BF5AF2]/20', border: 'border-[#BF5AF2]/40' },
  5: { hex: '#FF9F0A', bg: 'bg-[#FF9F0A]/20', border: 'border-[#FF9F0A]/40' },
  6: { hex: '#FF3B30', bg: 'bg-[#FF3B30]/20', border: 'border-[#FF3B30]/40' },
  7: {
    hex: '#FFD60A',
    bg: 'bg-[#FFD60A]/25',
    border: 'border-[#FFD60A]/60',
    glow: '0 0 20px rgba(255, 214, 10, 0.7)',
  },
};

const BASE_ODDS_PER_SPECIES: Record<FishTier, string> = {
  1: '17.5%',
  2: '5.5%',
  3: '1.5%',
  4: '0.375%',
  5: '0.1%',
  6: '0.0225%',
  7: '0.01%',
};

export const FishLibrarySubView: React.FC = () => {
  const setActiveSubTab = useFishingStore((s) => s.setActiveSubTab);
  const fishCollection = useFishingStore((s) => s.fishCollection);
  const activeAvatarId = useFishingStore((s) => s.islandCustomization.activeFishAvatarId);
  const setFishAvatar = useFishingStore((s) => s.setFishAvatar);

  // Filters & Search
  const [selectedWorld, setSelectedWorld] = useState<number | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<FishTier | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [sortOption, setSortOption] = useState<'firstCaught' | 'catchCount' | 'recordSize' | 'name'>('firstCaught');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Fish for Detail Panel (Slide-over)
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);

  // Overall Collection Progress
  const totalCount = ALL_FISH.length; // 84
  const unlockedEntries = useMemo(() => {
    return Object.values(fishCollection).filter((item) => item.status === 'unlocked');
  }, [fishCollection]);

  const unlockedCount = unlockedEntries.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // Filtered and Sorted Fish List
  const filteredFish = useMemo(() => {
    const rawSearch = removeVietnameseTones(searchQuery);

    return ALL_FISH.filter((fish) => {
      // World Filter
      if (selectedWorld !== 'all' && fish.world !== selectedWorld) return false;

      // Tier Filter
      if (selectedTier !== 'all' && fish.tier !== selectedTier) return false;

      // Status Filter
      const entry = fishCollection[fish.id];
      const isUnlocked = entry && entry.status === 'unlocked';
      if (statusFilter === 'unlocked' && !isUnlocked) return false;
      if (statusFilter === 'locked' && isUnlocked) return false;

      // Search Query
      if (rawSearch) {
        const cleanName = removeVietnameseTones(fish.name);
        if (!cleanName.includes(rawSearch)) return false;
      }

      return true;
    }).sort((a, b) => {
      const entryA = fishCollection[a.id];
      const entryB = fishCollection[b.id];

      if (sortOption === 'catchCount') {
        return (entryB?.catchCount || 0) - (entryA?.catchCount || 0);
      }
      if (sortOption === 'recordSize') {
        return (entryB?.recordSize || 0) - (entryA?.recordSize || 0);
      }
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Default: First caught date desc, then tier desc
      const dateA = entryA?.firstCaughtAt || 0;
      const dateB = entryB?.firstCaughtAt || 0;
      if (dateA !== dateB) return dateB - dateA;
      return b.tier - a.tier;
    });
  }, [searchQuery, selectedWorld, selectedTier, statusFilter, sortOption, fishCollection]);

  const getHintForFish = (fish: Fish) => {
    if (fish.tier === 7) {
      return `Boss tối thượng của World ${fish.world}. Sử dụng "Mồi Thức Tỉnh Thủy Quái" để ép tỉ lệ xuất hiện lên 100%!`;
    }
    if (fish.tier >= 5) {
      return `Cá cực hiếm ở World ${fish.world}. Nên dùng "Mồi Vàng Ròng" và nâng cấp "Lưỡi Câu Cốt Lõi" để tăng cơ hội!`;
    }
    if (fish.tier === 4) {
      return `Xuất hiện tại World ${fish.world}. Cần nâng cấp Cần câu và dùng mồi cao cấp để tăng tỉ lệ cắn câu.`;
    }
    if (fish.world === 2) {
      return `Sinh sống tại Vùng Nước Phóng Xạ (World 2). Nên dùng "Mồi Máu Dạ Quang".`;
    }
    if (fish.world === 3) {
      return `Sinh vật tiền sử Kỷ Jura (World 3). Nên dùng "Mồi Hóa Thạch Hổ Phách".`;
    }
    return `Sinh sống tại Ao Hồ Đại Dương (World 1). Thử dùng "Mồi Bắp Ngọt" để tăng cơ hội.`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none relative text-white overflow-hidden">
      {/* ───────────────────────────────────────────────────────── */}
      {/* PHẦN 1: HEADER (Cao ~50px) */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 shrink-0">
        <button
          type="button"
          onClick={() => setActiveSubTab('fishing')}
          className="flex items-center gap-1 text-[11px] font-medium text-white/70 hover:text-white hover:bg-white/10 px-2 py-1 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Quay lại</span>
        </button>

        <h2 className="text-[14px] font-bold tracking-wider uppercase text-white/95">
          THƯ VIỆN CÁ
        </h2>

        <div className="flex items-center gap-1.5">
          <span
            className="text-[12px] font-semibold tabular-nums px-2 py-0.5 rounded-full border"
            style={{
              color: progressPercent === 100 ? '#FFD60A' : '#0A84FF',
              borderColor: progressPercent === 100 ? 'rgba(255, 214, 10, 0.4)' : 'rgba(10, 132, 255, 0.4)',
              backgroundColor: progressPercent === 100 ? 'rgba(255, 214, 10, 0.1)' : 'rgba(10, 132, 255, 0.1)',
            }}
          >
            {unlockedCount}/{totalCount} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* PHẦN 2: FILTER & SEARCH BAR (Cao ~40px) */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="px-3 py-1.5 flex items-center gap-1.5 shrink-0 bg-white/[0.02] border-b border-white/5 text-[11px]">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-3 h-3 absolute left-2 top-2 text-white/40" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Tìm kiếm cá..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-lg pl-7 pr-2 py-1 text-[11px] text-white placeholder-white/40 focus:outline-none focus:border-sky-400 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-1.5 top-1.5 text-white/40 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* World Dropdown */}
        <div className="relative">
          <select
            value={selectedWorld}
            onChange={(e) => setSelectedWorld(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/90 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-neutral-900 text-white">Tất cả World</option>
            <option value="1" className="bg-neutral-900 text-white">World 1</option>
            <option value="2" className="bg-neutral-900 text-white">World 2</option>
            <option value="3" className="bg-neutral-900 text-white">World 3</option>
          </select>
        </div>

        {/* Tier Dropdown */}
        <div className="relative">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value === 'all' ? 'all' : (Number(e.target.value) as FishTier))}
            className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/90 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-neutral-900 text-white">Tất cả Tier</option>
            {[1, 2, 3, 4, 5, 6, 7].map((t) => (
              <option key={t} value={t} className="bg-neutral-900 text-white">
                Tier {t}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/90 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-neutral-900 text-white">Tất cả</option>
            <option value="unlocked" className="bg-neutral-900 text-white">Đã có</option>
            <option value="locked" className="bg-neutral-900 text-white">Chưa có</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/90 focus:outline-none cursor-pointer"
          >
            <option value="firstCaught" className="bg-neutral-900 text-white">Gần đây</option>
            <option value="catchCount" className="bg-neutral-900 text-white">Số lần câu</option>
            <option value="recordSize" className="bg-neutral-900 text-white">Kỷ lục kg</option>
            <option value="name" className="bg-neutral-900 text-white">Tên A-Z</option>
          </select>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* PHẦN 3: GRID CÁ (3 CỘT, CUỘN ĐƯỢC) */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="flex-1 p-3 overflow-y-auto no-scrollbar min-h-0">
        {filteredFish.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/40 text-[11px] gap-2">
            <FishIcon className="w-8 h-8 opacity-30" strokeWidth={1} />
            <span>Không tìm thấy loài cá nào phù hợp</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {filteredFish.map((fish, index) => {
              const entry = fishCollection[fish.id];
              const isUnlocked = entry && entry.status === 'unlocked';
              const tierColor = TIER_HEX_MAP[fish.tier];
              const isCurrentAvatar = activeAvatarId === fish.id;
              const fishImg = getFishImageUrl(fish.id);

              return (
                <motion.div
                  key={fish.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: Math.min(0.2, index * 0.015) }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFish(fish)}
                  className={`relative h-[80px] rounded-xl border p-1.5 flex flex-col items-center justify-between cursor-pointer transition-all ${
                    isUnlocked
                      ? `${tierColor.bg} ${tierColor.border} hover:border-white/40`
                      : 'bg-black/30 border-white/5 opacity-55 hover:opacity-80'
                  }`}
                  style={isUnlocked && fish.tier === 7 ? { boxShadow: tierColor.glow } : undefined}
                >
                  {/* Tier Badge (Góc phải trên) */}
                  <span
                    className="absolute top-1 right-1 px-1 py-0.2 rounded text-[8px] font-black uppercase"
                    style={{
                      color: tierColor.hex,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      border: `1px solid ${tierColor.hex}60`,
                    }}
                  >
                    T{fish.tier}
                  </span>

                  {/* World Badge (Góc trái trên) */}
                  <span className="absolute top-1 left-1 text-[8px] font-bold text-white/40">
                    W{fish.world}
                  </span>

                  {/* Avatar Active Indicator */}
                  {isCurrentAvatar && (
                    <span className="absolute -top-1.5 left-6 bg-amber-400 text-black rounded-full p-0.5 shadow-md">
                      <Star className="w-2 h-2 fill-black" />
                    </span>
                  )}

                  {/* Fish Icon (48x48) */}
                  <div className="w-10 h-10 flex items-center justify-center mt-1">
                    {fishImg ? (
                      <img
                        src={fishImg}
                        alt={isUnlocked ? fish.name : '???'}
                        className={`w-9 h-9 object-contain drop-shadow transition-transform duration-200 group-hover:scale-110 pointer-events-none ${
                          isUnlocked ? '' : 'filter brightness-0 opacity-30'
                        }`}
                        loading="lazy"
                      />
                    ) : isUnlocked ? (
                      <FishIcon
                        className="w-8 h-8 transition-transform group-hover:scale-110"
                        style={{ color: tierColor.hex }}
                        strokeWidth={1.5}
                      />
                    ) : (
                      <FishIcon
                        className="w-7 h-7 text-white/30 filter brightness-0 opacity-40"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>

                  {/* Fish Name (12px Truncate) */}
                  <span className="text-[10px] font-medium text-white/90 truncate w-full text-center leading-tight">
                    {isUnlocked ? fish.name : '???'}
                  </span>

                  {/* Bottom Right: Catch count or Lock */}
                  {isUnlocked ? (
                    <span className="absolute bottom-1 right-1 text-[9px] font-bold text-amber-300 bg-black/50 px-1 rounded">
                      ×{entry.catchCount}
                    </span>
                  ) : (
                    <Lock className="w-2.5 h-2.5 absolute bottom-1 right-1 text-white/40" strokeWidth={1.5} />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* PHẦN 4: FOOTER (Cao ~25px) */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="px-3 py-1.5 border-t border-white/10 shrink-0 flex items-center justify-between bg-black/20 text-[10px] text-white/60">
        <span className="tabular-nums">
          Đã sưu tầm <strong className="text-white">{unlockedCount}</strong>/{totalCount} loài cá
        </span>

        {/* Mini Progress Bar */}
        <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden flex items-center">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: progressPercent === 100 ? '#FFD60A' : '#0A84FF',
            }}
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* DETAIL PANEL (Slide-over Sheet từ phải sang) */}
      {/* ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedFish && (
          <div className="absolute inset-0 z-40 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFish(null)}
              className="flex-1 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Slide Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="w-[280px] h-full bg-neutral-950/95 border-l border-white/15 p-3 flex flex-col justify-between shadow-2xl overflow-y-auto no-scrollbar"
            >
              {(() => {
                const fish = selectedFish;
                const entry = fishCollection[fish.id];
                const isUnlocked = entry && entry.status === 'unlocked';
                const tierColor = TIER_HEX_MAP[fish.tier];
                const worldInfo = WORLDS_INFO[fish.world];
                const isCurrentAvatar = activeAvatarId === fish.id;

                return (
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Close Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                          Chi Tiết Sinh Vật
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedFish(null)}
                          className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Icon Big 96x96 */}
                      <div className="flex flex-col items-center my-3">
                        <div
                          className={`w-20 h-20 rounded-2xl flex items-center justify-center border shadow-xl p-1 overflow-hidden ${
                            isUnlocked ? `${tierColor.bg} ${tierColor.border}` : 'bg-black/40 border-white/10'
                          }`}
                          style={isUnlocked ? { boxShadow: tierColor.glow } : undefined}
                        >
                          {getFishImageUrl(selectedFish.id) ? (
                            <img
                              src={getFishImageUrl(selectedFish.id)}
                              alt={isUnlocked ? selectedFish.name : '???'}
                              className={`w-16 h-16 object-contain drop-shadow-xl ${
                                isUnlocked ? '' : 'filter brightness-0 opacity-30'
                              }`}
                            />
                          ) : isUnlocked ? (
                            <FishIcon className="w-12 h-12" style={{ color: tierColor.hex }} strokeWidth={1.5} />
                          ) : (
                            <FishIcon className="w-10 h-10 text-white/30 filter brightness-0 opacity-30" strokeWidth={1.5} />
                          )}
                        </div>

                        {/* Name & Badges */}
                        <h3 className="text-[15px] font-bold text-white text-center mt-2 leading-tight">
                          {isUnlocked ? fish.name : '???'}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="text-[9px] font-black px-1.5 py-0.5 rounded border uppercase"
                            style={{
                              color: tierColor.hex,
                              borderColor: `${tierColor.hex}60`,
                              backgroundColor: `${tierColor.hex}15`,
                            }}
                          >
                            Tier {fish.tier}
                          </span>
                          <span className="text-[9px] font-medium text-white/60 px-1.5 py-0.5 rounded bg-white/10">
                            {worldInfo.name}
                          </span>
                        </div>
                      </div>

                      {/* Details Info List */}
                      <div className="space-y-1.5 text-[11px] bg-white/[0.03] border border-white/5 p-2.5 rounded-xl">
                        {isUnlocked ? (
                          <>
                            <div className="flex items-center justify-between py-0.5">
                              <span className="text-white/50 flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-amber-400" />
                                Giá cơ bản:
                              </span>
                              <strong className="text-amber-300 font-semibold tabular-nums">
                                {fish.basePrice.toLocaleString()} vàng
                              </strong>
                            </div>

                            <div className="flex items-center justify-between py-0.5">
                              <span className="text-white/50 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-sky-400" />
                                Tỉ lệ gốc:
                              </span>
                              <span className="text-white/90 font-medium tabular-nums">
                                {BASE_ODDS_PER_SPECIES[fish.tier]}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-0.5">
                              <span className="text-white/50 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                Đã câu được:
                              </span>
                              <strong className="text-white tabular-nums">
                                {entry.catchCount.toLocaleString()} con
                              </strong>
                            </div>

                            <div className="flex items-center justify-between py-0.5">
                              <span className="text-white/50 flex items-center gap-1">
                                <Weight className="w-3 h-3 text-emerald-400" />
                                Kỷ lục:
                              </span>
                              <strong className="text-emerald-300 font-semibold tabular-nums">
                                {formatFishSize(entry.recordSize)}
                              </strong>
                            </div>

                            <div className="flex items-center justify-between py-0.5">
                              <span className="text-white/50 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-white/40" />
                                Lần đầu câu:
                              </span>
                              <span className="text-white/80 text-[10px] tabular-nums">
                                {entry.firstCaughtAt
                                  ? new Date(entry.firstCaughtAt).toLocaleDateString('vi-VN')
                                  : 'Chưa rõ'}
                              </span>
                            </div>

                            {fish.description && (
                              <p className="text-[10px] text-white/50 pt-1 border-t border-white/5 italic">
                                "{fish.description}"
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                              <Lock className="w-3 h-3" />
                              <span>Chưa câu được loài này</span>
                            </div>
                            <div className="flex items-center justify-between py-0.5">
                              <span className="text-white/50">Tỉ lệ rớt gốc:</span>
                              <span className="text-white/80 tabular-nums">
                                {BASE_ODDS_PER_SPECIES[fish.tier]}
                              </span>
                            </div>
                            <div className="text-[10px] text-amber-200/80 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg leading-relaxed flex items-start gap-1 mt-2">
                              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{getHintForFish(fish)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
                      {isUnlocked && fish.tier >= 5 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (isCurrentAvatar) {
                              setFishAvatar(null); // Reset to default
                            } else {
                              setFishAvatar(fish.id);
                            }
                          }}
                          className={`w-full py-1.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isCurrentAvatar
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-rose-500/20 hover:text-rose-200'
                              : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold hover:brightness-110'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" fill={isCurrentAvatar ? '#FFD60A' : 'none'} />
                          <span>{isCurrentAvatar ? '⭐ Đang dùng (Bấm để gỡ)' : 'Chọn làm Avatar Island'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedFish(null)}
                        className="w-full py-1 rounded-lg text-[11px] text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
