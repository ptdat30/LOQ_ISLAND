import { describe, it, expect, beforeEach } from 'vitest';
import { useActivityStore } from '../src/stores/activityStore';
import type { Activity } from '../src/types/activity';

describe('Activity Store & Priority Queue', () => {
  beforeEach(() => {
    useActivityStore.getState().clearActivities();
  });

  it('orders activities by priority descending', () => {
    const store = useActivityStore.getState();

    const lowPriority: Activity = {
      id: 'low',
      app: 'Notes',
      type: 'custom',
      title: 'Low priority note',
      priority: 10,
      createdAt: 1000,
    };

    const highPriority: Activity = {
      id: 'high',
      app: 'Phone',
      type: 'call',
      title: 'Incoming Call',
      priority: 95,
      createdAt: 1000,
    };

    const mediumPriority: Activity = {
      id: 'med',
      app: 'Spotify',
      type: 'media',
      title: 'Song playing',
      priority: 50,
      createdAt: 1000,
    };

    store.addOrUpdateActivity(lowPriority);
    store.addOrUpdateActivity(highPriority);
    store.addOrUpdateActivity(mediumPriority);

    const activities = useActivityStore.getState().activities;
    expect(activities.length).toBe(3);
    expect(activities[0].id).toBe('high');
    expect(activities[1].id).toBe('med');
    expect(activities[2].id).toBe('low');
  });

  it('correctly handles TTL expiration cleanup', () => {
    const store = useActivityStore.getState();
    const now = Date.now();

    const expiredActivity: Activity = {
      id: 'expired-1',
      app: 'Timer',
      type: 'timer',
      title: 'Past countdown',
      priority: 50,
      ttl: 500, // 500ms
      createdAt: now - 1000, // 1s ago -> already expired
    };

    const validActivity: Activity = {
      id: 'valid-1',
      app: 'Timer',
      type: 'timer',
      title: 'Active countdown',
      priority: 50,
      ttl: 60000,
      createdAt: now,
    };

    store.addOrUpdateActivity(expiredActivity);
    store.addOrUpdateActivity(validActivity);

    expect(useActivityStore.getState().activities.length).toBe(2);

    store.cleanupExpired();

    const remaining = useActivityStore.getState().activities;
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe('valid-1');
  });

  it('enforces hard cap of 20 activities max', () => {
    const store = useActivityStore.getState();

    for (let i = 0; i < 25; i++) {
      store.addOrUpdateActivity({
        id: `act-${i}`,
        app: 'TestApp',
        type: 'custom',
        title: `Task #${i}`,
        priority: i,
        createdAt: Date.now() + i,
      });
    }

    const activities = useActivityStore.getState().activities;
    expect(activities.length).toBe(20);
  });
});
