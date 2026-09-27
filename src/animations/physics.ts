import type { Transition, TargetAndTransition } from 'framer-motion';

/**
 * Apple Core Animation Spring Physics Presets
 * Inspired by iOS Dynamic Island & macOS Pro-Motion Physics (120Hz/VSync synced)
 */
export const appleSprings = {
  /** Default balanced Apple spring for structural layout and transitions */
  default: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 1,
    restSpeed: 0.001,
    restDelta: 0.001,
  } as Transition,

  /** Snappy / Interactive spring for immediate tactile feedback (hover, tap, click) */
  snappy: {
    type: 'spring',
    stiffness: 450,
    damping: 35,
    mass: 0.8,
    restSpeed: 0.001,
    restDelta: 0.001,
  } as Transition,

  /** Bouncy / Fluid spring for Dynamic Island morphing, bubble detach, and expansion */
  bouncy: {
    type: 'spring',
    stiffness: 260,
    damping: 22,
    mass: 1,
    restSpeed: 0.001,
    restDelta: 0.001,
  } as Transition,

  /** Ultra-responsive Apple Interactive Spring for instant morphing (0ms perceived latency, high acceleration) */
  islandMorph: {
    type: 'spring',
    stiffness: 520,
    damping: 34,
    mass: 0.5,
    restSpeed: 0.001,
    restDelta: 0.001,
  } as Transition,

  /** Smooth spring for continuous values (progress scrubbers, audio waveforms) */
  smooth: {
    type: 'spring',
    stiffness: 200,
    damping: 28,
    mass: 1,
    restSpeed: 0.001,
    restDelta: 0.001,
  } as Transition,

  /** Rubber-band physics for overscroll / boundary resistance */
  rubberBand: {
    type: 'spring',
    stiffness: 500,
    damping: 25,
    mass: 0.5,
  } as Transition,
};

/**
 * Common interactive button motion variants (Apple tactile feedback)
 */
export const appleTactile = {
  hover: {
    scale: 1.06,
    transition: appleSprings.snappy,
  } as TargetAndTransition,
  tap: {
    scale: 0.92,
    transition: appleSprings.snappy,
  } as TargetAndTransition,
  subtleHover: {
    scale: 1.02,
    transition: appleSprings.snappy,
  } as TargetAndTransition,
};
