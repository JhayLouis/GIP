import { useEffect, useState } from 'react';
import { getBackendConfig, setBackendConfig } from '../utils/backendService';
import { syncService, getSyncStatus } from '../utils/syncService';

export const useBackendSync = () => {
  const [isBackendEnabled, setIsBackendEnabled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncErrors, setSyncErrors] = useState<string[]>([]);

  useEffect(() => {
    const config = getBackendConfig();
    setIsBackendEnabled(config.useBackend);
  }, []);

  const enableBackend = async () => {
    try {
      setIsSyncing(true);
      setBackendConfig({ useBackend: true, backendType: 'supabase' });
      await syncService.initializeSync();
      setIsBackendEnabled(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setSyncErrors([errorMsg]);
      setIsBackendEnabled(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const disableBackend = () => {
    setBackendConfig({ useBackend: false, backendType: 'localstorage' });
    setIsBackendEnabled(false);
  };

  const getSyncState = () => {
    const status = getSyncStatus();
    return {
      isSyncing: status.isSyncing,
      lastSyncTime: status.lastSyncTime,
      pendingChanges: status.pendingChanges,
      errors: status.syncErrors
    };
  };

  return {
    isBackendEnabled,
    isSyncing,
    syncErrors,
    enableBackend,
    disableBackend,
    getSyncState
  };
};

export default useBackendSync;
