# Backend Integration Guide

## Overview

The system is now **backend-ready** and prepared for connection to your company's database. All Supabase references have been removed. The application currently uses localStorage as the default storage, but is fully prepared for backend integration.

## Architecture

### Backend-Ready Files

1. **`src/utils/backendService.ts`**
   - Main backend service for API operations
   - Handles CRUD operations for applicants
   - File upload/download functionality
   - Backend configuration management
   - **Backend Connection Guide**: See the comprehensive guide at the top of this file

2. **`src/utils/syncService.ts`**
   - Synchronization service between localStorage and backend
   - Tracks sync status and errors
   - Handles data transformation between formats
   - File upload/download management

3. **`src/hooks/useBackendSync.ts`**
   - React hook for backend synchronization
   - Enable/disable backend switching
   - Sync state management
   - All backend calls are **COMMENTED OUT** - uncomment when ready

4. **`src/utils/auth.ts`**
   - Authentication service using backend API
   - Login/logout functionality
   - Token management via localStorage
   - Ready for company's backend

5. **`src/utils/emailService.ts`**
   - Email sending service
   - Backend API ready
   - Uses company's API endpoint

## Current Configuration

The system uses these environment variables (in `.env`):

```
# Backend API Configuration
VITE_BACKEND_URL=http://localhost:3000/api

# Example for production:
# VITE_BACKEND_URL=https://api.sampledomain.com/api
```

## How to Enable Backend

### Step 1: Update Environment Variables

Update `.env` with your company's backend URL:

```
VITE_BACKEND_URL=https://api.sampledomain.com/api
```

### Step 2: Implement Backend API Endpoints

Your backend API must implement these endpoints:

#### Authentication
```
POST   /auth/login
```
Request: `{ username: string, password: string }`
Response: `{ token: string, user: { id, username, role, name } }`

#### Applicants
```
GET    /applicants?program=GIP
POST   /applicants
PUT    /applicants/{id}
DELETE /applicants/{id}
PATCH  /applicants/{id}/archive
GET    /applicants?program=GIP&status=APPROVED
GET    /applicants?program=GIP&barangay=SanDiego
```

#### Files
```
POST   /files/upload
GET    /files/download?bucket=applicants&path={path}
```

#### Emails
```
POST   /emails/send-applicant
```
Request: `{ to, name, status, program, applicantCode }`

### Step 3: Database Schema

Your database must have an `applicants` table with these fields:

```
- id (UUID/String, Primary Key)
- code (String)
- firstName (String)
- middleName (String, Optional)
- lastName (String)
- extensionName (String, Optional)
- birthDate (String)
- age (Integer)
- residentialAddress (String, Optional)
- barangay (String)
- contactNumber (String)
- telephoneNumber (String, Optional)
- email (String, Optional)
- placeOfBirth (String, Optional)
- school (String, Optional)
- gender (MALE | FEMALE)
- civilStatus (String, Optional)
- primaryEducation (String, Optional)
- primarySchoolName (String, Optional)
- primaryFrom (String, Optional)
- primaryTo (String, Optional)
- juniorHighEducation (String, Optional)
- juniorHighSchoolName (String, Optional)
- juniorHighFrom (String, Optional)
- juniorHighTo (String, Optional)
- seniorHighEducation (String, Optional)
- seniorHighSchoolName (String, Optional)
- seniorHighFrom (String, Optional)
- seniorHighTo (String, Optional)
- tertiarySchoolName (String, Optional)
- tertiaryEducation (String, Optional)
- tertiaryFrom (String, Optional)
- tertiaryTo (String, Optional)
- courseType (String, Optional)
- course (String, Optional)
- beneficiaryName (String, Optional)
- photoFileName (String, Optional)
- resumeFileName (String, Optional)
- encoder (String)
- status (PENDING | APPROVED | DEPLOYED | COMPLETED | REJECTED | RESIGNED)
- dateSubmitted (String)
- program (GIP | TUPAD)
- idType (String, Optional)
- idNumber (String, Optional)
- occupation (String, Optional)
- averageMonthlyIncome (String, Optional)
- dependentName (String, Optional)
- relationshipToDependent (String, Optional)
- archived (Boolean, Optional)
- archivedDate (String, Optional)
- interviewed (Boolean, Optional)
- created_at (Timestamp, Optional)
- updated_at (Timestamp, Optional)
```

### Step 4: Uncomment Backend Sync Code

In `src/hooks/useBackendSync.ts`, uncomment the backend sync code:

```typescript
// Change from:
setIsBackendEnabled(false); // Using localStorage by default

// To:
const config = getBackendConfig();
setIsBackendEnabled(config.useBackend);
```

And in the `enableBackend()` function:

```typescript
// Uncomment these lines:
// setBackendConfig({ useBackend: true });
// await syncService.initializeSync();
// setIsBackendEnabled(true);
```

### Step 5: Update Data Service (Optional)

For better performance, update `src/utils/dataService.ts` to use backend:

```typescript
import { backendService, getBackendConfig } from './backendService';

export const getApplicants = async (program: 'GIP' | 'TUPAD'): Promise<Applicant[]> => {
  const config = getBackendConfig();

  if (config.useBackend) {
    try {
      return await backendService.getApplicants(program);
    } catch (error) {
      console.error('Backend error, falling back to localStorage:', error);
    }
  }

  // Fall back to localStorage
  const key = program === 'GIP' ? STORAGE_KEYS.GIP_APPLICANTS : STORAGE_KEYS.TUPAD_APPLICANTS;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
```

## Current State

- **Backend Status**: DISABLED (using localStorage)
- **Backend API**: READY FOR INTEGRATION
- **Authentication**: Backend-ready with localStorage tokens
- **Database Connection**: All code commented out and ready
- **Data Sync**: Ready to activate

## Data Flow

### Current (localStorage):
```
UI Component → dataService.ts → localStorage
```

### When Backend Enabled:
```
UI Component → dataService.ts → backendService.ts → Your Backend API → Your Database
                              ↓
                           localStorage (cache)
```

## Testing Backend Ready State

To verify the backend integration is working:

1. Check backend URL:
```typescript
import { getBackendConfig } from './utils/backendService';

const config = getBackendConfig();
console.log('Backend URL:', config.backendUrl);
// Should show: https://api.sampledomain.com/api
```

2. Test login endpoint:
```typescript
const response = await fetch('https://api.sampledomain.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'password' })
});
const data = await response.json();
console.log('Login response:', data);
```

## Implementation Checklist

When ready to fully migrate to backend:

- [ ] Update `.env` with your backend URL
- [ ] Implement all required backend API endpoints
- [ ] Create database tables matching the schema
- [ ] Test API endpoints with Postman/cURL
- [ ] Uncomment backend sync code in `useBackendSync.ts`
- [ ] Update data service to use backend (optional)
- [ ] Test data synchronization
- [ ] Implement error handling and retry logic
- [ ] Set up monitoring and logging
- [ ] Test with production data
- [ ] Deploy to production

## Security Notes

- All API calls include Authorization header with stored token
- Tokens are stored in localStorage
- Do NOT store sensitive data in localStorage
- Implement proper CORS headers on backend
- Validate all input on backend API
- Use HTTPS in production
- Implement rate limiting on backend

## Troubleshooting

### "Network error" when calling backend
- Check if VITE_BACKEND_URL is correct in .env
- Verify backend API is running
- Check CORS headers on backend
- Verify network connectivity

### "Unauthorized" errors
- Check if token is stored in localStorage
- Verify token expiration
- Try logging in again
- Check backend authentication logic

### Data not syncing
- Verify backend URL is correct
- Check network requests in browser DevTools
- Review backend API logs
- Verify database connection on backend

## Support

For backend integration help:
1. Review the backend connection guide in `src/utils/backendService.ts`
2. Check API endpoint specifications above
3. Test endpoints with Postman/cURL before integration
4. Review error logs in browser console and backend logs
5. Contact your backend team for API issues
