import React, { useEffect, useRef, useState } from 'react';

interface TabularNumberProps {
  value: number;
  duration?: number; // ms, default 360ms
  prefix?: string;
  suffix?: string;
  className?: string;
}

// Ease out cubic: cubic-bezier(0.22, 1, 0.36, 1)
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export const TabularNumber: React.FC<TabularNumberProps> = ({
  value,
  duration = 360,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const startValRef = useRef(value);
  const targetValRef = useRef(value);
  const startTimeRef = useRef<number | null>(null);
  const reqIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === targetValRef.current) return;

    startValRef.current = displayValue;
    targetValRef.current = value;
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      if (startTimeRef.current === null) return;
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const ease = easeOutCubic(progress);

      const nextVal = Math.round(startValRef.current + (targetValRef.current - startValRef.current) * ease);
      setDisplayValue(nextVal);

      if (progress < 1) {
        reqIdRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValRef.current);
      }
    };

    reqIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqIdRef.current !== null) cancelAnimationFrame(reqIdRef.current);
    };
  }, [value, duration]);

  return (
    <span
      className={`tabular-nums font-mono ${className}`}
      style={{ fontFeatureSettings: '"tnum"' }}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};
