import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, Gem, Check, X } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { ISLAND_COLORS, ISLAND_EFFECTS } from '../data/islandCustomizationData';
import { ALL_FISH, FISH_MAP } from '../data/fishData';
import { TierBadge } from './shared/TierBadge';
import { ActionButton } from './shared/ActionButton';
import { TabularNumber } from './shared/TabularNumber';
import { TOKENS } from '../constants/tokens';

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
    <div className="w-full h-full flex flex-col justify-between select-none text-[#F5F5F7] overflow-hidden">
      {/* Top Tabs */}
      <div className="flex items-center justify-between pb-2 shrink-0 border-b border-white/[0.06]">
        <div className="flex items-center gap-1 bg-[#14141A] p-0.5 rounded-[10px] border border-white/[0.06] w-full">
          {(
            [
              { id: 'colors', label: 'Màu sắc' },
              { id: 'effects', label: 'Hiệu ứng' },
              { id: 'avatars', label: 'Icon Cá T5+' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-1 rounded-[8px] text-[11px] font-medium transition-all cursor-pointer text-center ${
                activeTab === t.id
                  ? 'bg-white/[0.1] text-[#F5F5F7] shadow-sm'
                  : 'text-[#8A8A94] hover:text-[#F5F5F7]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="my-1 text-center py-1 px-2.5 bg-[#32D74B]/10 border border-[#32D74B]/20 text-[#32D74B] text-[11px] font-medium rounded-[8px]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar my-1">
        {/* ─── TAB 1: MÀU SẮC DYNAMIC ISLAND ─── */}
        {activeTab === 'colors' && (
          <div className="grid grid-cols-2 gap-2">
            {ISLAND_COLORS.map((c) => {
              const isOwned = customization.ownedColorIds.includes(c.id);
              const isActive = customization.activeColorId === c.id;
              const canAfford = gold >= c.priceGold && diamonds >= c.priceDiamond;

              return (
                <div
                  key={c.id}
                  className={`p-2.5 rounded-[12px] border flex flex-col justify-between gap-2 transition-all ${
                    isActive
                      ? 'bg-[#14141A] border-[#5AC8FA]/50 shadow-sm'
                      : 'bg-[#14141A] border-white/[0.06]'
                  }`}
                  style={{ boxShadow: TOKENS.shadows.innerHighlight }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Color Swatch with 1.5px active ring */}
                      <div
                        className={`w-7 h-7 rounded-full shrink-0 transition-transform ${
                          isActive ? 'ring-2 ring-[#5AC8FA] ring-offset-2 ring-offset-[#0A0A0F]' : 'border border-white/20'
                        }`}
                        style={{ background: c.colorValue }}
                      />
                      <span className="text-[12px] font-medium text-[#F5F5F7] truncate max-w-[85px]">
                        {c.name}
                      </span>
                    </div>

                    {isActive && (
                      <span className="text-[9px] font-medium text-[#5AC8FA] bg-[#5AC8FA]/15 px-1.5 py-0.2 rounded-[6px] border border-[#5AC8FA]/30">
                        Đang dùng
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                    {!isOwned ? (
                      <div className="text-[10px] font-medium">
                        {c.priceGold > 0 && (
                          <span className="text-[#FFD60A] flex items-center gap-0.5 tabular-nums">
                            <Coins className="w-3 h-3 text-[#FFD60A]" strokeWidth={1.5} />
                            <TabularNumber value={c.priceGold} />
                          </span>
                        )}
                        {c.priceDiamond > 0 && (
                          <span className="text-[#5AC8FA] flex items-center gap-0.5 tabular-nums">
                            <Gem className="w-3 h-3 text-[#5AC8FA]" strokeWidth={1.5} />
                            <TabularNumber value={c.priceDiamond} />
                          </span>
                        )}
                        {c.priceGold === 0 && c.priceDiamond === 0 && (
                          <span className="text-[#32D74B]">Miễn phí</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#8A8A94]">Đã mở</span>
                    )}

                    {isActive ? (
                      <span className="text-[10px] text-[#5AC8FA] font-medium flex items-center gap-0.5">
                        <Check className="w-3 h-3" strokeWidth={1.5} />
                        Áp dụng
                      </span>
                    ) : isOwned ? (
                      <ActionButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          equipIslandColor(c.id);
                          showToast(`Đã áp dụng màu: ${c.name}`);
                        }}
                      >
                        Trang bị
                      </ActionButton>
                    ) : (
                      <ActionButton
                        variant="primary"
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyIslandColor(c.id);
                          if (res) showToast(`Đã mở khóa: ${c.name}`);
                          else showToast('Không đủ tài nguyên!');
                        }}
                      >
                        Mua
                      </ActionButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 2: HIỆU ỨNG DYNAMIC ISLAND ─── */}
        {activeTab === 'effects' && (
          <div className="space-y-2">
            {/* Option to clear effect */}
            {customization.activeEffectId && (
              <div className="p-2 rounded-[10px] bg-[#14141A] border border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-[#8A8A94]">Đang có hiệu ứng hoạt động</span>
                <ActionButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    equipIslandEffect(null);
                    showToast('Đã tắt hiệu ứng');
                  }}
                >
                  <X className="w-3 h-3" strokeWidth={1.5} />
                  <span>Tắt</span>
                </ActionButton>
              </div>
            )}

            {ISLAND_EFFECTS.map((eff) => {
              const isOwned = customization.ownedEffectIds.includes(eff.id);
              const isActive = customization.activeEffectId === eff.id;
              const canAfford = gold >= eff.priceGold && diamonds >= eff.priceDiamond;

              return (
                <div
                  key={eff.id}
                  className={`p-2.5 rounded-[12px] border flex items-center justify-between gap-3 transition-all ${
                    isActive
                      ? 'bg-[#14141A] border-[#BF5AF2]/50 shadow-sm'
                      : 'bg-[#14141A] border-white/[0.06]'
                  }`}
                  style={{ boxShadow: TOKENS.shadows.innerHighlight }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#BF5AF2]" strokeWidth={1.5} />
                      <span className="text-[13px] font-medium text-[#F5F5F7] truncate">{eff.name}</span>
                      {isActive && (
                        <span className="text-[9px] font-semibold text-[#BF5AF2] bg-[#BF5AF2]/15 px-1.5 py-0.2 rounded-[6px] border border-[#BF5AF2]/30">
                          Đang dùng
                        </span>
                      )}
                    </div>

                    {!isOwned && (
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-medium">
                        {eff.priceGold > 0 && (
                          <span className="text-[#FFD60A] flex items-center gap-0.5 tabular-nums">
                            <Coins className="w-3 h-3 text-[#FFD60A]" strokeWidth={1.5} />
                            <TabularNumber value={eff.priceGold} />
                          </span>
                        )}
                        {eff.priceDiamond > 0 && (
                          <span className="text-[#5AC8FA] flex items-center gap-0.5 tabular-nums">
                            <Gem className="w-3 h-3 text-[#5AC8FA]" strokeWidth={1.5} />
                            <TabularNumber value={eff.priceDiamond} />
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isActive ? (
                      <span className="text-[11px] text-[#BF5AF2] font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" strokeWidth={1.5} />
                        Đang chọn
                      </span>
                    ) : isOwned ? (
                      <ActionButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          equipIslandEffect(eff.id);
                          showToast(`Đã bật: ${eff.name}`);
                        }}
                      >
                        Dùng
                      </ActionButton>
                    ) : (
                      <ActionButton
                        variant="primary"
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => {
                          const res = buyIslandEffect(eff.id);
                          if (res) showToast(`Mở khóa thành công: ${eff.name}`);
                          else showToast('Không đủ tài nguyên!');
                        }}
                      >
                        Mua
                      </ActionButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TAB 3: AVATAR CÁ TIER 5+ ─── */}
        {activeTab === 'avatars' && (
          <div className="space-y-2">
            <div className="p-2 rounded-[10px] bg-[#14141A] border border-white/[0.06] text-[11px] text-[#8A8A94]">
              Chỉ những loài cá huyền thoại (Tier 5, 6, 7) bạn đã từng câu được mới có thể dùng làm biểu tượng Dynamic Island.
            </div>

            {/* Clear Avatar Option */}
            {customization.activeFishAvatarId && (
              <div className="p-2 rounded-[10px] bg-[#14141A] border border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-[#8A8A94]">
                  Đang dùng avatar:{' '}
                  <strong className="text-[#F5F5F7]">
                    {FISH_MAP[customization.activeFishAvatarId]?.name}
                  </strong>
                </span>
                <ActionButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    equipFishAvatar(null);
                    showToast('Đã gỡ avatar cá');
                  }}
                >
                  <X className="w-3 h-3" strokeWidth={1.5} />
                  <span>Gỡ bỏ</span>
                </ActionButton>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {tier5PlusFish.map((fish) => {
                const isCaught = caughtFishHistory.includes(fish.id);
                const isActive = customization.activeFishAvatarId === fish.id;

                return (
                  <div
                    key={fish.id}
                    className={`p-2.5 rounded-[12px] border flex flex-col justify-between gap-1.5 transition-all ${
                      isActive
                        ? 'bg-[#14141A] border-[#FFD60A]/50 shadow-sm'
                        : isCaught
                        ? 'bg-[#14141A] border-white/[0.06]'
                        : 'bg-[#1E1E28]/40 border-white/[0.04] opacity-50'
                    }`}
                    style={{ boxShadow: TOKENS.shadows.innerHighlight }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#F5F5F7] truncate max-w-[85px]">
                        {fish.name}
                      </span>
                      <TierBadge tier={fish.tier} />
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                      <span className="text-[10px] text-[#8A8A94]">
                        {isCaught ? 'Đã bắt' : 'Chưa bắt'}
                      </span>

                      {isActive ? (
                        <span className="text-[10px] text-[#FFD60A] font-medium flex items-center gap-0.5">
                          <Check className="w-3 h-3" strokeWidth={1.5} />
                          Avatar
                        </span>
                      ) : (
                        <ActionButton
                          variant="secondary"
                          size="sm"
                          disabled={!isCaught}
                          onClick={() => {
                            equipFishAvatar(fish.id);
                            showToast(`Đã chọn avatar: ${fish.name}`);
                          }}
                        >
                          Chọn
                        </ActionButton>
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
