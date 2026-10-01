import React, { useState, useMemo, useEffect } from 'react';
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
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { ALL_FISH, WORLDS_INFO } from '../data/fishData';
import { getFishImageUrl } from '../data/fishImages';
import { removeVietnameseTones } from '../utils/stringUtils';
import { formatFishSize } from '../utils/sizeUtils';
import type { Fish, FishTier } from '../../../types/fishing';

// Color map for tiers exactly matching specifications
export const TIER_HEX_MAP: Record<FishTier, { hex: string; bg: string; border: string; glow?: string; name: string }> = {
  1: { hex: '#8E8E93', bg: 'bg-[#8E8E93]/20', border: 'border-[#8E8E93]/40', name: 'Phổ Thông' },
  2: { hex: '#30D158', bg: 'bg-[#30D158]/20', border: 'border-[#30D158]/40', name: 'Hiếm' },
  3: { hex: '#0A84FF', bg: 'bg-[#0A84FF]/20', border: 'border-[#0A84FF]/40', name: 'Đặc Sắc' },
  4: { hex: '#BF5AF2', bg: 'bg-[#BF5AF2]/20', border: 'border-[#BF5AF2]/40', name: 'Sử Thi' },
  5: { hex: '#FF9F0A', bg: 'bg-[#FF9F0A]/20', border: 'border-[#FF9F0A]/40', glow: '0 0 20px rgba(255, 159, 10, 0.5)', name: 'Huyền Thoại' },
  6: { hex: '#FF3B30', bg: 'bg-[#FF3B30]/20', border: 'border-[#FF3B30]/40', glow: '0 0 25px rgba(255, 59, 48, 0.6)', name: 'Thần Thoại' },
  7: {
    hex: '#FFD60A',
    bg: 'bg-[#FFD60A]/25',
    border: 'border-[#FFD60A]/60',
    glow: '0 0 30px rgba(255, 214, 10, 0.8)',
    name: 'Boss Độc Tôn',
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

  const isLibraryEnlarged = useFishingStore((s) => s.isLibraryEnlarged);
  const toggleLibraryEnlarged = useFishingStore((s) => s.toggleLibraryEnlarged);
  const inspectingFishId = useFishingStore((s) => s.inspectingFishId);
  const inspectFish = useFishingStore((s) => s.inspectFish);

  // Filters & Search
  const [selectedWorld, setSelectedWorld] = useState<number | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<FishTier | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [sortOption, setSortOption] = useState<'firstCaught' | 'catchCount' | 'recordSize' | 'name'>('firstCaught');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Fish for Detail Panel / Modal
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);

  // Synchronize with inspectingFishId from store (e.g., when clicked from basket)
  useEffect(() => {
    if (inspectingFishId) {
      const match = ALL_FISH.find((f) => f.id === inspectingFishId);
      if (match) {
        setSelectedFish(match);
      }
    }
  }, [inspectingFishId]);

  const handleCloseDetail = () => {
    setSelectedFish(null);
    inspectFish(null);
  };

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

  // Carousel navigation
  const currentFishIndex = useMemo(() => {
    if (!selectedFish) return -1;
    return filteredFish.findIndex((f) => f.id === selectedFish.id);
  }, [selectedFish, filteredFish]);

  const handlePrevFish = () => {
    if (currentFishIndex > 0) {
      setSelectedFish(filteredFish[currentFishIndex - 1]);
    } else if (filteredFish.length > 0) {
      setSelectedFish(filteredFish[filteredFish.length - 1]);
    }
  };

  const handleNextFish = () => {
    if (currentFishIndex >= 0 && currentFishIndex < filteredFish.length - 1) {
      setSelectedFish(filteredFish[currentFishIndex + 1]);
    } else if (filteredFish.length > 0) {
      setSelectedFish(filteredFish[0]);
    }
  };

  // Keyboard navigation when detail is open
  useEffect(() => {
    if (!selectedFish) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseDetail();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevFish();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextFish();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFish, filteredFish, currentFishIndex]);

  const getHintForFish = (fish: Fish) => {
    if (fish.tier === 7) {
      return `Boss tối thượng của World ${fish.world}. Dùng "Mồi Thức Tỉnh Thủy Quái" để ép tỉ lệ xuất hiện lên 100%!`;
    }
    if (fish.tier >= 5) {
      return `Cá cực hiếm ở World ${fish.world}. Nên dùng "Mồi Vàng Ròng" và nâng cấp "Lưỡi Câu Cốt Lõi" để tăng cơ hội!`;
    }
    if (fish.tier === 4) {
      return `Xuất hiện tại World ${fish.world}. Nâng cấp Cần câu và dùng mồi cao cấp để tăng tỉ lệ cắn câu.`;
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
      {/* PHẦN 1: HEADER (Cao ~48px) */}
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

        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-bold tracking-wider uppercase text-white/95">
            THƯ VIỆN CÁ
          </h2>
          <span
            className="text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full border"
            style={{
              color: progressPercent === 100 ? '#FFD60A' : '#0A84FF',
              borderColor: progressPercent === 100 ? 'rgba(255, 214, 10, 0.4)' : 'rgba(10, 132, 255, 0.4)',
              backgroundColor: progressPercent === 100 ? 'rgba(255, 214, 10, 0.1)' : 'rgba(10, 132, 255, 0.1)',
            }}
          >
            {unlockedCount}/{totalCount} ({progressPercent}%)
          </span>
        </div>

        {/* Toggle Mở Rộng / Thu Nhỏ */}
        <button
          type="button"
          onClick={toggleLibraryEnlarged}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer border ${
            isLibraryEnlarged
              ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 hover:bg-sky-500/30'
              : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
          }`}
          title={isLibraryEnlarged ? 'Thu nhỏ giao diện (Về 420px)' : 'Mở rộng to ra để đọc chữ & ngắm cá (Lên 630px)'}
        >
          {isLibraryEnlarged ? (
            <>
              <Minimize2 className="w-3 h-3 text-sky-300" strokeWidth={1.5} />
              <span className="leading-none">Thu nhỏ</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3 h-3 text-sky-400" strokeWidth={1.5} />
              <span className="leading-none">Mở rộng</span>
            </>
          )}
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* PHẦN 2: FILTER & SEARCH BAR */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="px-3 py-1.5 flex items-center gap-1.5 shrink-0 bg-white/[0.02] border-b border-white/5 text-[11px] overflow-x-auto no-scrollbar">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[110px]">
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
        <select
          value={selectedWorld}
          onChange={(e) => setSelectedWorld(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/90 focus:outline-none cursor-pointer shrink-0"
        >
          <option value="all" className="bg-neutral-900 text-white">Tất cả World</option>
          <option value="1" className="bg-neutral-900 text-white">World 1</option>
          <option value="2" className="bg-neutral-900 text-white">World 2</option>
          <option value="3" className="bg-neutral-900 text-white">World 3</option>
        </select>

        {/* Tier Dropdown */}
        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value === 'all' ? 'all' : (Number(e.target.value) as FishTier))}
          className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/90 focus:outline-none cursor-pointer shrink-0"
        >
          <option value="all" className="bg-neutral-900 text-white">Tất cả Tier</option>
          {[1, 2, 3, 4, 5, 6, 7].map((t) => (
            <option key={t} value={t} className="bg-neutral-900 text-white">
              Tier {t}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/90 focus:outline-none cursor-pointer shrink-0"
        >
          <option value="all" className="bg-neutral-900 text-white">Tất cả</option>
          <option value="unlocked" className="bg-neutral-900 text-white">Đã có</option>
          <option value="locked" className="bg-neutral-900 text-white">Chưa có</option>
        </select>

        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as any)}
          className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/90 focus:outline-none cursor-pointer shrink-0"
        >
          <option value="firstCaught" className="bg-neutral-900 text-white">Gần đây</option>
          <option value="catchCount" className="bg-neutral-900 text-white">Số lần câu</option>
          <option value="recordSize" className="bg-neutral-900 text-white">Kỷ lục kg</option>
          <option value="name" className="bg-neutral-900 text-white">Tên A-Z</option>
        </select>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* PHẦN 3: GRID CÁ (ADAPTIVE 3 CỘT HOẶC 4-5 CỘT KHI MỞ RỘNG) */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="flex-1 p-3 overflow-y-auto no-scrollbar min-h-0">
        {filteredFish.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/40 text-[11px] gap-2">
            <FishIcon className="w-8 h-8 opacity-30" strokeWidth={1} />
            <span>Không tìm thấy loài cá nào phù hợp</span>
          </div>
        ) : (
          <div
            className={`grid transition-all duration-300 ${
              isLibraryEnlarged ? 'grid-cols-4 sm:grid-cols-5 gap-3' : 'grid-cols-3 gap-2.5'
            }`}
          >
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
                  className={`relative rounded-2xl border flex flex-col items-center justify-between cursor-pointer transition-all ${
                    isLibraryEnlarged ? 'h-[92px] p-2' : 'h-[80px] p-1.5'
                  } ${
                    isUnlocked
                      ? `${tierColor.bg} ${tierColor.border} hover:border-white/50 shadow-sm`
                      : 'bg-black/30 border-white/5 opacity-55 hover:opacity-85'
                  }`}
                  style={isUnlocked && fish.tier === 7 ? { boxShadow: tierColor.glow } : undefined}
                >
                  {/* Tier Badge (Góc phải trên) */}
                  <span
                    className="absolute top-1 right-1 px-1 py-0.2 rounded text-[8px] font-black uppercase"
                    style={{
                      color: tierColor.hex,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      border: `1px solid ${tierColor.hex}60`,
                    }}
                  >
                    T{fish.tier}
                  </span>

                  {/* World Badge (Góc trái trên) */}
                  <span className="absolute top-1 left-1.5 text-[8px] font-bold text-white/50">
                    W{fish.world}
                  </span>

                  {/* Avatar Active Indicator */}
                  {isCurrentAvatar && (
                    <span className="absolute -top-1.5 left-7 bg-amber-400 text-black rounded-full p-0.5 shadow-md">
                      <Star className="w-2 h-2 fill-black" />
                    </span>
                  )}

                  {/* Fish Artwork Sprite */}
                  <div
                    className={`flex items-center justify-center mt-1 ${
                      isLibraryEnlarged ? 'w-12 h-12' : 'w-10 h-10'
                    }`}
                  >
                    {fishImg ? (
                      <img
                        src={fishImg}
                        alt={isUnlocked ? fish.name : '???'}
                        className={`object-contain drop-shadow transition-transform duration-200 pointer-events-none ${
                          isLibraryEnlarged ? 'w-11 h-11' : 'w-9 h-9'
                        } ${isUnlocked ? '' : 'filter brightness-0 opacity-30'}`}
                        loading="lazy"
                      />
                    ) : isUnlocked ? (
                      <FishIcon
                        className={isLibraryEnlarged ? 'w-9 h-9' : 'w-8 h-8'}
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

                  {/* Fish Name */}
                  <span
                    className={`font-semibold text-white/90 truncate w-full text-center leading-tight ${
                      isLibraryEnlarged ? 'text-[11px]' : 'text-[10px]'
                    }`}
                  >
                    {isUnlocked ? fish.name : '???'}
                  </span>

                  {/* Bottom Right: Catch count or Lock */}
                  {isUnlocked ? (
                    <span className="absolute bottom-1 right-1 text-[9px] font-bold text-amber-300 bg-black/60 px-1 rounded">
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
        <div className="w-36 h-1.5 bg-white/10 rounded-full overflow-hidden flex items-center">
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
      {/* DETAIL MODAL / INSPECTOR (HỖ TRỢ PHÓNG TO TOÀN DIỆN) */}
      {/* ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedFish && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-2">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetail}
              className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
            />

            {/* Inspector Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className={`relative z-10 w-full rounded-3xl bg-neutral-950/98 border border-white/20 p-4 shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-2xl ${
                isLibraryEnlarged ? 'max-w-[580px] h-[460px]' : 'max-w-[380px] h-[350px]'
              }`}
            >
              {(() => {
                const fish = selectedFish;
                const entry = fishCollection[fish.id];
                const isUnlocked = entry && entry.status === 'unlocked';
                const tierColor = TIER_HEX_MAP[fish.tier];
                const worldInfo = WORLDS_INFO[fish.world];
                const isCurrentAvatar = activeAvatarId === fish.id;

                return (
                  <div className="flex flex-col h-full justify-between gap-2 overflow-hidden">
                    {/* Header: Navigation & Action Controls */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
                      {/* Left: Carousel Nav */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePrevFish}
                          className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-0.5 text-[10px]"
                          title="Cá phía trước (Phím mũi tên trái)"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Trước</span>
                        </button>
                        <span className="text-[10px] font-bold text-white/40 tabular-nums px-1">
                          {currentFishIndex >= 0 ? `${currentFishIndex + 1}/${filteredFish.length}` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextFish}
                          className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-0.5 text-[10px]"
                          title="Cá kế tiếp (Phím mũi tên phải)"
                        >
                          <span>Sau</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Right: Expand Toggle & Close */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={toggleLibraryEnlarged}
                          className={`p-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold border ${
                            isLibraryEnlarged
                              ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                              : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
                          }`}
                          title={isLibraryEnlarged ? 'Thu nhỏ giao diện' : 'Phóng to để đọc chữ to hơn & xem cá'}
                        >
                          {isLibraryEnlarged ? (
                            <>
                              <Minimize2 className="w-3 h-3 text-sky-300" strokeWidth={1.5} />
                              <span>Thu nhỏ</span>
                            </>
                          ) : (
                            <>
                              <Maximize2 className="w-3 h-3 text-sky-400" strokeWidth={1.5} />
                              <span>Phóng to</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleCloseDetail}
                          className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Đóng (Phím Escape)"
                        >
                          <X className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    {/* Main Content Body */}
                    <div className="flex-1 overflow-y-auto no-scrollbar py-1">
                      {isLibraryEnlarged ? (
                        /* 2-COLUMN EXPANDED LAYOUT */
                        <div className="grid grid-cols-[180px_1fr] gap-4 h-full items-start">
                          {/* Left Column: Big Art Showcase & Badges */}
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className={`w-36 h-36 rounded-3xl flex items-center justify-center border shadow-2xl p-2 relative overflow-hidden ${
                                isUnlocked
                                  ? `${tierColor.bg} ${tierColor.border}`
                                  : 'bg-black/50 border-white/10'
                              }`}
                              style={isUnlocked ? { boxShadow: tierColor.glow } : undefined}
                            >
                              {getFishImageUrl(selectedFish.id) ? (
                                <motion.img
                                  src={getFishImageUrl(selectedFish.id)}
                                  alt={isUnlocked ? selectedFish.name : '???'}
                                  animate={isUnlocked ? { y: [0, -5, 0] } : undefined}
                                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                  className={`w-28 h-28 object-contain drop-shadow-2xl ${
                                    isUnlocked ? '' : 'filter brightness-0 opacity-25'
                                  }`}
                                />
                              ) : isUnlocked ? (
                                <FishIcon className="w-20 h-20" style={{ color: tierColor.hex }} strokeWidth={1.5} />
                              ) : (
                                <FishIcon className="w-16 h-16 text-white/20 filter brightness-0 opacity-25" strokeWidth={1.5} />
                              )}
                            </div>

                            {/* Tier & World Pill */}
                            <div className="flex flex-col items-center gap-1 w-full">
                              <span
                                className="text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider"
                                style={{
                                  color: tierColor.hex,
                                  borderColor: `${tierColor.hex}60`,
                                  backgroundColor: `${tierColor.hex}20`,
                                }}
                              >
                                TIER {fish.tier} • {tierColor.name.toUpperCase()}
                              </span>
                              <span className="text-[10px] font-medium text-white/70 px-2 py-0.5 rounded-md bg-white/10">
                                🌍 {worldInfo.name}
                              </span>
                            </div>

                            {/* Avatar Island Button */}
                            {isUnlocked && fish.tier >= 5 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (isCurrentAvatar) {
                                    setFishAvatar(null);
                                  } else {
                                    setFishAvatar(fish.id);
                                  }
                                }}
                                className={`w-full py-1.5 mt-1 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                                  isCurrentAvatar
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-rose-500/20 hover:text-rose-200'
                                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold hover:brightness-110'
                                }`}
                              >
                                <Star className="w-3.5 h-3.5" fill={isCurrentAvatar ? '#FFD60A' : 'none'} />
                                <span>{isCurrentAvatar ? '⭐ Đang dùng làm Avatar' : 'Chọn làm Avatar Island'}</span>
                              </button>
                            )}
                          </div>

                          {/* Right Column: Title, Lore & Stats */}
                          <div className="flex flex-col gap-2.5">
                            <div>
                              <h3 className="text-xl font-black text-white leading-tight">
                                {isUnlocked ? fish.name : '??? (Chưa phát hiện)'}
                              </h3>
                              <span className="text-[10px] text-white/50">Mã định danh: #{fish.id}</span>
                            </div>

                            {/* Biological Lore / Description */}
                            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3">
                              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1">
                                Tập Tính & Đặc Điểm Sinh Học
                              </span>
                              {isUnlocked ? (
                                <p className="text-[13px] leading-relaxed text-white/95 italic">
                                  "{fish.description || 'Chưa có ghi chép chi tiết về loài cá này.'}"
                                </p>
                              ) : (
                                <p className="text-[12px] leading-relaxed text-rose-300/80 italic flex items-center gap-1.5">
                                  <Lock className="w-4 h-4 shrink-0 text-rose-400" />
                                  <span>Loài cá này chưa được ghi nhận trong bách khoa toàn thư. Hãy tiếp tục câu cá hoặc dùng mồi chuyên dụng để phát hiện!</span>
                                </p>
                              )}
                            </div>

                            {/* Detailed Stats Grid */}
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              <div className="bg-white/[0.03] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                                <span className="text-white/50 flex items-center gap-1">
                                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                                  Giá bán cơ bản:
                                </span>
                                <strong className="text-amber-300 font-bold tabular-nums">
                                  +{fish.basePrice.toLocaleString()} vàng
                                </strong>
                              </div>

                              <div className="bg-white/[0.03] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                                <span className="text-white/50 flex items-center gap-1">
                                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                                  Tỉ lệ xuất hiện:
                                </span>
                                <strong className="text-sky-300 font-bold tabular-nums">
                                  {BASE_ODDS_PER_SPECIES[fish.tier]}
                                </strong>
                              </div>

                              {isUnlocked && (
                                <>
                                  <div className="bg-white/[0.03] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                                    <span className="text-white/50 flex items-center gap-1">
                                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                      Đã câu được:
                                    </span>
                                    <strong className="text-white font-bold tabular-nums">
                                      {entry.catchCount.toLocaleString()} con
                                    </strong>
                                  </div>

                                  <div className="bg-white/[0.03] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                                    <span className="text-white/50 flex items-center gap-1">
                                      <Weight className="w-3.5 h-3.5 text-emerald-400" />
                                      Kỷ lục cá thể:
                                    </span>
                                    <strong className="text-emerald-300 font-bold tabular-nums">
                                      {formatFishSize(entry.recordSize)}
                                    </strong>
                                  </div>

                                  <div className="bg-white/[0.03] border border-white/5 p-2 rounded-xl col-span-2 flex items-center justify-between">
                                    <span className="text-white/50 flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5 text-white/40" />
                                      Lần đầu bắt được:
                                    </span>
                                    <span className="text-white/90 font-medium tabular-nums">
                                      {entry.firstCaughtAt
                                        ? new Date(entry.firstCaughtAt).toLocaleString('vi-VN')
                                        : 'Chưa rõ'}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Hunting Hint */}
                            <div className="text-[11px] text-amber-200/90 bg-amber-500/10 border border-amber-500/25 p-2.5 rounded-xl leading-relaxed flex items-start gap-2">
                              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-amber-300 block mb-0.5">Bí Kíp Săn Bắt:</span>
                                <span>{getHintForFish(fish)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* COMPACT 1-COLUMN LAYOUT WITH PROMINENT ZOOM TRIGGER */
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg shrink-0 p-1 ${
                                isUnlocked ? `${tierColor.bg} ${tierColor.border}` : 'bg-black/50 border-white/10'
                              }`}
                            >
                              {getFishImageUrl(selectedFish.id) ? (
                                <img
                                  src={getFishImageUrl(selectedFish.id)}
                                  alt={isUnlocked ? selectedFish.name : '???'}
                                  className={`w-14 h-14 object-contain drop-shadow ${
                                    isUnlocked ? '' : 'filter brightness-0 opacity-25'
                                  }`}
                                />
                              ) : (
                                <FishIcon className="w-10 h-10" style={{ color: tierColor.hex }} />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-white truncate leading-tight">
                                {isUnlocked ? fish.name : '???'}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                  className="text-[9px] font-black px-1.5 py-0.2 rounded border uppercase"
                                  style={{
                                    color: tierColor.hex,
                                    borderColor: `${tierColor.hex}60`,
                                    backgroundColor: `${tierColor.hex}15`,
                                  }}
                                >
                                  Tier {fish.tier}
                                </span>
                                <span className="text-[9px] font-medium text-white/60 px-1.5 py-0.2 rounded bg-white/10">
                                  {worldInfo.name}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Description Lore */}
                          {isUnlocked && fish.description && (
                            <p className="text-[11px] leading-relaxed text-white/80 italic bg-white/[0.03] p-2 rounded-xl border border-white/5">
                              "{fish.description}"
                            </p>
                          )}

                          {/* Compact Stats */}
                          <div className="space-y-1 text-[11px] bg-white/[0.03] p-2 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between">
                              <span className="text-white/50">Giá cơ bản:</span>
                              <strong className="text-amber-300 font-semibold">{fish.basePrice.toLocaleString()} vàng</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/50">Tỉ lệ xuất hiện:</span>
                              <span className="text-white/90">{BASE_ODDS_PER_SPECIES[fish.tier]}</span>
                            </div>
                            {isUnlocked && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-white/50">Đã câu:</span>
                                  <strong className="text-white">{entry.catchCount} con</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-white/50">Kỷ lục cá nhân:</span>
                                  <strong className="text-emerald-300">{formatFishSize(entry.recordSize)}</strong>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Hint */}
                          <div className="text-[10px] text-amber-200/90 bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl leading-relaxed flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{getHintForFish(fish)}</span>
                          </div>

                          {/* Zoom Prompter Button */}
                          <button
                            type="button"
                            onClick={toggleLibraryEnlarged}
                            className="w-full py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          >
                            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                            <span>Mở rộng to ra để đọc chữ & xem cá</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer Close Button */}
                    <div className="pt-2 border-t border-white/10 shrink-0">
                      <button
                        type="button"
                        onClick={handleCloseDetail}
                        className="w-full py-1.5 rounded-xl text-[11px] font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center"
                      >
                        Đóng chi tiết
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
