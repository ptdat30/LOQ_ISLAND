import type { FishTier, TierRates } from '../../../types/fishing';

export const BASE_TIER_RATES: TierRates = {
  1: 70.0,
  2: 22.0,
  3: 6.0,
  4: 1.5,
  5: 0.4,
  6: 0.09,
  7: 0.01,
};

export interface CoreHookLevelBonus {
  level: number;
  costPoints: number; // Mutation points cost to upgrade to this level
  tier5Bonus: number; // +% added to Tier 5
  tier6Bonus: number; // +% added to Tier 6
  tier7Bonus: number; // +% added to Tier 7
}

export const CORE_HOOK_LEVELS: CoreHookLevelBonus[] = [
  { level: 0, costPoints: 0, tier5Bonus: 0, tier6Bonus: 0, tier7Bonus: 0 },
  { level: 1, costPoints: 10, tier5Bonus: 5, tier6Bonus: 3, tier7Bonus: 1 },
  { level: 2, costPoints: 50, tier5Bonus: 10, tier6Bonus: 6, tier7Bonus: 2 },
  { level: 3, costPoints: 250, tier5Bonus: 15, tier6Bonus: 9, tier7Bonus: 3 },
  { level: 4, costPoints: 1000, tier5Bonus: 20, tier6Bonus: 12, tier7Bonus: 4 },
  { level: 5, costPoints: 5000, tier5Bonus: 25, tier6Bonus: 15, tier7Bonus: 5 },
];

export const DIAMOND_DROP_CONFIG = {
  tier6: {
    chance: 0.05, // 5% chance
    amount: 1,
  },
  tier7: {
    chance: 1.0, // 100% chance
    amount: 10,
  },
};

export const TIER_COLORS: Record<FishTier, { border: string; bg: string; text: string; glow: string; name: string }> = {
  1: {
    name: 'Phổ thông',
    border: 'border-slate-500/40',
    bg: 'bg-slate-500/10',
    text: 'text-slate-300',
    glow: 'rgba(148, 163, 184, 0.4)',
  },
  2: {
    name: 'Thường',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    glow: 'rgba(52, 211, 153, 0.5)',
  },
  3: {
    name: 'Hiếm (Rare)',
    border: 'border-sky-500/40',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    glow: 'rgba(56, 189, 248, 0.6)',
  },
  4: {
    name: 'Sử thi (Epic)',
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    glow: 'rgba(192, 132, 252, 0.6)',
  },
  5: {
    name: 'Huyền thoại (Legendary)',
    border: 'border-amber-500/50',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    glow: 'rgba(251, 191, 36, 0.7)',
  },
  6: {
    name: 'Thần thoại (Mythic)',
    border: 'border-rose-500/60',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    glow: 'rgba(251, 113, 133, 0.8)',
  },
  7: {
    name: 'Độc tôn (Divine)',
    border: 'border-yellow-300/80',
    bg: 'bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-rose-500/20',
    text: 'text-yellow-300',
    glow: 'rgba(253, 224, 71, 1)',
  },
};
