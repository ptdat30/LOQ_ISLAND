import type { TargetAndTransition } from 'framer-motion';
export { appleSprings, appleEasing, appleDurations, islandDimensions, islandColors } from '../lib/motion';
import { appleSprings } from '../lib/motion';

/** Apple tactile hover/tap feedback — subtle, physical */
export const appleTactile = {
  hover: { scale: 1.04, transition: appleSprings.snappy } as TargetAndTransition,
  tap: { scale: 0.94, transition: appleSprings.snappy } as TargetAndTransition,
  subtleHover: { scale: 1.02, transition: appleSprings.snappy } as TargetAndTransition,
};
