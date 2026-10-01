import { useEffect } from 'react';
import { useFishingStore } from '../stores/fishingStore';

/**
 * Hook to manage offline earnings and ensure progress is persisted on app lifecycle events.
 */
export function useOfflineEarning() {
  const initStore = useFishingStore((s) => s.initStore);
  const saveToStorage = useFishingStore((s) => s.saveToStorage);
  const offlineEarningsReport = useFishingStore((s) => s.offlineEarningsReport);
  const dismissOfflineReport = useFishingStore((s) => s.dismissOfflineReport);

  useEffect(() => {
    // Initialize and calculate offline earnings once
    initStore();

    // Auto-save on page hide / tab switch / app close
    const handleBeforeUnload = () => {
      saveToStorage();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveToStorage();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initStore, saveToStorage]);

  return {
    offlineEarningsReport,
    dismissOfflineReport,
  };
}
