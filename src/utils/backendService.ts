/*
  BACKEND SERVICE - SUPABASE INTEGRATION
  ======================================

  Current Mode: localStorage with mock data (DEFAULT)
  Available: Supabase PostgreSQL database (commented out, ready to use)

  SETUP INSTRUCTIONS TO ENABLE SUPABASE:
  =======================================

  1. Create Supabase Project:
     - Go to https://supabase.com
     - Create new project (PostgreSQL database)
     - Get your credentials from Project Settings > API

  2. Add to .env file:
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

  3. Install Supabase client:
     npm install @supabase/supabase-js

  4. In this file, uncomment the SUPABASE_ENABLED flag and the supabaseImpl object

  5. Replace the export at the bottom to use supabaseImpl instead of localStorageImpl

  SUPABASE TABLE SCHEMA:
  ======================
  The Supabase implementation expects these tables in your database:

  - applicants (id, code, firstName, lastName, email, barangay, status, program, etc.)
  - See SUPABASE_SETUP.md for full schema and migrations
*/

// ============================================
// SUPABASE CONFIGURATION (COMMENTED OUT)
// ============================================
/*
import { createClient } from '@supabase/supabase-js';

const SUPABASE_ENABLED = true;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
*/

// Keep localStorage as fallback when Supabase is disabled
const SUPABASE_ENABLED = false;

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
// SUPABASE BACKEND IMPLEMENTATION (COMMENTED OUT)
// ============================================
/*
const supabaseImpl = {
  async getApplicants(program: 'GIP' | 'TUPAD'): Promise<DatabaseApplicant[]> {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .eq('program', program)
      .eq('archived', false);

    if (error) throw new Error(error.message);
    return data || [];
  },

  async addApplicant(applicant: Omit<DatabaseApplicant, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseApplicant> {
    const { data, error } = await supabase
      .from('applicants')
      .insert([applicant])
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data || applicant as DatabaseApplicant;
  },

  async updateApplicant(id: string, applicant: Partial<DatabaseApplicant>): Promise<DatabaseApplicant> {
    const { data, error } = await supabase
      .from('applicants')
      .update(applicant)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data || (applicant as DatabaseApplicant);
  },

  async deleteApplicant(id: string): Promise<void> {
    const { error } = await supabase
      .from('applicants')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async archiveApplicant(id: string): Promise<void> {
    const { error } = await supabase
      .from('applicants')
      .update({
        archived: true,
        archivedDate: new Date().toISOString().split('T')[0]
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async getApplicantByStatus(program: 'GIP' | 'TUPAD', status: string): Promise<DatabaseApplicant[]> {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .eq('program', program)
      .eq('status', status)
      .eq('archived', false);

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getApplicantByBarangay(program: 'GIP' | 'TUPAD', barangay: string): Promise<DatabaseApplicant[]> {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .eq('program', program)
      .eq('barangay', barangay)
      .eq('archived', false);

    if (error) throw new Error(error.message);
    return data || [];
  },

  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return urlData?.publicUrl || path;
  },

  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) throw new Error(error.message);
    return data || new Blob();
  }
};
*/

// ============================================
// EXPORT SERVICE (USES SELECTED IMPLEMENTATION)
// ============================================
export const backendService = SUPABASE_ENABLED ? null : localStorageImpl;

export default backendService;
