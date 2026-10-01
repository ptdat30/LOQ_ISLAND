import React from 'react';
import { Fish, Trophy } from 'lucide-react';
import { useFishingStore } from '../stores/fishingStore';
import { TIER_COLORS } from '../data/ratesData';
import { FISH_MAP } from '../data/fishData';
import { getFishImageUrl } from '../data/fishImages';

interface FishingCompactProps {
  onClick?: () => void;
}

export const FishingCompact: React.FC<FishingCompactProps> = ({ onClick }) => {
  const goldEarnedPastHour = useFishingStore((s) => s.stats.goldEarnedPastHour);
  const highestTier = useFishingStore((s) => s.stats.highestTierCaughtRecent);
  const highestFishId = useFishingStore((s) => s.stats.highestFishCaughtRecentId);
  const isFishingActive = useFishingStore((s) => s.isFishingActive);
  const activeAvatarId = useFishingStore((s) => s.islandCustomization.activeFishAvatarId);
  const newUncaughtPillAlert = useFishingStore((s) => s.newUncaughtPillAlert);

  const highestFish = highestFishId ? FISH_MAP[highestFishId] : null;
  const tierStyle = highestTier ? TIER_COLORS[highestTier] : TIER_COLORS[1];

  const avatarFish = activeAvatarId ? FISH_MAP[activeAvatarId] : null;
  const avatarStyle = avatarFish ? TIER_COLORS[avatarFish.tier] : null;
  const avatarImg = getFishImageUrl(activeAvatarId);

  const formatGoldShort = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between w-full h-full px-2 cursor-pointer select-none relative"
      title={newUncaughtPillAlert ? `Cá mới: ${newUncaughtPillAlert}` : undefined}
    >
      {/* Left: Fish Icon (or Avatar) + Status Dot */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="relative">
          {avatarImg ? (
            <img
              src={avatarImg}
              alt={avatarFish?.name || 'Avatar'}
              className="w-4 h-4 object-contain rounded-full drop-shadow-sm"
            />
          ) : (
            <Fish
              className={`w-4 h-4 ${avatarStyle ? avatarStyle.text : 'text-sky-400'}`}
              strokeWidth={avatarStyle ? 2 : 1.5}
              style={avatarStyle?.glow ? { filter: `drop-shadow(0 0 6px ${avatarStyle.glow})` } : undefined}
            />
          )}
          {isFishingActive && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          )}
        </div>
        <span className="text-[12px] font-semibold text-white/95 tabular-nums">
          {formatGoldShort(goldEarnedPastHour)}/h
        </span>
      </div>

      {/* Right: Highest Tier Caught Recent Badge & New Fish Blinking Dot */}
      <div className="flex items-center gap-1 shrink-0">
        {highestTier ? (
          <div
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-semibold ${tierStyle.bg} ${tierStyle.border} ${tierStyle.text}`}
            title={highestFish ? highestFish.name : `Tier ${highestTier}`}
          >
            <Trophy className="w-2.5 h-2.5" strokeWidth={1.5} />
            <span>T{highestTier}</span>
          </div>
        ) : (
          <span className="text-[10px] text-white/40 italic">Đang câu...</span>
        )}

        {/* New Uncaught Fish Notification Dot (blue, blinks 3 times / pulses) */}
        {newUncaughtPillAlert && (
          <span
            className="w-2 h-2 rounded-full bg-sky-400 animate-pulse ml-0.5 shadow-sm shadow-sky-400"
            title={`Cá mới: ${newUncaughtPillAlert}`}
          />
        )}
      </div>
    </div>
  );
};
