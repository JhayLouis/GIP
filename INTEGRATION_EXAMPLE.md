# Backend Integration Example

## Phase 1: Non-Breaking Addition (Current State)

Backend services are available but dormant. All data flows through localStorage.

```typescript
// dataService.ts (unchanged)
export const getApplicants = (program: 'GIP' | 'TUPAD'): Applicant[] => {
  const key = program === 'GIP' ? STORAGE_KEYS.GIP_APPLICANTS : STORAGE_KEYS.TUPAD_APPLICANTS;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
```

## Phase 2: Add Backend Check (Optional Dual-Mode)

When ready, update dataService to check backend first:

```typescript
import { backendService, getBackendConfig } from './backendService';

export const getApplicants = async (program: 'GIP' | 'TUPAD'): Promise<Applicant[]> => {
  const config = getBackendConfig();

  // Try backend first
  if (config.useBackend) {
    try {
      return await backendService.getApplicants(program);
    } catch (error) {
      console.error('Backend fetch failed, falling back to localStorage:', error);
    }
  }

  // Fall back to localStorage
  const key = program === 'GIP' ? STORAGE_KEYS.GIP_APPLICANTS : STORAGE_KEYS.TUPAD_APPLICANTS;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
```

## Phase 3: Add Admin Control Panel

Create an admin setting to toggle backend:

```typescript
// components/Admin/BackendToggle.tsx
import { useBackendSync } from '../hooks/useBackendSync';
import { useState } from 'react';

export const BackendToggle = () => {
  const { isBackendEnabled, enableBackend, disableBackend, getSyncState } = useBackendSync();
  const [syncing, setSyncing] = useState(false);

  const handleToggle = async () => {
    setSyncing(true);
    try {
      if (isBackendEnabled) {
        disableBackend();
      } else {
        await enableBackend();
        // Optionally sync data
        const state = getSyncState();
        if (state.pendingChanges > 0) {
          console.log(`${state.pendingChanges} changes pending sync`);
        }
      }
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3>Backend Configuration</h3>
      <p>Current: {isBackendEnabled ? '🟢 Database' : '🔵 LocalStorage'}</p>
      <button
        onClick={handleToggle}
        disabled={syncing}
        className={`px-4 py-2 rounded ${
          syncing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {syncing ? 'Syncing...' : `Switch to ${isBackendEnabled ? 'LocalStorage' : 'Database'}`}
      </button>
    </div>
  );
};
```

## Phase 4: Sync Component

Show sync status to users:

```typescript
// components/Admin/SyncStatus.tsx
import { useBackendSync } from '../hooks/useBackendSync';
import { useEffect, useState } from 'react';

export const SyncStatus = () => {
  const { getSyncState } = useBackendSync();
  const [state, setState] = useState(getSyncState());

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getSyncState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gray-50 rounded">
      <h4>Sync Status</h4>
      {state.isSyncing && <p>🔄 Syncing...</p>}
      {state.lastSyncTime && (
        <p>Last sync: {state.lastSyncTime.toLocaleTimeString()}</p>
      )}
      {state.pendingChanges > 0 && (
        <p className="text-orange-600">⚠️ {state.pendingChanges} pending changes</p>
      )}
      {state.errors.length > 0 && (
        <div className="mt-2 text-red-600">
          <p>Errors:</p>
          <ul>
            {state.errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};
```

## Phase 5: Data Migration Utility

Create a migration script:

```typescript
// utils/migrationUtils.ts
import { backendService } from './backendService';
import { syncService } from './syncService';
import { getApplicants } from './dataService';

export const migrateToBackend = async (program: 'GIP' | 'TUPAD') => {
  console.log(`🚀 Starting migration for ${program}...`);

  try {
    // Get local data
    const localApplicants = getApplicants(program);
    console.log(`📦 Found ${localApplicants.length} local applicants`);

    // Sync to backend
    await syncService.syncLocalToBackend(program, localApplicants);
    console.log(`✅ Migration complete!`);

    return { success: true, count: localApplicants.length };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Migration failed: ${msg}`);
    return { success: false, error: msg };
  }
};

export const validateMigration = async (program: 'GIP' | 'TUPAD') => {
  const local = getApplicants(program);
  const backend = await backendService.getApplicants(program);

  const match = local.length === backend.length;
  console.log(`Validation: Local=${local.length}, Backend=${backend.length}, Match=${match}`);

  return { local: local.length, backend: backend.length, match };
};
```

## Phase 6: Environment-Based Configuration

Use environment variables to control backend:

```typescript
// src/utils/backendService.ts
const backendConfig: BackendConfig = {
  useBackend: import.meta.env.VITE_USE_BACKEND === 'true',
  backendType: (import.meta.env.VITE_BACKEND_TYPE || 'localstorage') as 'supabase' | 'localstorage'
};
```

Then in `.env`:
```
# Development
VITE_USE_BACKEND=false
VITE_BACKEND_TYPE=localstorage

# Production (when ready)
VITE_USE_BACKEND=true
VITE_BACKEND_TYPE=supabase
```

## Gradual Migration Timeline

**Week 1**: Backend infrastructure ready (✅ Done)
**Week 2**: Add optional backend toggle in admin panel
**Week 3**: Test with subset of data
**Week 4**: Full production migration
**Week 5**: Monitor and optimize

## Risk Mitigation

1. **Always keep localStorage**: Don't delete local data immediately
2. **Dual-write strategy**: Write to both systems during transition
3. **Gradual rollout**: Enable backend for small user group first
4. **Monitoring**: Track sync errors and performance
5. **Rollback plan**: Easy switch back to localStorage

```typescript
// Safe dual-write approach
export const addApplicant = (data: Applicant): Applicant => {
  // Write to localStorage (primary)
  const applicant = addApplicantLocal(data);

  // Write to backend (secondary) if enabled
  if (getBackendConfig().useBackend) {
    backendService.addApplicant(applicant).catch(error => {
      console.error('Backend write failed, but local data saved:', error);
    });
  }

  return applicant;
};
```

## Rollback Procedure

If issues occur:

```typescript
// Instantly revert to localStorage
setBackendConfig({ useBackend: false, backendType: 'localstorage' });

// All data continues to work from local storage
// No data loss, just switch back
```

---

**Key Principle**: The system is built for gradual, safe migration. No rushing, no breaking changes.
