# Custom Backend Integration - Code Examples

## Quick Reference

### Import Backend Service

```typescript
import { customBackendService, setBackendConfig, getBackendConfig } from './utils/customBackendService';
import { getStorageMode, setStorageMode } from './utils/backendConfig';
```

## Example 1: Basic Backend Setup

```typescript
import { customBackendService, setBackendConfig } from './utils/customBackendService';

// Configure backend
setBackendConfig({
  enabled: true,
  baseUrl: 'https://api.yourcompany.com/api',
  timeout: 30000
});

// Get configuration
const config = getBackendConfig();
console.log('Backend URL:', config.baseUrl);
console.log('Backend Enabled:', config.enabled);
```

## Example 2: Switch Between Storage Modes

```typescript
import { getStorageMode, setStorageMode } from './utils/backendConfig';

// Check current mode
console.log('Current mode:', getStorageMode()); // 'localStorage' (default)

// Switch to mock data
setStorageMode('mockData');
console.log(getStorageMode()); // 'mockData'

// Switch to custom backend
setStorageMode('customBackend');
console.log(getStorageMode()); // 'customBackend'

// Back to localStorage
setStorageMode('localStorage');
```

## Example 3: Using Backend Service (After Uncommenting)

```typescript
import { customBackendService, setBackendConfig } from './utils/customBackendService';

async function loadApplicants() {
  setBackendConfig({ enabled: true, baseUrl: 'https://api.yourcompany.com/api' });

  const result = await customBackendService.getApplicants('GIP');

  if (result.error) {
    console.error('Failed to load applicants:', result.error);
    return [];
  }

  return result.data;
}
```

## Example 4: Creating New Applicant (Requires Backend)

```typescript
import { customBackendService } from './utils/customBackendService';

async function createApplicant(applicantData) {
  const result = await customBackendService.addApplicant(applicantData);

  if (result.error) {
    console.error('Failed to create applicant:', result.error);
    return null;
  }

  console.log('Applicant created:', result.data);
  return result.data;
}
```

## Example 5: Login with Backend

```typescript
import { customBackendService } from './utils/customBackendService';

async function handleLogin(username: string, password: string) {
  const result = await customBackendService.login(username, password);

  if (result.error) {
    console.error('Login failed:', result.error);
    return false;
  }

  console.log('Login successful!');
  console.log('Token:', result.token);
  console.log('User:', result.user);

  return true;
}
```

## Example 6: File Upload (Requires Backend)

```typescript
import { customBackendService } from './utils/customBackendService';

async function uploadApplicantPhoto(applicantId: string, photoFile: File) {
  const result = await customBackendService.uploadFile(
    'applicants',
    `${applicantId}/photo`,
    photoFile
  );

  if (result.error) {
    console.error('Upload failed:', result.error);
    return null;
  }

  console.log('File uploaded to:', result.url);
  return result.url;
}
```

## Example 7: Send Email Notification (Requires Backend)

```typescript
import { customBackendService } from './utils/customBackendService';

async function notifyApplicant(applicant) {
  const result = await customBackendService.sendEmail(
    applicant.email,
    applicant.firstName,
    applicant.status,
    applicant.program,
    applicant.code
  );

  if (result.error) {
    console.error('Email send failed:', result.error);
    return false;
  }

  console.log('Email sent successfully');
  return true;
}
```

## Example 8: React Component with Backend (After Uncommenting)

```typescript
import React, { useState, useEffect } from 'react';
import { customBackendService, setBackendConfig } from '../utils/customBackendService';
import { Applicant } from '../utils/dataService';

export const ApplicantsList: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Enable backend on mount
    setBackendConfig({
      enabled: true,
      baseUrl: process.env.VITE_BACKEND_URL || 'http://localhost:3000/api'
    });

    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    setLoading(true);
    setError(null);

    /*
    // UNCOMMENT WHEN BACKEND IS READY
    const result = await customBackendService.getApplicants('GIP');

    if (result.error) {
      setError(result.error);
    } else {
      setApplicants(result.data);
    }
    */

    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Applicants ({applicants.length})</h2>
      <ul>
        {applicants.map(app => (
          <li key={app.id}>{app.firstName} {app.lastName}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Example 9: Error Handling Pattern

```typescript
import { customBackendService } from './utils/customBackendService';

async function safeApplicantOperation(operationName: string, fn: () => Promise<any>) {
  try {
    console.log(`Starting: ${operationName}`);
    const result = await fn();

    if (result.error) {
      console.error(`${operationName} failed:`, result.error);
      // Fallback to localStorage here if needed
      return null;
    }

    console.log(`${operationName} succeeded`);
    return result.data;
  } catch (err) {
    console.error(`${operationName} exception:`, err);
    return null;
  }
}

// Usage
const applicants = await safeApplicantOperation(
  'Load GIP Applicants',
  () => customBackendService.getApplicants('GIP')
);
```

## Example 10: Dual-Mode Usage (localStorage + Backend)

```typescript
import { getApplicants } from './dataService'; // localStorage
import { customBackendService, getBackendConfig } from './utils/customBackendService';
import { getStorageMode } from './utils/backendConfig';

async function getApplicantsWithFallback(program: 'GIP' | 'TUPAD') {
  const storageMode = getStorageMode();
  const config = getBackendConfig();

  // Try backend first if enabled
  if (storageMode === 'customBackend' && config.enabled) {
    const result = await customBackendService.getApplicants(program);
    if (!result.error) {
      console.log('Loaded from backend');
      return result.data;
    }
    console.log('Backend failed, falling back to localStorage:', result.error);
  }

  // Fall back to localStorage
  console.log('Loading from localStorage');
  return getApplicants(program);
}
```

## Example 11: Update Applicant Status

```typescript
import { customBackendService } from './utils/customBackendService';
import { Applicant } from './dataService';

async function updateApplicantStatus(
  id: string,
  newStatus: Applicant['status']
) {
  const result = await customBackendService.updateApplicant(id, {
    status: newStatus,
    interviewed: newStatus !== 'PENDING'
  });

  if (result.error) {
    console.error('Update failed:', result.error);
    return false;
  }

  console.log('Applicant status updated:', result.data);
  return true;
}
```

## Example 12: Archive Applicant

```typescript
import { customBackendService } from './utils/customBackendService';

async function archiveApplicant(id: string) {
  const result = await customBackendService.archiveApplicant(id);

  if (result.error) {
    console.error('Archive failed:', result.error);
    return false;
  }

  console.log('Applicant archived successfully');
  return true;
}
```

## Example 13: Filter By Status (Requires Backend)

```typescript
import { customBackendService } from './utils/customBackendService';

async function getApprovedApplicants(program: 'GIP' | 'TUPAD') {
  const result = await customBackendService.getApplicantsByStatus(program, 'APPROVED');

  if (result.error) {
    console.error('Filter failed:', result.error);
    return [];
  }

  console.log(`Found ${result.data.length} approved applicants`);
  return result.data;
}
```

## Example 14: Filter By Barangay (Requires Backend)

```typescript
import { customBackendService } from './utils/customBackendService';

async function getBarangayApplicants(program: 'GIP' | 'TUPAD', barangay: string) {
  const result = await customBackendService.getApplicantsByBarangay(program, barangay);

  if (result.error) {
    console.error('Filter failed:', result.error);
    return [];
  }

  return result.data;
}
```

## Example 15: Complete Login Flow

```typescript
import { customBackendService, setBackendConfig } from './utils/customBackendService';

async function completeLoginFlow(username: string, password: string) {
  // Configure backend first
  setBackendConfig({
    enabled: true,
    baseUrl: process.env.VITE_BACKEND_URL
  });

  // Attempt login
  const loginResult = await customBackendService.login(username, password);

  if (loginResult.error) {
    console.error('Login error:', loginResult.error);
    return {
      success: false,
      error: loginResult.error
    };
  }

  // Store user info
  localStorage.setItem('user_id', loginResult.user?.id);
  localStorage.setItem('username', loginResult.user?.name);
  localStorage.setItem('user_role', loginResult.user?.role);

  return {
    success: true,
    user: loginResult.user,
    token: loginResult.token
  };
}
```

## Example 16: Logout Flow

```typescript
import { customBackendService } from './utils/customBackendService';

async function handleLogout() {
  // Call backend logout
  const result = await customBackendService.logout();

  if (result.error) {
    console.error('Logout error:', result.error);
  }

  // Clear local storage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('user_role');

  // Redirect to login
  window.location.href = '/login';
}
```

## Uncommenting Checklist

To uncomment and test backend calls:

```
[ ] 1. Review CUSTOM_BACKEND_GUIDE.md
[ ] 2. Implement backend API endpoints
[ ] 3. Set VITE_BACKEND_URL environment variable
[ ] 4. Test endpoints with Postman/cURL
[ ] 5. Open customBackendService.ts
[ ] 6. Find first function to uncomment (e.g., getApplicants)
[ ] 7. Remove /* and */ around the code
[ ] 8. Save and test in browser
[ ] 9. Verify it works with backend
[ ] 10. Move to next function
[ ] 11. Repeat until all needed functions are active
[ ] 12. Test error handling
[ ] 13. Test with real production data
[ ] 14. Deploy to production
```

## Best Practices

1. **Always check for errors**: `if (result.error) { ... }`
2. **Use try-catch for safety**: Wrap async calls
3. **Test endpoints first**: Use Postman before uncommenting
4. **Keep localStorage as fallback**: Don't delete local data
5. **Log important operations**: Help with debugging
6. **Handle network errors**: User-friendly error messages
7. **Use environment variables**: Different URLs for dev/prod
8. **Implement proper auth**: Secure token management

---

Ready to integrate? Start with Example 1 and work through uncommenting calls as your backend is implemented!
