const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000;

export interface BackendConfig {
  backendUrl: string;
}

const backendConfig: BackendConfig = {
  backendUrl: BACKEND_URL
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

const getAuthToken = (): string | null => {
  return localStorage.getItem('soft_projects_auth_token');
};

const buildHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const handleApiError = (error: any, message: string): never => {
  console.error(`API Error: ${message}`, error);
  throw new Error(error?.message || message);
};

export const backendService = {
  async getApplicants(program: 'GIP' | 'TUPAD'): Promise<DatabaseApplicant[]> {
    try {
      const response = await fetch(`${backendConfig.backendUrl}/applicants?program=${program}`, {
        method: 'GET',
        headers: buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return handleApiError(error, 'Failed to fetch applicants');
    }
  },

  async addApplicant(applicant: Omit<DatabaseApplicant, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseApplicant> {
    try {
      const response = await fetch(`${backendConfig.backendUrl}/applicants`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(applicant),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return handleApiError(error, 'Failed to add applicant');
    }
  },

  async updateApplicant(id: string, applicant: Partial<DatabaseApplicant>): Promise<DatabaseApplicant> {
    try {
      const response = await fetch(`${backendConfig.backendUrl}/applicants/${id}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(applicant),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return handleApiError(error, 'Failed to update applicant');
    }
  },

  async deleteApplicant(id: string): Promise<void> {
    try {
      const response = await fetch(`${backendConfig.backendUrl}/applicants/${id}`, {
        method: 'DELETE',
        headers: buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return handleApiError(error, 'Failed to delete applicant');
    }
  },

  async archiveApplicant(id: string): Promise<void> {
    try {
      const response = await fetch(`${backendConfig.backendUrl}/applicants/${id}/archive`, {
        method: 'PATCH',
        headers: buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return handleApiError(error, 'Failed to archive applicant');
    }
  },

  async getApplicantByStatus(program: 'GIP' | 'TUPAD', status: string): Promise<DatabaseApplicant[]> {
    try {
      const response = await fetch(`${backendConfig.backendUrl}/applicants?program=${program}&status=${status}`, {
        method: 'GET',
        headers: buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return handleApiError(error, 'Failed to fetch applicants by status');
    }
  },

  async getApplicantByBarangay(program: 'GIP' | 'TUPAD', barangay: string): Promise<DatabaseApplicant[]> {
    try {
      const response = await fetch(`${backendConfig.backendUrl}/applicants?program=${program}&barangay=${barangay}`, {
        method: 'GET',
        headers: buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return handleApiError(error, 'Failed to fetch applicants by barangay');
    }
  },

  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      formData.append('path', path);

      const token = getAuthToken();
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${backendConfig.backendUrl}/files/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.url || data.data?.url;
    } catch (error) {
      return handleApiError(error, 'Failed to upload file');
    }
  },

  async downloadFile(bucket: string, path: string): Promise<Blob> {
    try {
      const response = await fetch(`${backendConfig.backendUrl}/files/download?bucket=${bucket}&path=${path}`, {
        method: 'GET',
        headers: buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      return handleApiError(error, 'Failed to download file');
    }
  }
};

export default backendService;
