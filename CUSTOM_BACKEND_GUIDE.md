# Custom Backend Integration Guide

## Overview

The SOFT Projects Management System is now prepared with a **custom backend API layer** that works seamlessly alongside localStorage and mock data. All backend API calls are currently **commented out** so developers can uncomment them when the company's backend API is ready.

## Current Architecture

```
┌─────────────────────────────────┐
│     React Components             │
│    (UI Layer)                    │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│     dataService.ts              │
│  (localStorage/Mock Data)        │
│  Default: localStorage           │
└────────────────────────────────┘
             │
             └─→ [READY] customBackendService.ts
                (Backend API Layer)
                (All calls commented out)
```

## Files Added

### 1. **`src/utils/customBackendService.ts`** (350+ lines)
   - Complete custom backend API integration
   - All API calls are commented out and ready to uncomment
   - Handles authentication, applicants, files, and emails
   - Automatic error handling and network management
   - Clear documentation blocks above each commented endpoint

### 2. **`src/utils/backendConfig.ts`** (100+ lines)
   - Storage mode configuration
   - API endpoint mappings
   - Database schema documentation
   - Easy switching between modes

## Storage Modes (Switch Anytime)

```typescript
import { getStorageMode, setStorageMode } from './utils/backendConfig';

// Current mode (default: 'localStorage')
console.log(getStorageMode()); // 'localStorage'

// Switch to mock data
setStorageMode('mockData');

// Switch to custom backend (requires uncommented API calls)
setStorageMode('customBackend');

// Switch back to localStorage
setStorageMode('localStorage');
```

## Backend Configuration

### Set Backend URL

```typescript
import { getBackendConfig, setBackendConfig } from './utils/customBackendService';

setBackendConfig({
  enabled: true,
  baseUrl: 'https://api.yourdomain.com/api',
  timeout: 30000
});
```

### Or Use Environment Variable

```env
VITE_BACKEND_URL=https://api.yourdomain.com/api
```

## How to Uncomment Backend API Calls

All backend calls follow this pattern:

```typescript
/*
╔═══════════════════════════════════════════════════════════════╗
║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
║  Uncomment when your backend API is ready for connection     ║
║                                                               ║
║  Backend endpoint should:                                    ║
║  [ENDPOINT DETAILS]                                          ║
╚═══════════════════════════════════════════════════════════════╝

// ACTUAL CODE HERE (commented out)
*/

return {
  data: [],
  error: 'Backend is not enabled'
};
```

**To activate a backend call:**

1. Locate the function in `customBackendService.ts`
2. Find the `/*` that starts the comment block
3. Remove the `/*` and `*/` to uncomment
4. The actual API call code will now execute

### Example: Activating `getApplicants()`

**Before:**
```typescript
/*
╔═══════════════════════════════════════════════════════════════╗
...
╚═══════════════════════════════════════════════════════════════╝

const response = await makeRequest<{ applicants: Applicant[] }>(
  'GET',
  `/applicants?program=${program}`
);
*/

return {
  data: [],
  error: 'Backend is not enabled'
};
```

**After:**
```typescript
const response = await makeRequest<{ applicants: Applicant[] }>(
  'GET',
  `/applicants?program=${program}`
);

if (!response.success) {
  return {
    data: [],
    error: response.error
  };
}

return {
  data: response.data?.applicants || [],
  error: undefined
};
```

## API Endpoints Required by Backend

Your custom backend must implement these endpoints:

### Authentication

```
POST /auth/login
  Body: { username: string, password: string }
  Response: { token: string, user: { id, name, role } }

POST /auth/logout
  Response: { success: boolean }

POST /auth/refresh
  Response: { token: string }
```

### Applicants

```
GET /applicants?program=GIP
  Response: { applicants: Applicant[] }

GET /applicants?program=GIP&status=APPROVED
  Response: { applicants: Applicant[] }

GET /applicants?program=GIP&barangay=BALIBAGO
  Response: { applicants: Applicant[] }

POST /applicants
  Body: Applicant object
  Response: { applicant: Applicant }

PUT /applicants/{id}
  Body: Partial Applicant object
  Response: { applicant: Applicant }

DELETE /applicants/{id}
  Response: { success: boolean }

PATCH /applicants/{id}/archive
  Body: { archived: true }
  Response: { success: boolean }
```

### Files

```
POST /files/upload
  Body: FormData { file, bucket, path }
  Response: { url: string }

GET /files/download?bucket={bucket}&path={path}
  Response: Binary file data
```

### Emails

```
POST /emails/send-applicant
  Body: { to, name, status, program, applicantCode }
  Response: { success: boolean }
```

## Database Schema

Your backend database needs an `applicants` table with these fields:

```sql
CREATE TABLE applicants (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  middleName VARCHAR(100),
  lastName VARCHAR(100) NOT NULL,
  extensionName VARCHAR(20),
  birthDate DATE NOT NULL,
  age INT,
  residentialAddress TEXT,
  barangay VARCHAR(100),
  contactNumber VARCHAR(20),
  telephoneNumber VARCHAR(20),
  email VARCHAR(100),
  placeOfBirth VARCHAR(100),
  school VARCHAR(100),
  gender ENUM('MALE', 'FEMALE'),
  civilStatus VARCHAR(50),
  primaryEducation VARCHAR(100),
  primarySchoolName VARCHAR(100),
  primaryFrom VARCHAR(10),
  primaryTo VARCHAR(10),
  juniorHighEducation VARCHAR(100),
  juniorHighSchoolName VARCHAR(100),
  juniorHighFrom VARCHAR(10),
  juniorHighTo VARCHAR(10),
  seniorHighEducation VARCHAR(100),
  seniorHighSchoolName VARCHAR(100),
  seniorHighFrom VARCHAR(10),
  seniorHighTo VARCHAR(10),
  tertiarySchoolName VARCHAR(100),
  tertiaryEducation VARCHAR(100),
  tertiaryFrom VARCHAR(10),
  tertiaryTo VARCHAR(10),
  courseType VARCHAR(100),
  course VARCHAR(100),
  beneficiaryName VARCHAR(100),
  photoFileName VARCHAR(255),
  resumeFileName VARCHAR(255),
  encoder VARCHAR(100),
  status ENUM('PENDING', 'APPROVED', 'DEPLOYED', 'COMPLETED', 'REJECTED', 'RESIGNED'),
  dateSubmitted DATE,
  program ENUM('GIP', 'TUPAD'),
  idType VARCHAR(50),
  idNumber VARCHAR(50),
  occupation VARCHAR(100),
  averageMonthlyIncome VARCHAR(50),
  dependentName VARCHAR(100),
  relationshipToDependent VARCHAR(50),
  archived BOOLEAN DEFAULT FALSE,
  archivedDate DATE,
  interviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Integration Checklist

- [ ] Review API endpoints (listed above)
- [ ] Set up backend database with schema
- [ ] Implement authentication endpoints
- [ ] Implement applicant CRUD endpoints
- [ ] Implement file upload/download endpoints
- [ ] Implement email sending endpoints
- [ ] Test all endpoints with Postman/cURL
- [ ] Configure environment variable: `VITE_BACKEND_URL`
- [ ] Uncomment backend API calls in `customBackendService.ts`
- [ ] Test data synchronization
- [ ] Test error handling
- [ ] Deploy to production

## Testing Backend Before Uncommenting

### Test API Connection

```typescript
import { customBackendService, setBackendConfig } from './utils/customBackendService';

setBackendConfig({
  enabled: true,
  baseUrl: 'https://api.yourdomain.com/api'
});

// This will fail until you uncomment the actual API call
const result = await customBackendService.getApplicants('GIP');
console.log(result);
```

### Test with Postman/cURL

```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Test get applicants
curl -X GET http://localhost:3000/api/applicants?program=GIP \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## How to Uncomment Safely

1. **Make a backup** of `customBackendService.ts`
2. **Start with one endpoint** (e.g., `getApplicants`)
3. **Test thoroughly** with a small dataset
4. **Uncomment next endpoint** only if previous works
5. **Repeat** until all needed endpoints are active

### Using Find & Replace (VS Code)

For quick uncommenting:

1. Open `customBackendService.ts`
2. Use Find & Replace (Ctrl+H / Cmd+H)
3. Find: `/*\n    ╔`
4. Replace: (leave empty)
5. This removes opening comment brackets
6. Repeat for closing `╚═══` and `*/`

**But do this carefully!** It's better to uncomment manually to ensure each endpoint is tested.

## Fallback Behavior

If backend API call fails or is disabled:

```typescript
// Returns error response
{
  data: [],
  error: 'Backend is not enabled'
}

// System automatically falls back to localStorage
// User doesn't notice the failure
```

## Data Sync Strategy

### Option 1: Full Migration
```typescript
// Uncomment all backend calls
// All data syncs to backend immediately
```

### Option 2: Gradual Migration
```typescript
// Uncomment endpoints one by one
// Test each before moving to next
// Keep localStorage as fallback indefinitely
```

### Option 3: Dual-Write
```typescript
// Keep both localStorage and backend active
// Read from backend, fallback to localStorage
// Write to both (async to backend)
```

## Security Notes

### Authentication
- Tokens stored in localStorage
- Bearer token in Authorization header
- Auto-logout on 401 errors

### CORS
- Backend must have proper CORS headers
- Frontend sends appropriate Content-Type headers

### Data Validation
- Backend should validate all input
- Use HTTPS in production
- Implement rate limiting

### Sensitive Data
- Don't store passwords in localStorage
- Token expiration recommended
- HTTPS encryption required

## Troubleshooting

### Backend calls still return "Backend is not enabled"
→ Check if the API code is still commented out

### Network errors when calling backend
→ Verify `VITE_BACKEND_URL` environment variable
→ Check CORS headers on backend
→ Ensure backend server is running

### 401 Unauthorized errors
→ Verify token is in localStorage
→ Check token expiration
→ Try logging in again

### Data not syncing
→ Verify backend URL is correct
→ Check network requests in browser DevTools
→ Review backend logs

## Production Deployment

### Before Going Live

1. **Test all endpoints** with production data
2. **Implement proper error handling** on backend
3. **Set up monitoring** and logging
4. **Enable HTTPS** for all API calls
5. **Implement authentication** properly
6. **Test failover** and error scenarios
7. **Load test** the backend
8. **Document** any custom modifications

### Environment Variables

```env
# Development
VITE_BACKEND_URL=http://localhost:3000/api

# Production
VITE_BACKEND_URL=https://api.yourdomain.com/api
```

## Support & Documentation

For backend implementation help:

1. Review API endpoint specifications in this document
2. Check database schema requirements
3. Test endpoints with Postman before integration
4. Review error logs in browser console and backend logs
5. Contact your backend development team

## Summary

✅ **Custom backend layer is prepared**
✅ **All API calls are documented**
✅ **Easy to uncomment when ready**
✅ **localStorage remains default**
✅ **Mock data still available**
✅ **Zero breaking changes**

Ready to integrate your company's backend when the API is implemented!

---

**Next Steps:**
1. Implement backend API endpoints
2. Set `VITE_BACKEND_URL` environment variable
3. Uncomment API calls in `customBackendService.ts`
4. Test thoroughly before production deployment
