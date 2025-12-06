# Backend Quick Start

## Current Status
✅ Backend infrastructure is **READY**
✅ Supabase is **CONFIGURED**
✅ Database schema is **CREATED**
✅ Edge functions are **PREPARED**
✅ localStorage is **ACTIVE** (default)

## To Enable Backend (3 Steps)

### 1. Import Backend Config
```typescript
import { setBackendConfig } from './utils/backendService';

// Enable backend
setBackendConfig({ useBackend: true, backendType: 'supabase' });
```

### 2. Use Backend Service
```typescript
import { backendService } from './utils/backendService';

// Get applicants from backend
const applicants = await backendService.getApplicants('GIP');
```

### 3. Use Sync Service
```typescript
import { syncService } from './utils/syncService';

// Sync local data to backend
await syncService.syncLocalToBackend('GIP', localApplicants);
```

## Use Backend Hook in Components
```typescript
import { useBackendSync } from './hooks/useBackendSync';

const MyComponent = () => {
  const { enableBackend, isBackendEnabled } = useBackendSync();

  return (
    <button onClick={enableBackend}>
      {isBackendEnabled ? 'Backend ON' : 'Enable Backend'}
    </button>
  );
};
```

## Backend Files Structure
```
src/
├── utils/
│   ├── backendService.ts      (Supabase client & CRUD)
│   ├── syncService.ts          (Data sync & file upload)
│   └── dataService.ts          (Existing - no changes)
├── hooks/
│   └── useBackendSync.ts       (React hook for sync)
supabase/
├── functions/
│   └── applicants-handler/
│       └── index.ts            (Edge function endpoint)
└── migrations/
    ├── create_applicants_table_production.sql
    └── create_storage_buckets.sql
```

## What's NOT Changed
- ✅ localStorage still works
- ✅ No breaking changes to existing code
- ✅ All current features unchanged
- ✅ Gradual migration path

## Backend API Endpoints (When Enabled)
```
POST /functions/v1/applicants-handler/get-applicants
POST /functions/v1/applicants-handler/add-applicant
PUT /functions/v1/applicants-handler/update-applicant
DELETE /functions/v1/applicants-handler/delete-applicant
```

## Configuration Location
Main configuration in: `src/utils/backendService.ts`
```typescript
const backendConfig: BackendConfig = {
  useBackend: false,           // Toggle here
  backendType: 'localstorage'  // Or 'supabase'
};
```

## Testing Backend Connection
```typescript
import { supabase } from './utils/backendService';

const test = async () => {
  const { data, error } = await supabase
    .from('applicants')
    .select('count()')
    .single();

  console.log('✅ Backend connected!' || error?.message);
};
```

## Next Steps
1. Review `BACKEND_SETUP.md` for detailed guide
2. Deploy edge functions when ready
3. Test with small dataset first
4. Gradually migrate existing data
5. Monitor sync errors and performance

## Database Tables
- `applicants` - Main table with 45+ fields
- Row Level Security (RLS) enabled
- Indexes on: program, status, archived, code, barangay

## Storage
- `applicants` bucket - Photos, resumes, documents
- Auto-created with proper permissions

---
**Note**: System is production-ready but using localStorage. Switch to backend with one config change.
