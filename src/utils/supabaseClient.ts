import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: any = null;

const getSupabase = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

export const supabase = new Proxy({}, {
  get: (target, prop) => {
    return getSupabase()[prop];
  }
});

export interface Database {
  public: {
    Tables: {
      applicants: {
        Row: {
          id: string;
          code: string;
          first_name: string;
          middle_name: string | null;
          last_name: string;
          extension_name: string | null;
          birth_date: string;
          age: number;
          residential_address: string | null;
          barangay: string;
          contact_number: string;
          telephone_number: string | null;
          email: string | null;
          place_of_birth: string | null;
          school: string | null;
          gender: string;
          civil_status: string | null;
          primary_education: string | null;
          primary_school_name: string | null;
          secondary_education: string | null;
          secondary_school_name: string | null;
          tertiary_education: string | null;
          tertiary_school_name: string | null;
          educational_attainment: string | null;
          course: string | null;
          beneficiary_name: string | null;
          photo_file_name: string | null;
          photo_file_data: string | null;
          resume_file_name: string | null;
          resume_file_data: string | null;
          encoder: string;
          status: string;
          program: string;
          id_type: string | null;
          id_number: string | null;
          occupation: string | null;
          average_monthly_income: string | null;
          dependent_name: string | null;
          relationship_to_dependent: string | null;
          archived: boolean;
          archived_date: string | null;
          interviewed: boolean;
          date_submitted: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['applicants']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['applicants']['Insert']>;
      };
    };
  };
}
