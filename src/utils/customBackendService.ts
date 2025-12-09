import { Applicant } from './dataService';

export interface BackendConfig {
  enabled: boolean;
  baseUrl: string;
  timeout: number;
}

const defaultConfig: BackendConfig = {
  enabled: false,
  baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
  timeout: 30000
};

let currentConfig: BackendConfig = { ...defaultConfig };

export const getBackendConfig = (): BackendConfig => {
  return { ...currentConfig };
};

export const setBackendConfig = (config: Partial<BackendConfig>): void => {
  currentConfig = { ...currentConfig, ...config };
};

export const resetBackendConfig = (): void => {
  currentConfig = { ...defaultConfig };
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const makeRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> => {
  const config = getBackendConfig();

  if (!config.enabled) {
    return {
      success: false,
      error: 'Backend is disabled'
    };
  }

  const url = `${config.baseUrl}${endpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    return {
      success: true,
      data: data as T,
      message: data.message
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Network error: ${errorMsg}`
    };
  }
};

export const customBackendService = {
  async getApplicants(program: 'GIP' | 'TUPAD'): Promise<{ data: Applicant[]; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should return:                             ║
    ║  GET /applicants?program=GIP (or TUPAD)                      ║
    ║  Response: { applicants: Applicant[] }                       ║
    ╚═══════════════════════════════════════════════════════════════╝

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
    */

    return {
      data: [],
      error: 'Backend is not enabled'
    };
  },

  async addApplicant(applicant: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'>): Promise<{ data?: Applicant; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  POST /applicants                                            ║
    ║  Body: Applicant object                                      ║
    ║  Response: { applicant: Applicant }                          ║
    ╚═══════════════════════════════════════════════════════════════╝

    const response = await makeRequest<{ applicant: Applicant }>(
      'POST',
      '/applicants',
      applicant
    );

    if (!response.success) {
      return {
        error: response.error
      };
    }

    return {
      data: response.data?.applicant,
      error: undefined
    };
    */

    return {
      error: 'Backend is not enabled'
    };
  },

  async updateApplicant(id: string, applicant: Partial<Applicant>): Promise<{ data?: Applicant; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  PUT /applicants/{id}                                        ║
    ║  Body: Partial Applicant object                              ║
    ║  Response: { applicant: Applicant }                          ║
    ╚═══════════════════════════════════════════════════════════════╝

    const response = await makeRequest<{ applicant: Applicant }>(
      'PUT',
      `/applicants/${id}`,
      applicant
    );

    if (!response.success) {
      return {
        error: response.error
      };
    }

    return {
      data: response.data?.applicant,
      error: undefined
    };
    */

    return {
      error: 'Backend is not enabled'
    };
  },

  async deleteApplicant(id: string): Promise<{ success: boolean; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  DELETE /applicants/{id}                                     ║
    ║  Response: { success: boolean }                              ║
    ╚═══════════════════════════════════════════════════════════════╝

    const response = await makeRequest<{ success: boolean }>(
      'DELETE',
      `/applicants/${id}`
    );

    return {
      success: response.success,
      error: response.error
    };
    */

    return {
      success: false,
      error: 'Backend is not enabled'
    };
  },

  async archiveApplicant(id: string): Promise<{ success: boolean; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  PATCH /applicants/{id}/archive                              ║
    ║  Body: { archived: true }                                    ║
    ║  Response: { success: boolean }                              ║
    ╚═══════════════════════════════════════════════════════════════╝

    const response = await makeRequest<{ success: boolean }>(
      'PATCH',
      `/applicants/${id}/archive`,
      { archived: true }
    );

    return {
      success: response.success,
      error: response.error
    };
    */

    return {
      success: false,
      error: 'Backend is not enabled'
    };
  },

  async getApplicantsByStatus(program: 'GIP' | 'TUPAD', status: string): Promise<{ data: Applicant[]; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  GET /applicants?program=GIP&status=APPROVED                 ║
    ║  Response: { applicants: Applicant[] }                       ║
    ╚═══════════════════════════════════════════════════════════════╝

    const response = await makeRequest<{ applicants: Applicant[] }>(
      'GET',
      `/applicants?program=${program}&status=${status}`
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
    */

    return {
      data: [],
      error: 'Backend is not enabled'
    };
  },

  async getApplicantsByBarangay(program: 'GIP' | 'TUPAD', barangay: string): Promise<{ data: Applicant[]; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  GET /applicants?program=GIP&barangay=BALIBAGO               ║
    ║  Response: { applicants: Applicant[] }                       ║
    ╚═══════════════════════════════════════════════════════════════╝

    const response = await makeRequest<{ applicants: Applicant[] }>(
      'GET',
      `/applicants?program=${program}&barangay=${barangay}`
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
    */

    return {
      data: [],
      error: 'Backend is not enabled'
    };
  },

  async uploadFile(bucket: string, path: string, file: File): Promise<{ url?: string; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  POST /files/upload                                          ║
    ║  Body: FormData with file, bucket, path                      ║
    ║  Response: { url: string }                                   ║
    ╚═══════════════════════════════════════════════════════════════╝

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    formData.append('path', path);

    try {
      const token = localStorage.getItem('auth_token');
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${currentConfig.baseUrl}/files/upload`, {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Upload failed'
        };
      }

      return {
        url: data.url,
        error: undefined
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Upload error'
      };
    }
    */

    return {
      error: 'Backend is not enabled'
    };
  },

  async downloadFile(bucket: string, path: string): Promise<{ blob?: Blob; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  GET /files/download?bucket=applicants&path={path}           ║
    ║  Response: Binary file data                                  ║
    ╚═══════════════════════════════════════════════════════════════╝

    try {
      const token = localStorage.getItem('auth_token');
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${currentConfig.baseUrl}/files/download?bucket=${bucket}&path=${encodeURIComponent(path)}`,
        { headers }
      );

      if (!response.ok) {
        return {
          error: `Download failed: ${response.statusText}`
        };
      }

      const blob = await response.blob();
      return {
        blob,
        error: undefined
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Download error'
      };
    }
    */

    return {
      error: 'Backend is not enabled'
    };
  },

  async login(username: string, password: string): Promise<{ token?: string; user?: any; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  POST /auth/login                                            ║
    ║  Body: { username, password }                                ║
    ║  Response: { token: string, user: { id, name, role } }       ║
    ╚═══════════════════════════════════════════════════════════════╝

    const response = await makeRequest<{ token: string; user: any }>(
      'POST',
      '/auth/login',
      { username, password }
    );

    if (!response.success) {
      return {
        error: response.error
      };
    }

    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return {
      token: response.data?.token,
      user: response.data?.user,
      error: undefined
    };
    */

    return {
      error: 'Backend is not enabled'
    };
  },

  async logout(): Promise<{ success: boolean; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  POST /auth/logout                                           ║
    ║  Response: { success: boolean }                              ║
    ╚═══════════════════════════════════════════════════════════════╝

    const response = await makeRequest<{ success: boolean }>(
      'POST',
      '/auth/logout'
    );

    localStorage.removeItem('auth_token');

    return {
      success: response.success,
      error: response.error
    };
    */

    localStorage.removeItem('auth_token');
    return {
      success: true
    };
  },

  async sendEmail(to: string, name: string, status: string, program: string, applicantCode: string): Promise<{ success: boolean; error?: string }> {
    /*
    ╔═══════════════════════════════════════════════════════════════╗
    ║  BACKEND API CALL - COMMENTED OUT UNTIL BACKEND IS READY     ║
    ║  Uncomment when your backend API is ready for connection     ║
    ║                                                               ║
    ║  Backend endpoint should:                                    ║
    ║  POST /emails/send-applicant                                 ║
    ║  Body: { to, name, status, program, applicantCode }          ║
    ║  Response: { success: boolean }                              ║
    ╚═══════════════════════════════════════════════════════════════╝

    const response = await makeRequest<{ success: boolean }>(
      'POST',
      '/emails/send-applicant',
      { to, name, status, program, applicantCode }
    );

    return {
      success: response.success,
      error: response.error
    };
    */

    return {
      success: false,
      error: 'Backend is not enabled'
    };
  }
};

export default customBackendService;
