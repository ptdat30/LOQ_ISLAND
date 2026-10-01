import React from 'react';
import { TOKENS } from '../../constants/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  const basePadding = size === 'sm' ? 'px-2.5 py-1 text-[12px]' : 'px-3.5 py-1.5 text-[14px]';

  const variantStyles: React.CSSProperties = isPrimary
    ? {
        backgroundColor: disabled ? 'rgba(90, 200, 250, 0.3)' : TOKENS.colors.accent,
        color: '#0A0A0F',
        fontWeight: 590,
        boxShadow: disabled ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
      }
    : isSecondary
    ? {
        backgroundColor: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        color: disabled ? TOKENS.colors.textSecondary : TOKENS.colors.textPrimary,
        boxShadow: TOKENS.shadow.subtle,
      }
    : isDanger
    ? {
        backgroundColor: 'rgba(255, 69, 58, 0.12)',
        border: '1px solid rgba(255, 69, 58, 0.30)',
        color: '#FF453A',
        fontWeight: 500,
      }
    : {
        // Ghost
        backgroundColor: 'transparent',
        color: TOKENS.colors.textSecondary,
      };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 cursor-pointer select-none transition-all duration-150 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-1 focus-visible:ring-[#5AC8FA] focus-visible:outline-none ${basePadding} ${className}`}
      style={{
        borderRadius: TOKENS.radius.button,
        letterSpacing: '-0.1px',
        ...variantStyles,
        ...style,
      }}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
