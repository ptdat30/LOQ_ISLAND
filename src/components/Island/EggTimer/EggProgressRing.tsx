import React from 'react';

interface EggProgressRingProps {
  size: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  color: string;
  children?: React.ReactNode;
  className?: string;
}

export const EggProgressRing: React.FC<EggProgressRingProps> = ({
  size,
  strokeWidth = 1.5,
  progress,
  color,
  children,
  className = '',
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90 pointer-events-none"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Active progress ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease',
          }}
        />
      </svg>
      {/* Centered content (Egg icon) */}
      <div className="relative z-10 flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </div>
  );
};
