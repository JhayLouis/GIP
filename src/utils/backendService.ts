import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BackendConfig {
  useBackend: boolean;
  backendType: 'supabase' | 'localstorage';
}

const backendConfig: BackendConfig = {
  useBackend: false,
  backendType: 'localstorage'
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

export const backendService = {
  async getApplicants(program: 'GIP' | 'TUPAD'): Promise<DatabaseApplicant[]> {
    const config = getBackendConfig();

    if (config.useBackend && config.backendType === 'supabase') {
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('program', program)
        .eq('archived', false);

      if (error) throw error;
      return data || [];
    }

    return [];
  },

  async addApplicant(applicant: Omit<DatabaseApplicant, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseApplicant> {
    const config = getBackendConfig();

    if (config.useBackend && config.backendType === 'supabase') {
      const { data, error } = await supabase
        .from('applicants')
        .insert([applicant])
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    throw new Error('Backend not enabled');
  },

  async updateApplicant(id: string, applicant: Partial<DatabaseApplicant>): Promise<DatabaseApplicant> {
    const config = getBackendConfig();

    if (config.useBackend && config.backendType === 'supabase') {
      const { data, error } = await supabase
        .from('applicants')
        .update(applicant)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    throw new Error('Backend not enabled');
  },

  async deleteApplicant(id: string): Promise<void> {
    const config = getBackendConfig();

    if (config.useBackend && config.backendType === 'supabase') {
      const { error } = await supabase
        .from('applicants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
  },

  async archiveApplicant(id: string): Promise<void> {
    const config = getBackendConfig();

    if (config.useBackend && config.backendType === 'supabase') {
      const { error } = await supabase
        .from('applicants')
        .update({
          archived: true,
          archivedDate: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;
    }
  },

  async getApplicantByStatus(program: 'GIP' | 'TUPAD', status: string): Promise<DatabaseApplicant[]> {
    const config = getBackendConfig();

    if (config.useBackend && config.backendType === 'supabase') {
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('program', program)
        .eq('status', status)
        .eq('archived', false);

      if (error) throw error;
      return data || [];
    }

    return [];
  },

  async getApplicantByBarangay(program: 'GIP' | 'TUPAD', barangay: string): Promise<DatabaseApplicant[]> {
    const config = getBackendConfig();

    if (config.useBackend && config.backendType === 'supabase') {
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('program', program)
        .eq('barangay', barangay)
        .eq('archived', false);

      if (error) throw error;
      return data || [];
    }

    return [];
  },

  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const config = getBackendConfig();

    if (config.useBackend && config.backendType === 'supabase') {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return data.publicUrl;
    }

    throw new Error('Backend not enabled');
  },

  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const config = getBackendConfig();

    if (config.useBackend && config.backendType === 'supabase') {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) throw error;
      return data;
    }

    throw new Error('Backend not enabled');
  }
};

export default backendService;
