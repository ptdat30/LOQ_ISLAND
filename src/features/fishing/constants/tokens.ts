// AAA Design Tokens - Apple / Linear / Raycast Philosophy
// Strictly adheres to 10 Restraint & Hierarchy Principles

export const TOKENS = {
  // 1. PALETTE HẠN CHẾ (Tối đa 5 màu nền tảng)
  colors: {
    bg: '#0A0A0F',           // Nền chính (đen ngả lam trầm)
    bgOpacity: 'rgba(10, 10, 15, 0.94)',
    surface: '#14141A',      // Nền panel, card
    surfaceHover: '#1A1A22', // Nền card khi hover
    textPrimary: '#F5F5F7',  // Chữ chính (trắng ngà dịu mắt)
    textSecondary: '#8A8A94',// Chữ phụ (xám ấm)
    accent: '#5AC8FA',       // Xanh cyan Apple độc quyền
    accentHover: '#70D0FA',  // Accent hover
    accentBg: 'rgba(90, 200, 250, 0.15)',
    borderSubtle: 'rgba(255, 255, 255, 0.04)',
    borderMedium: 'rgba(255, 255, 255, 0.08)',
    borderActive: 'rgba(90, 200, 250, 0.40)',
    innerHighlight: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    innerHighlightStrong: 'inset 0 1px 0 rgba(255, 255, 255, 0.10)',

    // Màu Tier chuyên dụng (Chỉ áp dụng cho Badge, Text phân hạng và Glow nhẹ)
    tier: {
      1: { hex: '#6E6E78', bg: 'rgba(110, 110, 120, 0.20)', border: 'rgba(110, 110, 120, 0.40)', glow: 'rgba(110, 110, 120, 0.30)' },
      2: { hex: '#32D74B', bg: 'rgba(50, 215, 75, 0.20)',   border: 'rgba(50, 215, 75, 0.40)',   glow: 'rgba(50, 215, 75, 0.35)' },
      3: { hex: '#5AC8FA', bg: 'rgba(90, 200, 250, 0.20)',  border: 'rgba(90, 200, 250, 0.40)',  glow: 'rgba(90, 200, 250, 0.40)' },
      4: { hex: '#BF5AF2', bg: 'rgba(191, 90, 242, 0.20)',  border: 'rgba(191, 90, 242, 0.40)',  glow: 'rgba(191, 90, 242, 0.40)' },
      5: { hex: '#FF9F0A', bg: 'rgba(255, 159, 10, 0.20)',  border: 'rgba(255, 159, 10, 0.40)',  glow: 'rgba(255, 159, 10, 0.45)' },
      6: { hex: '#FF453A', bg: 'rgba(255, 69, 58, 0.20)',   border: 'rgba(255, 69, 58, 0.40)',   glow: 'rgba(255, 69, 58, 0.50)' },
      7: { hex: '#FFD60A', bg: 'rgba(255, 214, 10, 0.25)',  border: 'rgba(255, 214, 10, 0.50)',  glow: 'rgba(255, 214, 10, 0.60)' },
    },
  },

  // 2. TYPOGRAPHY CÓ PHÂN CẤP (5 sizes chuẩn SF Pro / Inter)
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
    display: {
      fontSize: '28px',
      lineHeight: '34px',
      fontWeight: 700,
      letterSpacing: '-0.5px',
      fontFeatureSettings: '"tnum"',
    },
    title: {
      fontSize: '17px',
      lineHeight: '22px',
      fontWeight: 590,
      letterSpacing: '-0.3px',
    },
    body: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
      letterSpacing: '-0.1px',
    },
    caption: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 400,
      letterSpacing: '0px',
    },
    micro: {
      fontSize: '10px',
      lineHeight: '12px',
      fontWeight: 500,
      letterSpacing: '0.3px',
      textTransform: 'uppercase' as const,
    },
  },

  // 3. SPACING GRID 4PX
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  // 4. BORDER-RADIUS CÓ TỶ LỆ
  radius: {
    pill: '18px',
    card: '16px',
    button: '10px',
    input: '10px',
    tooltip: '8px',
    badge: '6px',
    full: '9999px',
  },

  // 5. SHADOW & INNER HIGHLIGHT (Chỉ 2 loại tinh tế)
  shadow: {
    innerHighlight: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    card: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    subtle: '0 1px 2px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    elevated: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
  },
  shadows: {
    innerHighlight: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    card: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    subtle: '0 1px 2px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    elevated: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
  },

  // 6. GLASSMORPHISM TIẾT CHẾ
  blur: {
    rootPill: 'blur(24px) saturate(180%)',
    overlay: 'blur(16px) saturate(160%)',
  },

  // 7. ANIMATION NHỊP ĐIỆU (Anticipation 15% -> Action 55% -> Settle 30%)
  animation: {
    springFast: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    springSmooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
    durationHover: '150ms',
    durationTap: '100ms',
    durationExpand: '280ms',
    durationModal: '360ms',
  },
} as const;

export type TierNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
