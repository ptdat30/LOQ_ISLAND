import React from 'react';
import { Egg } from 'lucide-react';

interface EggIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export const EggIcon: React.FC<EggIconProps> = ({ className = 'w-4 h-4', size, style }) => {
  return (
    <Egg
      size={size}
      className={className}
      strokeWidth={1.5}
      fill="none"
      style={style}
    />
  );
};
