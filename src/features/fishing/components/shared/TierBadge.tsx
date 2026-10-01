import React from 'react';
import { TOKENS, TierNumber } from '../../constants/tokens';

interface TierBadgeProps {
  tier: TierNumber | number;
  className?: string;
}

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, className = '' }) => {
  const validTier = Math.min(Math.max(1, tier), 7) as TierNumber;
  const config = TOKENS.colors.tier[validTier];

  return (
    <span
      className={`inline-flex items-center justify-center font-mono font-bold leading-none select-none shrink-0 ${className}`}
      style={{
        width: '22px',
        height: '16px',
        borderRadius: TOKENS.radius.badge,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.hex,
        fontSize: '9px',
        letterSpacing: '0.2px',
      }}
      title={`Cấp độ Tier ${validTier}`}
    >
      T{validTier}
    </span>
  );
};
