import React, { createContext, useContext } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useOutboxSync } from '../hooks/useOutboxSync';

const SyncContext = createContext({
  isOnline: true,
  pendingCount: 0,
  syncing: false,
  syncNow: async () => 0,
  refreshPendingCount: async () => {},
});

export function SyncProvider({ children, onSyncCompleted }) {
  const { isOnline } = useNetworkStatus();
  const { pendingCount, syncing, syncNow, refreshPendingCount } = useOutboxSync(onSyncCompleted);

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        pendingCount,
        syncing,
        syncNow,
        refreshPendingCount,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}

export default SyncContext;
