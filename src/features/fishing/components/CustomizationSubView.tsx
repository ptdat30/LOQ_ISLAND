import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, Gem, Check, Lock, Fish, X } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { ISLAND_COLORS, ISLAND_EFFECTS } from '../data/islandCustomizationData';
import { ALL_FISH, FISH_MAP } from '../data/fishData';
import { TIER_COLORS } from '../data/ratesData';

export const CustomizationSubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colors' | 'effects' | 'avatars'>('colors');

  const gold = useFishingStore((s) => s.gold);
  const diamonds = useFishingStore((s) => s.diamonds);
  const customization = useFishingStore((s) => s.islandCustomization);
  const caughtFishHistory = useFishingStore((s) => s.caughtFishHistory);

  const buyIslandColor = useFishingStore((s) => s.buyIslandColor);
  const equipIslandColor = useFishingStore((s) => s.equipIslandColor);
  const buyIslandEffect = useFishingStore((s) => s.buyIslandEffect);
  const equipIslandEffect = useFishingStore((s) => s.equipIslandEffect);
  const equipFishAvatar = useFishingStore((s) => s.equipFishAvatar);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Filter Tier 5, 6, 7 fish for Avatar selection
  const tier5PlusFish = ALL_FISH.filter((f) => f.tier >= 5);

  return (
    <div className="w-full h-full flex flex-col justify-between select-none text-white overflow-hidden">
      {/* Top Header & Currencies */}
      <div className="flex items-center justify-between pb-1.5 shrink-0 border-b border-white/10">
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              activeTab === 'colors' ? 'bg-amber-500/30 text-amber-200' : 'text-white/60 hover:text-white'
            }`}
          >
            Màu sắc
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('effects')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              activeTab === 'effects' ? 'bg-purple-500/30 text-purple-200' : 'text-white/60 hover:text-white'
            }`}
          >
            Hiệu ứng
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('avatars')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
              activeTab === 'avatars' ? 'bg-sky-500/30 text-sky-200' : 'text-white/60 hover:text-white'
            }`}
          >
            Icon Cá Tier 5+
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold">
          <div className="flex items-center gap-1 text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
            <span>{gold.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-sky-300">
            <Gem className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
            <span>{diamonds.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="my-0.5 text-center py-0.5 px-2 bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[10px] font-medium rounded-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 no-scrollbar my-1">
        {/* ─── TAB 1: MÀU SẮC DYNAMIC ISLAND ─── */}
        {activeTab === 'colors' && (
          <div className="grid grid-cols-2 gap-1.5">
            {ISLAND_COLORS.map((c) => {
              const isOwned = customization.ownedColorIds.includes(c.id);
              const isActive = customization.activeColorId === c.id;
              const canAfford = gold >= c.priceGold && diamonds >= c.priceDiamond;

              return (
                <div
                  key={c.id}
                  className={`p-2 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-400/50 shadow-md'
                      : isOwned
                      ? 'bg-white/[0.04] border-white/10'
                      : 'bg-white/[0.02] border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                        style={{ background: c.colorValue }}
                      />
                      <span className="text-[11px] font-bold text-white truncate max-w-[85px]">
                        {c.name}
                      </span>
                    </div>

                    {isActive && (
                      <span className="text-[8px] font-bold text-amber-300 bg-amber-500/20 px-1 py-0.2 rounded border border-amber-500/30">
                        Đang dùng
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    {!isOwned ? (
                      <div className="text-[9px] font-bold">
                        {c.priceGold > 0 && (
                          <span className="text-amber-300 flex items-center gap-0.5">
                            <Coins className="w-2.5 h-2.5" strokeWidth={1.5} />
                            {c.priceGold.toLocaleString()}
                          </span>
                        )}
                        {c.priceDiamond > 0 && (
                          <span className="text-sky-300 flex items-center gap-0.5">
                            <Gem className="w-2.5 h-2.5" strokeWidth={1.5} />
                            {c.priceDiamond.toLocaleString()}
                          </span>
                        )}
                        {c.priceGold === 0 && c.priceDiamond === 0 && (
                          <span className="text-emerald-300">Miễn phí</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[9px] text-white/40">Đã mở</span>
                    )}

                    {isActive ? (
                      <span className="text-[9px] text-amber-300 font-semibold flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" strokeWidth={1.5} />
                        Áp dụng
                      </span>
                    ) : isOwned ? (
                      <button
                        type="button"
                        onClick={() => {
                          equipIslandColor(c.id);
                          showToast(`Đã áp dụng màu: ${c.name}`);
                        }}
                        className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all"
                      >
                        Trang bị
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyIslandColor(c.id);
                          if (res) showToast(`Đã mở khóa: ${c.name}`);
                          else showToast('Không đủ tài nguyên!');
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-amber-500/25 border-amber-400/40 text-amber-200 hover:bg-amber-500/35'
                            : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        Mua
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 2: HIỆU ỨNG DYNAMIC ISLAND ─── */}
        {activeTab === 'effects' && (
          <div className="space-y-1.5">
            {/* Option to clear effect */}
            {customization.activeEffectId && (
              <div className="p-1.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-white/60">Đang có hiệu ứng hoạt động</span>
                <button
                  type="button"
                  onClick={() => {
                    equipIslandEffect(null);
                    showToast('Đã tắt hiệu ứng');
                  }}
                  className="px-2 py-0.5 rounded text-[9px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 cursor-pointer flex items-center gap-1"
                >
                  <X className="w-2.5 h-2.5" strokeWidth={1.5} />
                  <span>Tắt hiệu ứng</span>
                </button>
              </div>
            )}

            {ISLAND_EFFECTS.map((eff) => {
              const isOwned = customization.ownedEffectIds.includes(eff.id);
              const isActive = customization.activeEffectId === eff.id;
              const canAfford = gold >= eff.priceGold && diamonds >= eff.priceDiamond;

              return (
                <div
                  key={eff.id}
                  className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isActive
                      ? 'bg-purple-500/15 border-purple-400/50 shadow-md'
                      : isOwned
                      ? 'bg-white/[0.04] border-white/10'
                      : 'bg-white/[0.02] border-white/5'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" strokeWidth={1.5} />
                      <span className="text-[11px] font-bold text-white truncate">{eff.name}</span>
                      {isActive && (
                        <span className="text-[8px] font-bold text-purple-300 bg-purple-500/25 px-1 py-0.2 rounded border border-purple-500/30">
                          Đang dùng
                        </span>
                      )}
                    </div>

                    {!isOwned && (
                      <div className="flex items-center gap-2 mt-1 text-[9px] font-bold">
                        {eff.priceGold > 0 && (
                          <span className="text-amber-300 flex items-center gap-0.5">
                            <Coins className="w-2.5 h-2.5" strokeWidth={1.5} />
                            {eff.priceGold.toLocaleString()}
                          </span>
                        )}
                        {eff.priceDiamond > 0 && (
                          <span className="text-sky-300 flex items-center gap-0.5">
                            <Gem className="w-2.5 h-2.5" strokeWidth={1.5} />
                            {eff.priceDiamond.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          equipIslandEffect(null);
                          showToast('Đã tháo hiệu ứng');
                        }}
                        className="px-2 py-1 rounded text-[9px] font-semibold bg-purple-500/25 text-purple-200 border border-purple-400/30 cursor-pointer"
                      >
                        Đang chọn
                      </button>
                    ) : isOwned ? (
                      <button
                        type="button"
                        onClick={() => {
                          equipIslandEffect(eff.id);
                          showToast(`Đã áp dụng: ${eff.name}`);
                        }}
                        className="px-2.5 py-1 rounded text-[9px] font-semibold bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all"
                      >
                        Sử dụng
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyIslandEffect(eff.id);
                          if (res) showToast(`Đã mở khóa: ${eff.name}`);
                          else showToast('Không đủ tài nguyên!');
                        }}
                        className={`px-3 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-purple-500/25 border-purple-400/40 text-purple-200 hover:bg-purple-500/35'
                            : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        Mua
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 3: AVATAR ICON CÁ TIER 5+ ─── */}
        {activeTab === 'avatars' && (
          <div className="space-y-1.5">
            {customization.activeFishAvatarId && (
              <div className="p-1.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-white/60">
                  Avatar đang dùng:{' '}
                  <strong className="text-white">
                    {FISH_MAP[customization.activeFishAvatarId]?.name}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    equipFishAvatar(null);
                    showToast('Đã về icon mặc định');
                  }}
                  className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white/10 text-white/70 hover:text-white cursor-pointer"
                >
                  Mặc định
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-1.5">
              {tier5PlusFish.map((fish) => {
                const isUnlocked = caughtFishHistory.includes(fish.id);
                const isActive = customization.activeFishAvatarId === fish.id;
                const style = TIER_COLORS[fish.tier];

                return (
                  <div
                    key={fish.id}
                    className={`p-2 rounded-xl border flex items-center justify-between gap-1.5 transition-all ${
                      isActive
                        ? 'bg-sky-500/20 border-sky-400/50 shadow-md'
                        : isUnlocked
                        ? 'bg-white/[0.04] border-white/10'
                        : 'bg-white/[0.02] border-white/5 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 ${style.bg} ${style.border}`}
                      >
                        <Fish className={`w-3.5 h-3.5 ${style.text}`} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="text-[10px] font-semibold text-white truncate max-w-[80px]">
                          {fish.name}
                        </span>
                        <span className="text-[8px] text-white/50">T{fish.tier} • W{fish.world}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isActive ? (
                        <span className="text-[8px] font-bold text-sky-300">Avatar</span>
                      ) : isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            equipFishAvatar(fish.id);
                            showToast(`Đã chọn avatar: ${fish.name}`);
                          }}
                          className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        >
                          Chọn
                        </button>
                      ) : (
                        <Lock className="w-3 h-3 text-white/30" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
