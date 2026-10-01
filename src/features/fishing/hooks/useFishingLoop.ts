import { useEffect, useRef } from 'react';
import { useFishingStore } from '../stores/fishingStore';
import { getFishingSpeedSeconds } from '../logic/fishingEngine';

/**
 * Custom hook to control the idle fishing interval and auto-save timer.
 */
export function useFishingLoop() {
  const isFishingActive = useFishingStore((s) => s.isFishingActive);
  const currentRodId = useFishingStore((s) => s.currentRodId);
  const ownedVehicleIds = useFishingStore((s) => s.ownedVehicleIds);
  const catchRound = useFishingStore((s) => s.catchRound);
  const saveToStorage = useFishingStore((s) => s.saveToStorage);
  const celebrationTier = useFishingStore((s) => s.celebrationTier);
  const clearCelebration = useFishingStore((s) => s.clearCelebration);

  const speedSeconds = getFishingSpeedSeconds(currentRodId, ownedVehicleIds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const celebrationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Idle Fishing Loop
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isFishingActive) {
      const intervalMs = Math.max(250, Math.round(speedSeconds * 1000));
      intervalRef.current = setInterval(() => {
        catchRound();
      }, intervalMs);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isFishingActive, speedSeconds, catchRound]);

  // 2. Periodic Auto-Save every 10 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      saveToStorage();
    }, 10000);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
        autoSaveRef.current = null;
      }
    };
  }, [saveToStorage]);

  // 3. Celebration Auto-Dismissal (3 seconds for Tier 5+, 4 seconds for Tier 7)
  useEffect(() => {
    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current);
      celebrationTimerRef.current = null;
    }

    if (celebrationTier) {
      const timeoutMs = celebrationTier === 7 ? 4000 : 2500;
      celebrationTimerRef.current = setTimeout(() => {
        clearCelebration();
      }, timeoutMs);
    }

    return () => {
      if (celebrationTimerRef.current) {
        clearTimeout(celebrationTimerRef.current);
        celebrationTimerRef.current = null;
      }
    };
  }, [celebrationTier, clearCelebration]);

  return {
    isFishingActive,
    speedSeconds,
  };
}
