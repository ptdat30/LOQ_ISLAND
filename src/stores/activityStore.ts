import { create } from 'zustand';
import type { Activity, IslandMode } from '../types/activity';

interface ActivityState {
  activities: Activity[];
  mode: IslandMode;
  isHovered: boolean;
  isPinned: boolean;
  isDrawerOpen: boolean;
  isSettingsOpen: boolean;
  activeActivityIndex: number;
  lastUpdateTimestamps: Record<string, number>;

  // Actions
  addOrUpdateActivity: (activity: Activity) => void;
  removeActivity: (id: string) => void;
  clearActivities: () => void;
  setHovered: (hovered: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  togglePinned: () => void;
  toggleDrawer: () => void;
  toggleSettings: () => void;
  cycleActivity: (direction: 'next' | 'prev') => void;
  selectActivityIndex: (index: number) => void;
  cleanupExpired: () => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  mode: 'compact',
  isHovered: false,
  isPinned: false,
  isDrawerOpen: false,
  isSettingsOpen: false,
  activeActivityIndex: 0,
  lastUpdateTimestamps: {},

  addOrUpdateActivity: (newActivity: Activity) => {
    const now = Date.now();
    const { activities, lastUpdateTimestamps } = get();
    const existingIndex = activities.findIndex((a) => a.id === newActivity.id);

    let updatedList: Activity[];
    if (existingIndex >= 0) {
      const existing = activities[existingIndex];
      // Skip identical updates to avoid useless re-renders
      if (
        existing &&
        existing.title === newActivity.title &&
        existing.subtitle === newActivity.subtitle &&
        existing.progress === newActivity.progress &&
        existing.timeRemaining === newActivity.timeRemaining &&
        existing.priority === newActivity.priority
      ) {
        return;
      }

      updatedList = [...activities];
      updatedList[existingIndex] = {
        ...existing,
        ...newActivity,
      };

      // Only re-sort if priority changed
      if (existing && existing.priority !== newActivity.priority) {
        updatedList.sort((a, b) => {
          if (b.priority !== a.priority) return b.priority - a.priority;
          return b.createdAt - a.createdAt;
        });
      }
    } else {
      // Hard cap at 20 activities max
      if (activities.length >= 20) {
        return;
      }
      updatedList = [...activities, newActivity];
      updatedList.sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return b.createdAt - a.createdAt;
      });
    }

    set({
      activities: updatedList,
      lastUpdateTimestamps: {
        ...lastUpdateTimestamps,
        [newActivity.id]: now,
      },
    });
  },

  removeActivity: (id: string) => {
    const { activities, activeActivityIndex } = get();
    const updated = activities.filter((a) => a.id !== id);
    const newIndex = Math.min(activeActivityIndex, Math.max(0, updated.length - 1));
    set({
      activities: updated,
      activeActivityIndex: newIndex,
    });
  },

  clearActivities: () => {
    set({ activities: [], activeActivityIndex: 0 });
  },

  setHovered: (hovered: boolean) => {
    set({ isHovered: hovered });
  },

  setExpanded: (expanded: boolean) => {
    set({
      mode: expanded ? 'expanded' : 'compact',
    });
  },

  togglePinned: () => {
    const { isPinned } = get();
    const nextPinned = !isPinned;
    set({
      isPinned: nextPinned,
      mode: nextPinned ? 'expanded' : 'compact',
    });
  },

  toggleDrawer: () => {
    set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
  },

  toggleSettings: () => {
    set((state) => ({ isSettingsOpen: !state.isSettingsOpen }));
  },

  cycleActivity: (direction: 'next' | 'prev') => {
    const { activities, activeActivityIndex } = get();
    if (activities.length <= 1) return;

    let nextIndex = direction === 'next' ? activeActivityIndex + 1 : activeActivityIndex - 1;
    if (nextIndex >= activities.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = activities.length - 1;

    set({ activeActivityIndex: nextIndex });
  },

  selectActivityIndex: (index: number) => {
    const { activities } = get();
    if (index >= 0 && index < activities.length) {
      set({ activeActivityIndex: index });
    }
  },

  cleanupExpired: () => {
    const now = Date.now();
    const { activities } = get();
    const filtered = activities.filter((a) => {
      if (!a.ttl) return true;
      return now - a.createdAt < a.ttl;
    });

    if (filtered.length !== activities.length) {
      set({ activities: filtered });
    }
  },
}));
