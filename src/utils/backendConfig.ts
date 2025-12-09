export interface StorageMode {
  mode: 'localStorage' | 'mockData' | 'customBackend';
  description: string;
}

export const STORAGE_MODES: Record<string, StorageMode> = {
  LOCAL_STORAGE: {
    mode: 'localStorage',
    description: 'Store data in browser localStorage (default)'
  },
  MOCK_DATA: {
    mode: 'mockData',
    description: 'Use mock/sample data'
  },
  CUSTOM_BACKEND: {
    mode: 'customBackend',
    description: 'Connect to custom company backend API'
  }
};

let currentStorageMode: 'localStorage' | 'mockData' | 'customBackend' = 'localStorage';

export const getStorageMode = (): 'localStorage' | 'mockData' | 'customBackend' => {
  return currentStorageMode;
};

export const setStorageMode = (mode: 'localStorage' | 'mockData' | 'customBackend'): void => {
  console.log(`[Backend Config] Switching storage mode from "${currentStorageMode}" to "${mode}"`);
  currentStorageMode = mode;
};

export const BACKEND_API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'POST /auth/login',
    LOGOUT: 'POST /auth/logout',
    REFRESH: 'POST /auth/refresh'
  },
  APPLICANTS: {
    LIST: 'GET /applicants?program={program}',
    LIST_BY_STATUS: 'GET /applicants?program={program}&status={status}',
    LIST_BY_BARANGAY: 'GET /applicants?program={program}&barangay={barangay}',
    CREATE: 'POST /applicants',
    UPDATE: 'PUT /applicants/{id}',
    DELETE: 'DELETE /applicants/{id}',
    ARCHIVE: 'PATCH /applicants/{id}/archive'
  },
  FILES: {
    UPLOAD: 'POST /files/upload',
    DOWNLOAD: 'GET /files/download?bucket={bucket}&path={path}'
  },
  EMAILS: {
    SEND_APPLICANT: 'POST /emails/send-applicant'
  }
};

export const BACKEND_DATABASE_SCHEMA = {
  applicants: [
    'id (UUID/String)',
    'code (String, unique)',
    'firstName (String)',
    'middleName (String)',
    'lastName (String)',
    'extensionName (String)',
    'birthDate (String)',
    'age (Integer)',
    'residentialAddress (String)',
    'barangay (String)',
    'contactNumber (String)',
    'telephoneNumber (String)',
    'email (String)',
    'placeOfBirth (String)',
    'school (String)',
    'gender (MALE | FEMALE)',
    'civilStatus (String)',
    'primaryEducation (String)',
    'primarySchoolName (String)',
    'primaryFrom (String)',
    'primaryTo (String)',
    'juniorHighEducation (String)',
    'juniorHighSchoolName (String)',
    'juniorHighFrom (String)',
    'juniorHighTo (String)',
    'seniorHighEducation (String)',
    'seniorHighSchoolName (String)',
    'seniorHighFrom (String)',
    'seniorHighTo (String)',
    'tertiarySchoolName (String)',
    'tertiaryEducation (String)',
    'tertiaryFrom (String)',
    'tertiaryTo (String)',
    'courseType (String)',
    'course (String)',
    'beneficiaryName (String)',
    'photoFileName (String)',
    'resumeFileName (String)',
    'encoder (String)',
    'status (PENDING | APPROVED | DEPLOYED | COMPLETED | REJECTED | RESIGNED)',
    'dateSubmitted (String)',
    'program (GIP | TUPAD)',
    'idType (String)',
    'idNumber (String)',
    'occupation (String)',
    'averageMonthlyIncome (String)',
    'dependentName (String)',
    'relationshipToDependent (String)',
    'archived (Boolean)',
    'archivedDate (String)',
    'interviewed (Boolean)',
    'created_at (Timestamp)',
    'updated_at (Timestamp)'
  ]
};
