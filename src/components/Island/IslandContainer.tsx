import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useActivityStore } from '../../stores/activityStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { PrimaryPill } from './PrimaryPill';
import { SecondaryBubble } from './SecondaryBubble';
import { QueueDrawer } from './QueueDrawer';
import { SettingsModal } from './SettingsModal';
import { SimulatorDrawer } from './SimulatorDrawer';
import { ContextMenu } from './ContextMenu';
import { ApprovalCard } from './ApprovalCard';
import type { RelativeRect, Activity } from '../../types/activity';

export const IslandContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const total = activities.length;
  const primaryActivity = total > 0 ? activities[activeActivityIndex] || activities[0] : null;

  const { loadInitialSettings, setShortcutConflict } = useSettingsStore();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [approvalRequest, setApprovalRequest] = useState<{
    approvalId: string;
    pluginId: string;
    name: string;
  } | null>(null);

  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleContainerMouseEnter = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  }, []);

  const handleContainerMouseLeave = useCallback(() => {
    // Only auto-collapse when currently expanded and NOT pinned
    if (mode !== 'expanded' || isPinned) return;

    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => {
      setExpanded(false);
      if (window.electronAPI && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        window.electronAPI.syncPillBounds({
          x: Math.max(0, Math.round(centerX - 120)),
          y: Math.max(0, Math.round(rect.top - 10)),
          width: 240,
          height: 56,
        });
      }
    }, 280);
  }, [mode, isPinned, setExpanded]);

  // Throttled Sync Pill Bounding Rect to Electron Main Process
  const syncRafId = useRef<number | null>(null);
  const syncBounds = useCallback(() => {
    if (typeof window === 'undefined' || !window.electronAPI) return;
    if (syncRafId.current !== null) return;

    syncRafId.current = requestAnimationFrame(() => {
      syncRafId.current = null;
      if (!window.electronAPI) return;

      if (!primaryActivity || !containerRef.current) {
        window.electronAPI.syncPillBounds({ x: 0, y: 0, width: 0, height: 0 });
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        window.electronAPI.syncPillBounds({ x: 0, y: 0, width: 0, height: 0 });
        return;
      }

      // Safety padding 10px to prevent hit-test border deadlock
      const safetyPadding = 10;
      const bounds: RelativeRect = {
        x: Math.max(0, Math.round(rect.left - safetyPadding)),
        y: Math.max(0, Math.round(rect.top - safetyPadding)),
        width: Math.round(rect.width + safetyPadding * 2),
        height: Math.round(rect.height + safetyPadding * 2),
      };
      window.electronAPI.syncPillBounds(bounds);
    });
  }, [primaryActivity]);

  // Listen to Electron events
  useEffect(() => {
    loadInitialSettings();
    // Focus strictly on Music / Media: clear any previous mock/timer activities
    clearActivities();

    if (typeof window !== 'undefined' && window.electronAPI) {
      // 1. Cursor inside event from adaptive hit-testing
      let leaveTimeout: NodeJS.Timeout | null = null;
      const unsubCursor = window.electronAPI.onCursorInside((inside) => {
        if (inside) {
          if (leaveTimeout) clearTimeout(leaveTimeout);
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = setTimeout(() => {
            setHovered(true);
          }, 80);
        } else {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          leaveTimeout = setTimeout(() => {
            setHovered(false);
          }, 220);
        }
      });

      // 2. Global hotkey toggle
      const unsubToggle = window.electronAPI.onToggleExpand(() => {
        setExpanded(mode !== 'expanded');
      });

      // 3. Shortcut conflict toast
      const unsubConflict = window.electronAPI.onShortcutConflict((data) => {
        setShortcutConflict(data.key);
      });

      // 4. Plugin approval request
      const unsubApproval = window.electronAPI.onPluginApprovalRequest((req) => {
        setApprovalRequest(req);
      });

      // 5. Plugin activity incoming
      const unsubActivity = window.electronAPI.onNewActivityFromPlugin((act) => {
        addOrUpdateActivity(act as Activity);
      });

      // 6. Real-time System Media (YouTube, Spotify, Chrome, Edge)
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
  }, [loadInitialSettings, mode, setHovered, setExpanded, setShortcutConflict, addOrUpdateActivity, removeActivity, clearActivities]);

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
  }, [syncBounds, mode, activities.length, isDrawerOpen, isSettingsOpen, isSimulatorOpen, approvalRequest]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSettingsOpen) toggleSettings();
        else if (isSimulatorOpen) setIsSimulatorOpen(false);
        else if (isDrawerOpen) toggleDrawer();
        else setExpanded(false);
      } else if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        cycleActivity('next');
      } else if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        cycleActivity('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, isSimulatorOpen, isDrawerOpen, toggleSettings, toggleDrawer, setExpanded, cycleActivity]);

  let secondaryLeft: Activity | null = null;
  let secondaryRight: Activity | null = null;
  let queuedCount = 0;

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
        {/* Top Flex Row: [Secondary Bubble L] [Primary Pill] [Secondary Bubble R] */}
        <div className="flex items-center justify-center gap-2">
          {/* Bubble Left */}
          <AnimatePresence>
            {secondaryLeft && (
              <SecondaryBubble
                key={`left-${secondaryLeft.id}`}
                activity={secondaryLeft}
                position="left"
                onClick={() => {
                  const idx = activities.findIndex((a) => a.id === secondaryLeft?.id);
                  if (idx >= 0) selectActivityIndex(idx);
                }}
              />
            )}
          </AnimatePresence>

          {/* Primary Main Pill */}
          <AnimatePresence>
            {primaryActivity && (
              <PrimaryPill
                key={primaryActivity.id}
                activity={primaryActivity}
                isExpanded={mode === 'expanded'}
                isPinned={isPinned}
                queuedCount={queuedCount}
                onTogglePin={togglePinned}
                onToggleExpand={() => {
                  const nextExpanded = mode !== 'expanded';
                  setExpanded(nextExpanded);
                  requestAnimationFrame(() => {
                    if (window.electronAPI) {
                      const centerX = window.innerWidth / 2;
                      if (nextExpanded) {
                        window.electronAPI.syncPillBounds({
                          x: Math.max(0, Math.round(centerX - 210)),
                          y: 0,
                          width: 420,
                          height: 175,
                        });
                      } else {
                        window.electronAPI.syncPillBounds({
                          x: Math.max(0, Math.round(centerX - 120)),
                          y: 0,
                          width: 240,
                          height: 56,
                        });
                      }
                    }
                  });
                }}
                onToggleDrawer={toggleDrawer}
                onDismiss={() => {
                  if (primaryActivity) removeActivity(primaryActivity.id);
                }}
                onActionClick={(actionId) => {
                  // Custom action handlers (play/pause toggle, etc.)
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
            )}
          </AnimatePresence>

          {/* Bubble Right */}
          <AnimatePresence>
            {secondaryRight && (
              <SecondaryBubble
                key={`right-${secondaryRight.id}`}
                activity={secondaryRight}
                position="right"
                onClick={() => {
                  const idx = activities.findIndex((a) => a.id === secondaryRight?.id);
                  if (idx >= 0) selectActivityIndex(idx);
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
          activeId={primaryActivity?.id}
          onSelect={(index) => {
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
        onClearAll={clearActivities}
        onQuit={() => {
          if (window.electronAPI) window.electronAPI.closeApp();
        }}
        onClose={() => setContextMenuPos(null)}
      />
    </div>
  );
};
