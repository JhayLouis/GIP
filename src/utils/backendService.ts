/*
  BACKEND API INTEGRATION
  This service uses localStorage and mock data by default.
  Uncomment the API calls below to connect to your custom backend.
  Remove localStorage implementation if not needed.

  To enable backend connection:
  1. Update .env file with your backend API URL:
     VITE_BACKEND_URL=https://api.sampledomain.com/api

  2. Backend API should implement these endpoints:
     - POST   /auth/login                    (Login)
     - GET    /applicants?program=GIP        (Get applicants)
     - POST   /applicants                    (Create applicant)
     - PUT    /applicants/{id}               (Update applicant)
     - DELETE /applicants/{id}               (Delete applicant)
     - PATCH  /applicants/{id}/archive       (Archive applicant)
     - POST   /files/upload                  (Upload file)
     - GET    /files/download                (Download file)
     - POST   /emails/send-applicant         (Send email)

  3. See BACKEND_API_INTEGRATION.md for complete specifications

  Currently using localStorage for local development.
  To switch to API backend, uncomment the API_ENABLED constant below.
*/

export interface BackendConfig {
  backendUrl: string;
}

// Set to true to enable API backend calls (comment out localStorage implementation)
const API_ENABLED = false;

const backendConfig: BackendConfig = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api'
};

export const setBackendConfig = (config: Partial<BackendConfig>) => {
  Object.assign(backendConfig, config);
};

export const getBackendConfig = (): BackendConfig => {
  return { ...backendConfig };
};

export interface DatabaseApplicant {
  id: string;
  code: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  birthDate: string;
  age: number;
  residentialAddress?: string;
  barangay: string;
  contactNumber: string;
  telephoneNumber?: string;
  email?: string;
  placeOfBirth?: string;
  school?: string;
  gender: 'MALE' | 'FEMALE';
  civilStatus?: string;
  primaryEducation?: string;
  primarySchoolName?: string;
  primaryFrom?: string;
  primaryTo?: string;
  juniorHighEducation?: string;
  juniorHighSchoolName?: string;
  juniorHighFrom?: string;
  juniorHighTo?: string;
  seniorHighEducation?: string;
  seniorHighSchoolName?: string;
  seniorHighFrom?: string;
  seniorHighTo?: string;
  tertiarySchoolName?: string;
  tertiaryEducation?: string;
  tertiaryFrom?: string;
  tertiaryTo?: string;
  courseType?: string;
  course?: string;
  beneficiaryName?: string;
  photoFileName?: string;
  resumeFileName?: string;
  encoder: string;
  status: 'PENDING' | 'APPROVED' | 'DEPLOYED' | 'COMPLETED' | 'REJECTED' | 'RESIGNED';
  dateSubmitted: string;
  program: 'GIP' | 'TUPAD';
  idType?: string;
  idNumber?: string;
  occupation?: string;
  averageMonthlyIncome?: string;
  dependentName?: string;
  relationshipToDependent?: string;
  archived?: boolean;
  archivedDate?: string;
  interviewed?: boolean;
  created_at?: string;
  updated_at?: string;
}

const APPLICANTS_STORAGE_KEY = 'soft_projects_applicants';

const getStoredApplicants = (): DatabaseApplicant[] => {
  try {
    const data = localStorage.getItem(APPLICANTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveApplicants = (applicants: DatabaseApplicant[]): void => {
  localStorage.setItem(APPLICANTS_STORAGE_KEY, JSON.stringify(applicants));
};

// LOCALSTORAGE IMPLEMENTATION (DEFAULT)
const localStorageImpl = {
  async getApplicants(program: 'GIP' | 'TUPAD'): Promise<DatabaseApplicant[]> {
    const applicants = getStoredApplicants();
    return applicants.filter(a => a.program === program && !a.archived);
  },

  async addApplicant(applicant: Omit<DatabaseApplicant, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseApplicant> {
    const applicants = getStoredApplicants();
    const newApplicant: DatabaseApplicant = {
      ...applicant,
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    applicants.push(newApplicant);
    saveApplicants(applicants);
    return newApplicant;
  },

  async updateApplicant(id: string, applicant: Partial<DatabaseApplicant>): Promise<DatabaseApplicant> {
    const applicants = getStoredApplicants();
    const index = applicants.findIndex(a => a.id === id);

    if (index === -1) {
      throw new Error('Applicant not found');
    }

    const updated: DatabaseApplicant = {
      ...applicants[index],
      ...applicant,
      id: applicants[index].id,
      updated_at: new Date().toISOString()
    };

    applicants[index] = updated;
    saveApplicants(applicants);
    return updated;
  },

  async deleteApplicant(id: string): Promise<void> {
    const applicants = getStoredApplicants();
    const filtered = applicants.filter(a => a.id !== id);
    saveApplicants(filtered);
  },

  async archiveApplicant(id: string): Promise<void> {
    const applicants = getStoredApplicants();
    const index = applicants.findIndex(a => a.id === id);

    if (index !== -1) {
      applicants[index].archived = true;
      applicants[index].archivedDate = new Date().toISOString().split('T')[0];
      saveApplicants(applicants);
    }
  },

  async getApplicantByStatus(program: 'GIP' | 'TUPAD', status: string): Promise<DatabaseApplicant[]> {
    const applicants = getStoredApplicants();
    return applicants.filter(a => a.program === program && a.status === status && !a.archived);
  },

  async getApplicantByBarangay(program: 'GIP' | 'TUPAD', barangay: string): Promise<DatabaseApplicant[]> {
    const applicants = getStoredApplicants();
    return applicants.filter(a => a.program === program && a.barangay === barangay && !a.archived);
  },

  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64 = reader.result as string;
        const fileKey = `file_${bucket}_${path}`;
        localStorage.setItem(fileKey, base64);
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  },

  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const fileKey = `file_${bucket}_${path}`;
    const data = localStorage.getItem(fileKey);

    if (!data) {
      throw new Error('File not found');
    }

    const byteString = atob(data.split(',')[1]);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([byteArray], { type: 'application/octet-stream' });
  }
};

// ============================================
// API BACKEND IMPLEMENTATION (COMMENTED OUT)
// ============================================
/*
const apiImpl = {
  async getApplicants(program: 'GIP' | 'TUPAD'): Promise<DatabaseApplicant[]> {
    const response = await fetch(`${backendConfig.backendUrl}/applicants?program=${program}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch applicants');
    return response.json();
  },

  async addApplicant(applicant: Omit<DatabaseApplicant, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseApplicant> {
    const response = await fetch(`${backendConfig.backendUrl}/applicants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      },
      body: JSON.stringify(applicant)
    });
    if (!response.ok) throw new Error('Failed to create applicant');
    return response.json();
  },

  async updateApplicant(id: string, applicant: Partial<DatabaseApplicant>): Promise<DatabaseApplicant> {
    const response = await fetch(`${backendConfig.backendUrl}/applicants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      },
      body: JSON.stringify(applicant)
    });
    if (!response.ok) throw new Error('Failed to update applicant');
    return response.json();
  },

  async deleteApplicant(id: string): Promise<void> {
    const response = await fetch(`${backendConfig.backendUrl}/applicants/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete applicant');
  },

  async archiveApplicant(id: string): Promise<void> {
    const response = await fetch(`${backendConfig.backendUrl}/applicants/${id}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      }
    });
    if (!response.ok) throw new Error('Failed to archive applicant');
  },

  async getApplicantByStatus(program: 'GIP' | 'TUPAD', status: string): Promise<DatabaseApplicant[]> {
    const response = await fetch(`${backendConfig.backendUrl}/applicants?program=${program}&status=${status}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch applicants by status');
    return response.json();
  },

  async getApplicantByBarangay(program: 'GIP' | 'TUPAD', barangay: string): Promise<DatabaseApplicant[]> {
    const response = await fetch(`${backendConfig.backendUrl}/applicants?program=${program}&barangay=${barangay}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch applicants by barangay');
    return response.json();
  },

  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('bucket', bucket);
    formData.append('path', path);
    formData.append('file', file);

    const response = await fetch(`${backendConfig.backendUrl}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      },
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload file');
    const data = await response.json();
    return data.url;
  },

  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const response = await fetch(`${backendConfig.backendUrl}/files/download?bucket=${bucket}&path=${path}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      }
    });
    if (!response.ok) throw new Error('Failed to download file');
    return response.blob();
  }
};
*/

// ============================================
// EXPORT SERVICE (USES SELECTED IMPLEMENTATION)
// ============================================
export const backendService = API_ENABLED ? null : localStorageImpl;

export default backendService;
