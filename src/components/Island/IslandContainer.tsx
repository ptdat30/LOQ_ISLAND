import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useActivityStore } from '../../stores/activityStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useEggTimerStore } from '../../stores/eggTimerStore';
import { useShiftScheduleStore } from '../../stores/shiftScheduleStore';
import { PrimaryPill } from './PrimaryPill';
import { SecondaryBubble } from './SecondaryBubble';
import { EggTimerBubble } from './EggTimer/EggTimerBubble';
import { QueueDrawer } from './QueueDrawer';
import { SettingsModal } from './SettingsModal';
import { SimulatorDrawer } from './SimulatorDrawer';
import { ContextMenu } from './ContextMenu';
import { ApprovalCard } from './ApprovalCard';
import { useFishingStore } from '../../features/fishing/stores/fishingStore';
import { FishingBubble } from '../../features/fishing/components/FishingBubble';
import { useOfflineEarning } from '../../features/fishing/hooks/useOfflineEarning';
import type { Activity } from '../../types/activity';

export const IslandContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    activities,
    mode,
    isPinned,
    isDrawerOpen,
    isSettingsOpen,
    activeActivityIndex,
    setHovered,
    setExpanded,
    togglePinned,
    toggleDrawer,
    toggleSettings,
    cycleActivity,
    selectActivityIndex,
    removeActivity,
    clearActivities,
    addOrUpdateActivity,
  } = useActivityStore();

  const {
    status: eggStatus,
    remainingMs: eggRemaining,
    initStore: initEggStore,
  } = useEggTimerStore();

  const {
    tasks: shiftTasks,
    activeAlertTaskId,
    initSchedule,
    dismissAlert: dismissShiftAlert,
  } = useShiftScheduleStore();

  useEffect(() => {
    initEggStore();
    initSchedule();
  }, [initEggStore, initSchedule]);

  const activeShiftAlertTask = shiftTasks.find(
    (t) => t.id === activeAlertTaskId || (t.enabled && t.status === 'alert')
  );

  const total = activities.length;
  const primaryActivity = total > 0 ? activities[activeActivityIndex] || activities[0] : null;

  // Active slot tracking: 'shift' | 'egg' | 'activity' | 'fishing'
  const [activeSlot, setActiveSlot] = useState<'shift' | 'egg' | 'activity' | 'fishing'>('shift');
  const isEggActive = eggStatus === 'running' || eggStatus === 'alert';

  const isFishingActive = useFishingStore((s) => s.isFishingActive);
  const celebrationTier = useFishingStore((s) => s.celebrationTier);

  // Initialize offline earnings on app load
  useOfflineEarning();

  // Global hotkey Alt+F for Mini-Game Câu Cá & Alt+L for Thư Viện Cá
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        if (activeSlot === 'fishing') {
          setActiveSlot('shift');
          setExpanded(false);
        } else {
          setActiveSlot('fishing');
          setExpanded(true);
        }
      } else if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        setActiveSlot('fishing');
        useFishingStore.getState().setActiveSubTab('library');
        setExpanded(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlot, setExpanded]);

  // Priority resolution for primary pill
  const isShiftAlert = !!activeShiftAlertTask;
  const isCelebrationTakeover = !!celebrationTier && celebrationTier >= 5;
  const isEggInPrimary =
    !isShiftAlert && !isCelebrationTakeover && (total === 0 ? isEggActive : isEggActive && activeSlot === 'egg');
  const isFishingInPrimary =
    isCelebrationTakeover ||
    (!isShiftAlert &&
      !isEggInPrimary &&
      (activeSlot === 'fishing' || (total === 0 && !isEggActive && isFishingActive)));

  const { loadInitialSettings, setShortcutConflict } = useSettingsStore();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [approvalRequest, setApprovalRequest] = useState<{
    approvalId: string;
    pluginId: string;
    name: string;
  } | null>(null);

  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const eggCollapseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shiftCollapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearEggCollapseTimer = useCallback(() => {
    if (eggCollapseTimerRef.current) {
      clearTimeout(eggCollapseTimerRef.current);
      eggCollapseTimerRef.current = null;
    }
  }, []);

  const scheduleEggCollapse = useCallback((delayMs = 4000) => {
    clearEggCollapseTimer();
    if (isPinned || eggStatus === 'alert') return;
    if (eggStatus === 'running' && eggRemaining < 60 * 1000) return;

    eggCollapseTimerRef.current = setTimeout(() => {
      setExpanded(false);
    }, delayMs);
  }, [clearEggCollapseTimer, isPinned, eggStatus, eggRemaining, setExpanded]);

  // When Shift Reminder triggers Alert -> Priority 1 (highest), hold 60s
  useEffect(() => {
    if (activeShiftAlertTask) {
      setActiveSlot('shift');
      setExpanded(true);
      if (shiftCollapseTimerRef.current) clearTimeout(shiftCollapseTimerRef.current);
      shiftCollapseTimerRef.current = setTimeout(() => {
        setExpanded(false);
      }, 60000); // Hold 60s as specified
    }
  }, [activeShiftAlertTask, setExpanded]);

  // When egg alert triggers -> Priority 2, forces egg to primary and morphs expanded immediately
  useEffect(() => {
    if (eggStatus === 'alert' && !activeShiftAlertTask) {
      setActiveSlot('egg');
      setExpanded(true);
      clearEggCollapseTimer();
    }
  }, [eggStatus, activeShiftAlertTask, setExpanded, clearEggCollapseTimer]);

  const handleEggStart = useCallback(() => {
    setActiveSlot('egg');
    setExpanded(true);
    scheduleEggCollapse(4000);
  }, [setExpanded, scheduleEggCollapse]);

  const handleContainerMouseEnter = useCallback(() => {
    clearEggCollapseTimer();
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  }, [clearEggCollapseTimer]);

  const handleContainerMouseLeave = useCallback(() => {
    if (mode !== 'expanded' || isPinned) return;

    if (isEggInPrimary && eggStatus === 'running') {
      scheduleEggCollapse(4000);
    } else if (!isEggInPrimary && !isShiftAlert) {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = setTimeout(() => {
        setExpanded(false);
      }, 280);
    }
  }, [mode, isPinned, isEggInPrimary, eggStatus, isShiftAlert, scheduleEggCollapse, setExpanded]);

  // Throttled Sync Pill Bounding Rect to Electron Main Process
  const syncRafId = useRef<number | null>(null);
  const syncBounds = useCallback(() => {
    if (typeof window === 'undefined' || !window.electronAPI) return;
    if (syncRafId.current !== null) return;

    syncRafId.current = requestAnimationFrame(() => {
      syncRafId.current = null;
      if (!window.electronAPI) return;

      if (!containerRef.current) {
        window.electronAPI.syncPillBounds({ x: 0, y: 0, width: 0, height: 0 });
        return;
      }

      // If drawer, settings, simulator, or context menu is open, expand hit-test bounds to full window!
      if (isDrawerOpen || isSettingsOpen || isSimulatorOpen || approvalRequest || contextMenuPos) {
        window.electronAPI.syncPillBounds({
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        });
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        window.electronAPI.syncPillBounds({ x: 0, y: 0, width: 0, height: 0 });
        return;
      }

      // Safety padding 10px to prevent hit-test border deadlock
      const safetyPadding = 10;
      const bounds = {
        x: Math.max(0, Math.round(rect.left - safetyPadding)),
        y: Math.max(0, Math.round(rect.top - safetyPadding)),
        width: Math.round(rect.width + safetyPadding * 2),
        height: Math.round(rect.height + safetyPadding * 2),
      };
      window.electronAPI.syncPillBounds(bounds);
    });
  }, [isDrawerOpen, isSettingsOpen, isSimulatorOpen, approvalRequest, contextMenuPos]);

  // Listen to Electron events
  useEffect(() => {
    loadInitialSettings();

    if (window.electronAPI) {
      const unsubCursor = window.electronAPI.onCursorInside((inside) => {
        setHovered(inside);
      });

      const unsubToggle = window.electronAPI.onToggleExpand(() => {
        setExpanded(mode !== 'expanded');
      });

      const unsubConflict = window.electronAPI.onShortcutConflict((data) => {
        setShortcutConflict(data.key);
      });

      const unsubApproval = window.electronAPI.onPluginApprovalRequest((req) => {
        setApprovalRequest(req);
      });

      const unsubActivity = window.electronAPI.onNewActivityFromPlugin((act) => {
        addOrUpdateActivity(act as Activity);
      });

      const unsubMedia = window.electronAPI.onSystemMediaUpdate?.((act) => {
        addOrUpdateActivity(act as Activity);
      }) || (() => {});

      const unsubMediaIdle = window.electronAPI.onSystemMediaIdle?.(() => {
        removeActivity('system-media');
      }) || (() => {});

      return () => {
        unsubCursor();
        unsubToggle();
        unsubConflict();
        unsubApproval();
        unsubActivity();
        unsubMedia();
        unsubMediaIdle();
      };
    }
  }, [loadInitialSettings, mode, setHovered, setExpanded, setShortcutConflict, addOrUpdateActivity, removeActivity]);

  // Sync bounds whenever layout or visibility changes
  useEffect(() => {
    syncBounds();
    const observer = new ResizeObserver(() => {
      syncBounds();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [syncBounds, mode, total, isEggInPrimary, isShiftAlert, isDrawerOpen, isSettingsOpen, isSimulatorOpen, approvalRequest, contextMenuPos]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeShiftAlertTask) {
          dismissShiftAlert(activeShiftAlertTask.id);
          setExpanded(false);
        } else if (eggStatus === 'alert') {
          useEggTimerStore.getState().dismissAlert();
          setExpanded(false);
        } else if (isSettingsOpen) toggleSettings();
        else if (isSimulatorOpen) setIsSimulatorOpen(false);
        else if (isDrawerOpen) toggleDrawer();
        else setExpanded(false);
      } else if (e.key.toLowerCase() === 'a' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        // Quick trigger Shift Alert (Ctrl+Shift+A)
        e.preventDefault();
        useShiftScheduleStore.getState().testTriggerNow();
      } else if (e.key.toLowerCase() === 't' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        // Quick create 1-minute real-time countdown task (Ctrl+Shift+T)
        e.preventDefault();
        useShiftScheduleStore.getState().createRealtimeTestTask(1);
      } else if (e.key.toLowerCase() === 'e' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        // Quick trigger egg boiling timer (Ctrl+Shift+E)
        e.preventDefault();
        if (eggStatus === 'idle') {
          useEggTimerStore.getState().startTimer();
          handleEggStart();
        } else if (eggStatus === 'alert') {
          useEggTimerStore.getState().dismissAlert();
          setExpanded(false);
        } else {
          setActiveSlot('egg');
          setExpanded(true);
        }
      } else if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        cycleActivity('next');
      } else if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        cycleActivity('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeShiftAlertTask, eggStatus, isSettingsOpen, isSimulatorOpen, isDrawerOpen, toggleSettings, toggleDrawer, setExpanded, cycleActivity, handleEggStart, dismissShiftAlert]);

  // Secondary bubbles resolution
  let secondaryLeft: Activity | null = null;
  let secondaryRight: Activity | null = null;
  let showEggBubble = false;
  let queuedCount = 0;

  if (isShiftAlert) {
    // Shift Alert is occupying Primary Pill
    if (isEggActive) {
      showEggBubble = true;
    }
    if (total >= 1) {
      secondaryRight = activities[0];
      queuedCount = Math.max(0, total - 1);
    }
  } else if (isEggInPrimary) {
    // Egg is in Primary Pill
    if (total === 1) {
      secondaryRight = activities[0];
    } else if (total >= 2) {
      secondaryLeft = activities[0];
      secondaryRight = activities[1];
      queuedCount = Math.max(0, total - 2);
    }
  } else {
    // Activity is in Primary Pill
    if (isEggActive) {
      showEggBubble = true;
      if (total >= 2) {
        const otherIdx = activeActivityIndex === 0 ? 1 : 0;
        secondaryRight = activities[otherIdx];
        queuedCount = Math.max(0, total - 2);
      }
    } else {
      if (total === 2) {
        const secondaryIdx = activeActivityIndex === 0 ? 1 : 0;
        secondaryLeft = activities[secondaryIdx];
      } else if (total >= 3) {
        const leftIdx = (activeActivityIndex + 1) % total;
        const rightIdx = (activeActivityIndex + 2) % total;
        secondaryLeft = activities[leftIdx];
        secondaryRight = activities[rightIdx];
        queuedCount = Math.max(0, total - 3);
      }
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleApprovalResponse = async (approved: boolean) => {
    if (!approvalRequest) return;
    if (window.electronAPI) {
      await window.electronAPI.respondPluginApproval(approvalRequest.approvalId, approved);
    }
    setApprovalRequest(null);
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-start pt-2 px-4 pointer-events-none"
      onContextMenu={handleContextMenu}
    >
      {/* Interactive Main Island Area */}
      <div
        ref={containerRef}
        onMouseEnter={handleContainerMouseEnter}
        onMouseLeave={handleContainerMouseLeave}
        className="pointer-events-auto flex flex-col items-center"
      >
        {/* Top Flex Row: [Fishing Bubble?] [Secondary Bubble L] [Primary Pill] [Secondary Bubble R] */}
        <div className="flex items-center justify-center gap-2">
          {/* Fishing Bubble when fishing is running idle in background */}
          <AnimatePresence>
            {!isFishingInPrimary && isFishingActive && (
              <FishingBubble
                onClick={() => {
                  setActiveSlot('fishing');
                  setExpanded(true);
                }}
              />
            )}
          </AnimatePresence>

          {/* Bubble Left */}
          <AnimatePresence>
            {showEggBubble ? (
              <EggTimerBubble onClick={() => setActiveSlot('egg')} />
            ) : secondaryLeft ? (
              <SecondaryBubble
                key={`left-${secondaryLeft.id}`}
                activity={secondaryLeft}
                position="left"
                onClick={() => {
                  if (isEggInPrimary) {
                    setActiveSlot('activity');
                    const idx = activities.findIndex((a) => a.id === secondaryLeft?.id);
                    if (idx >= 0) selectActivityIndex(idx);
                  } else {
                    const idx = activities.findIndex((a) => a.id === secondaryLeft?.id);
                    if (idx >= 0) selectActivityIndex(idx);
                  }
                }}
              />
            ) : null}
          </AnimatePresence>

          {/* Primary Main Pill */}
          <AnimatePresence>
            <PrimaryPill
              key={
                isShiftAlert
                  ? `primary-shift-${activeShiftAlertTask?.id}`
                  : isFishingInPrimary
                  ? 'primary-fishing-pill'
                  : isEggInPrimary
                  ? 'primary-egg-pill'
                  : (primaryActivity?.id || 'idle-pill')
              }
              activity={isShiftAlert || isEggInPrimary || isFishingInPrimary ? null : primaryActivity}
              isEggTimer={!isFishingInPrimary && isEggInPrimary}
              isFishing={isFishingInPrimary}
              isExpanded={mode === 'expanded'}
              isPinned={isPinned}
              queuedCount={queuedCount}
              onEggStart={handleEggStart}
              onOpenFishing={() => {
                setActiveSlot('fishing');
                setExpanded(true);
              }}
              onTogglePin={togglePinned}
              onToggleExpand={() => {
                const nextExpanded = mode !== 'expanded';
                setExpanded(nextExpanded);
                if (nextExpanded && isEggInPrimary && eggStatus === 'running') {
                  scheduleEggCollapse(4000);
                }
              }}
              onToggleDrawer={toggleDrawer}
              onDismiss={() => {
                if (isShiftAlert && activeShiftAlertTask) {
                  dismissShiftAlert(activeShiftAlertTask.id);
                  setExpanded(false);
                } else if (isFishingInPrimary) {
                  setActiveSlot('shift');
                  setExpanded(false);
                } else if (isEggInPrimary) {
                  useEggTimerStore.getState().cancelTimer();
                  setExpanded(false);
                } else if (primaryActivity) {
                  removeActivity(primaryActivity.id);
                }
              }}
              onActionClick={(actionId) => {
                if (primaryActivity && actionId === 'play') {
                  if (window.electronAPI) {
                    window.electronAPI.togglePlayPause();
                  }
                  const isPlaying = primaryActivity.actions?.find((a) => a.id === 'play')?.icon === 'Pause';
                  addOrUpdateActivity({
                    ...primaryActivity,
                    subtitle: primaryActivity.subtitle?.replace(
                      isPlaying ? 'Playing' : 'Paused',
                      isPlaying ? 'Paused' : 'Playing'
                    ),
                    actions: primaryActivity.actions?.map((a) =>
                      a.id === 'play'
                        ? { ...a, icon: isPlaying ? 'Play' : 'Pause', label: isPlaying ? 'Play' : 'Pause' }
                        : a
                    ),
                  });
                }
              }}
            />
          </AnimatePresence>

          {/* Bubble Right */}
          <AnimatePresence>
            {secondaryRight && (
              <SecondaryBubble
                key={`right-${secondaryRight.id}`}
                activity={secondaryRight}
                position="right"
                onClick={() => {
                  if (isEggInPrimary) {
                    setActiveSlot('activity');
                    const idx = activities.findIndex((a) => a.id === secondaryRight?.id);
                    if (idx >= 0) selectActivityIndex(idx);
                  } else {
                    const idx = activities.findIndex((a) => a.id === secondaryRight?.id);
                    if (idx >= 0) selectActivityIndex(idx);
                  }
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Plugin Security Approval Card */}
        <AnimatePresence>
          {approvalRequest && (
            <div className="mt-2">
              <ApprovalCard request={approvalRequest} onRespond={handleApprovalResponse} />
            </div>
          )}
        </AnimatePresence>

        {/* Drawers and Modals */}
        <QueueDrawer
          isOpen={isDrawerOpen}
          activities={activities}
          activeId={isEggInPrimary ? undefined : primaryActivity?.id}
          onSelect={(index) => {
            setActiveSlot('activity');
            selectActivityIndex(index);
            toggleDrawer();
          }}
          onDismiss={removeActivity}
          onClose={toggleDrawer}
        />

        <SimulatorDrawer
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={toggleSettings}
        />
      </div>

      {/* Glassmorphic Context Menu */}
      <ContextMenu
        isOpen={contextMenuPos !== null}
        position={contextMenuPos || { x: 0, y: 0 }}
        isPinned={isPinned}
        onTogglePin={togglePinned}
        onOpenSettings={toggleSettings}
        onOpenDrawer={toggleDrawer}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenFishing={() => {
          setActiveSlot('fishing');
          setExpanded(true);
        }}
        onClearAll={() => {
          clearActivities();
          useEggTimerStore.getState().cancelTimer();
        }}
        onQuit={() => {
          if (window.electronAPI) window.electronAPI.closeApp();
        }}
        onClose={() => setContextMenuPos(null)}
      />
    </div>
  );
};
