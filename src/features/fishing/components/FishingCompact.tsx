import React from 'react';
import { useFishingStore } from '../stores/fishingStore';
import { FISH_MAP } from '../data/fishData';
import { getFishImageUrl } from '../data/fishImages';
import { TierBadge } from './shared/TierBadge';

interface FishingCompactProps {
  onClick?: () => void;
}

export const FishingCompact: React.FC<FishingCompactProps> = ({ onClick }) => {
  const goldEarnedPastHour = useFishingStore((s) => s.stats.goldEarnedPastHour);
  const highestTier = useFishingStore((s) => s.stats.highestTierCaughtRecent);
  const highestFishId = useFishingStore((s) => s.stats.highestFishCaughtRecentId);
  const isFishingActive = useFishingStore((s) => s.isFishingActive);
  const activeAvatarId = useFishingStore((s) => s.islandCustomization.activeFishAvatarId);

  const highestFish = highestFishId ? FISH_MAP[highestFishId] : null;
  const avatarFish = activeAvatarId ? FISH_MAP[activeAvatarId] : null;
  const avatarImg = getFishImageUrl(activeAvatarId);

  const formatGoldShort = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between w-full h-full px-3 cursor-pointer select-none relative"
    >
      {/* CỰC TRÁI: Custom Fish Icon 20px + Active Pulse Dot */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
          {avatarImg ? (
            <img
              src={avatarImg}
              alt={avatarFish?.name || 'Avatar'}
              className="w-5 h-5 object-contain rounded-full"
            />
          ) : (
            <svg
              className="w-5 h-5 text-[#5AC8FA]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z" />
              <path d="M18 12v.5" />
              <path d="M16 17.93a1 1 0 0 1-.76.71c-3.14.73-6.52-.77-8.24-3.64" />
              <path d="M2 16s3-1.5 4.5-4C5 9.5 2 8 2 8s1 2.5 1 4-1 4-1 4Z" />
            </svg>
          )}
          {isFishingActive && (
            <span
              className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#32D74B]"
              style={{ boxShadow: '0 0 4px rgba(50,215,75,0.8)' }}
            />
          )}
        </div>

        {/* CỰC GIỮA: Số vàng/giờ font 13px tabular numbers */}
        <span
          className="text-[#F5F5F7] tabular-nums font-mono font-semibold"
          style={{ fontSize: '13px', fontFeatureSettings: '"tnum"' }}
        >
          {formatGoldShort(goldEarnedPastHour)} vàng/h
        </span>
      </div>

      {/* CỰC PHẢI: Tier Badge 22x16px */}
      <div className="flex items-center gap-1.5 shrink-0">
        {highestTier ? (
          <div title={highestFish ? `${highestFish.name} (Tier ${highestTier})` : `Tier ${highestTier}`}>
            <TierBadge tier={highestTier} />
          </div>
        ) : (
          <span
            className="text-[#8A8A94] italic font-mono text-[10px]"
          >
            Đang thả câu
          </span>
        )}
      </div>
    </div>
  );
};
