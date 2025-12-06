# Backend Setup Guide

## Overview

The system is now backend-ready and prepared for Supabase database connection. The infrastructure is in place but not yet active. The application currently uses localStorage.

## Architecture

### Files Created

1. **`src/utils/backendService.ts`**
   - Main backend service for Supabase operations
   - Handles CRUD operations for applicants
   - File upload/download functionality
   - Backend configuration management

2. **`src/utils/syncService.ts`**
   - Synchronization service between localStorage and backend
   - Tracks sync status and errors
   - Handles data transformation between formats
   - File upload management

3. **`src/hooks/useBackendSync.ts`**
   - React hook for backend synchronization
   - Enable/disable backend switching
   - Sync state management

4. **`supabase/functions/applicants-handler/index.ts`**
   - Edge function for applicant operations
   - Backend endpoint handler (ready for implementation)
   - CORS configured for frontend access

5. **Database Migration**
   - `applicants` table with all required fields
   - RLS policies for security
   - Indexes for performance
   - Storage buckets for files

## How to Enable Backend

### Step 1: Deploy Edge Function

```bash
# Deploy the edge function
supabase functions deploy applicants-handler
```

### Step 2: Update Backend Configuration

In any component or service, you can enable the backend:

```typescript
import { setBackendConfig } from './utils/backendService';
import { syncService } from './utils/syncService';

// Enable backend
setBackendConfig({ useBackend: true, backendType: 'supabase' });

// Initialize sync
await syncService.initializeSync();

// Sync data from localStorage to backend
await syncService.syncLocalToBackend('GIP', localApplicants);
```

### Step 3: Modify Data Service

Update `src/utils/dataService.ts` to check backend before localStorage:

```typescript
import { backendService, getBackendConfig } from './backendService';

export const getApplicants = (program: 'GIP' | 'TUPAD'): Applicant[] => {
  const config = getBackendConfig();

  if (config.useBackend) {
    return backendService.getApplicants(program);
  }

  // Fall back to localStorage
  const key = program === 'GIP' ? STORAGE_KEYS.GIP_APPLICANTS : STORAGE_KEYS.TUPAD_APPLICANTS;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
```

## Current State

- **Backend Status**: DISABLED (using localStorage)
- **Supabase Status**: CONFIGURED
- **Database Schema**: CREATED
- **Edge Functions**: READY FOR DEPLOYMENT
- **Data Sync**: READY

## Using the Backend Hook

```typescript
import { useBackendSync } from './hooks/useBackendSync';

function MyComponent() {
  const {
    isBackendEnabled,
    enableBackend,
    disableBackend,
    getSyncState
  } = useBackendSync();

  const handleEnableBackend = async () => {
    await enableBackend();
    const state = getSyncState();
    console.log('Sync state:', state);
  };

  return (
    <div>
      <button onClick={handleEnableBackend}>
        Enable Backend
      </button>
      <p>Backend: {isBackendEnabled ? 'ON' : 'OFF'}</p>
    </div>
  );
}
```

## Environment Variables

Required variables (already configured in `.env`):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Data Flow

### Current (localStorage):
```
UI Component → dataService.ts → localStorage
```

### When Backend Enabled:
```
UI Component → dataService.ts → backendService.ts → Supabase
                              → syncService.ts ↔ localStorage (cache)
```

## Migration Checklist

When ready to fully migrate to backend:

- [ ] Deploy edge functions: `supabase functions deploy applicants-handler`
- [ ] Update `dataService.ts` to use `backendService`
- [ ] Add authentication context checks
- [ ] Implement offline mode with sync queue
- [ ] Test data synchronization
- [ ] Implement error handling and retry logic
- [ ] Set up monitoring and logging
- [ ] Deploy to production

## Testing Backend Ready State

The system is in "ready" state. To verify:

1. Check Supabase connection:
```typescript
import { supabase } from './utils/backendService';

const { data, error } = await supabase.from('applicants').select('count(*)');
console.log('Connection test:', { data, error });
```

2. Check backend config:
```typescript
import { getBackendConfig } from './utils/backendService';

const config = getBackendConfig();
console.log('Backend config:', config);
// Output: { useBackend: false, backendType: 'localstorage' }
```

## Notes

- All existing functionality remains unchanged
- localStorage is still the primary storage
- Backend infrastructure is prepared but dormant
- No breaking changes to current implementation
- Easy toggle between localStorage and Supabase

## Support

For integration questions or issues:
1. Check Supabase documentation: https://supabase.com/docs
2. Review Edge Functions: https://supabase.com/docs/guides/functions
3. Test RLS policies in Supabase dashboard
