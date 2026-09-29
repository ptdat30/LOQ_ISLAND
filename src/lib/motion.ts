import type { Transition } from 'framer-motion';

// Apple Dynamic Island — Motion Design System

export const appleSprings = {
  default: {
    type: 'spring', stiffness: 300, damping: 30, mass: 1,
    restSpeed: 0.001, restDelta: 0.001,
  } as Transition,
  expand: {
    type: 'spring', stiffness: 280, damping: 26, mass: 1,
    restSpeed: 0.001, restDelta: 0.001,
  } as Transition,
  collapse: {
    type: 'spring', stiffness: 400, damping: 40, mass: 1,
    restSpeed: 0.01, restDelta: 0.01,
  } as Transition,
  bouncy: {
    type: 'spring', stiffness: 420, damping: 22, mass: 1,
    restSpeed: 0.001, restDelta: 0.001,
  } as Transition,
  smooth: {
    type: 'spring', stiffness: 200, damping: 38, mass: 1,
    restSpeed: 0.001, restDelta: 0.001,
  } as Transition,
  snappy: {
    type: 'spring', stiffness: 500, damping: 35, mass: 0.8,
    restSpeed: 0.01, restDelta: 0.01,
  } as Transition,
  islandMorph: {
    type: 'spring', stiffness: 520, damping: 34, mass: 0.5,
    restSpeed: 0.001, restDelta: 0.001,
  } as Transition,
} as const;

export const appleEasing = {
  standard: [0.32, 0.72, 0, 1] as [number, number, number, number],
  decelerate: [0.22, 1, 0.36, 1] as [number, number, number, number],
  accelerate: [0.4, 0, 1, 1] as [number, number, number, number],
  overshoot: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  sharp: [0.4, 0, 0.6, 1] as [number, number, number, number],
} as const;

export const appleDurations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  deliberate: 0.6,
} as const;

export const islandDimensions = {
  compact: { width: 230, height: 37, borderRadius: 9999, paddingX: 12, paddingY: 8, gap: 8, iconSize: 18 },
  expanded: { width: 400, height: 210, borderRadius: 44, paddingX: 20, paddingY: 16, gap: 12, iconSize: 24 },
  bubble: { size: 37, borderRadius: 9999, gap: 8, iconSize: 16 },
  dot: { size: 12 },
} as const;

export const islandColors = {
  bg: '#000000',
  textPrimary: 'rgba(255, 255, 255, 1.0)',
  textSecondary: 'rgba(255, 255, 255, 0.60)',
  icon: 'rgba(255, 255, 255, 0.85)',
  accent: '#0A84FF',
  shadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)',
} as const;
