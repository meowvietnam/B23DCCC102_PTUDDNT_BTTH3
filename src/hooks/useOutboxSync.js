import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useNetworkStatus } from './useNetworkStatus';
import * as outbox from '../storage/outbox';
import { request } from '../api/client';

/**
 * Custom hook for managing outbox queue and automatic synchronization
 * 
 * @param {Function} [onSyncCompleted] Optional callback triggered when sync completes successfully
 * @returns {{
 *   pendingCount: number,
 *   syncing: boolean,
 *   syncNow: () => Promise<number>,
 *   refreshPendingCount: () => Promise<void>
 * }}
 */
export function useOutboxSync(onSyncCompleted) {
  const { isOnline } = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const isOnlineRef = useRef(isOnline);
  const wasOfflineRef = useRef(false);

  // Keep track of pending count
  const refreshPendingCount = useCallback(async () => {
    try {
      const items = await outbox.getAll();
      setPendingCount(items.length);
    } catch (_) {
      setPendingCount(0);
    }
  }, []);

  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  /**
   * Execute synchronization of all pending outbox actions
   */
  const syncNow = useCallback(async () => {
    if (syncing) return 0;
    setSyncing(true);

    let syncedCount = 0;
    try {
      const queue = await outbox.getAll();
      if (queue.length === 0) {
        setPendingCount(0);
        setSyncing(false);
        return 0;
      }

      for (const action of queue) {
        try {
          // B5: Conflict Detection for PATCH operations
          if (action.method === 'PATCH' && action.url) {
            try {
              const serverItem = await request('GET', action.url);
              if (serverItem && serverItem.updatedAt && action.createdAt) {
                const serverTime = new Date(serverItem.updatedAt).getTime();
                const localActionTime = new Date(action.createdAt).getTime();

                // If server data was updated after the offline action was created
                if (serverTime > localActionTime) {
                  Alert.alert(
                    'Xung đột dữ liệu (Conflict)',
                    `Dữ liệu trên máy chủ đã được cập nhật mới hơn thay đổi offline của bạn. Ứng dụng ưu tiên giữ dữ liệu mới nhất từ máy chủ.`
                  );
                  // Discard outdated local action
                  await outbox.remove(action.id);
                  continue;
                }
              }
            } catch (_) {
              // If fetching current item fails, attempt direct request below
            }
          }

          // Execute action on server
          await request(action.method, action.url, action.body);
          // Success: remove action from outbox
          await outbox.remove(action.id);
          syncedCount++;
        } catch (actionErr) {
          console.warn(`[Sync] Failed to process action ${action.id}:`, actionErr);
          // Break on error to retain order and retry on next sync
          break;
        }
      }

      const remaining = await outbox.getAll();
      setPendingCount(remaining.length);

      if (syncedCount > 0) {
        Alert.alert('Đồng bộ thành công', `Đã đồng bộ ${syncedCount} thay đổi.`);
        if (typeof onSyncCompleted === 'function') {
          onSyncCompleted();
        }
      }
    } catch (err) {
      console.warn('[useOutboxSync] Sync error:', err);
    } finally {
      setSyncing(false);
    }

    return syncedCount;
  }, [syncing, onSyncCompleted]);

  // Track online status changes to auto-sync when network returns
  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
    } else if (isOnline && wasOfflineRef.current) {
      wasOfflineRef.current = false;
      // Network returned, trigger auto sync
      syncNow();
    }
    isOnlineRef.current = isOnline;
  }, [isOnline, syncNow]);

  return {
    pendingCount,
    syncing,
    syncNow,
    refreshPendingCount,
  };
}

export default useOutboxSync;
