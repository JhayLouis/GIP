import { supabase } from './supabaseClient';

export interface Applicant {
  civilStats: string;
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
  secondaryEducation?: string;
  secondarySchoolName?: string;
  tertiarySchoolName?: string;
  tertiaryEducation?: string;
  course?: string;
  beneficiaryName?: string;
  photoFile?: File;
  photoFileName?: string;
  photoFileData?: string;
  resumeFile?: File;
  resumeFileName?: string;
  resumeFileData?: string;
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
}

export interface Statistics {
  totalApplicants: number;
  pending: number;
  approved: number;
  deployed: number;
  completed: number;
  rejected: number;
  resigned: number;
  interviewed: number;
  barangaysCovered: number;
  maleCount: number;
  femaleCount: number;

  pendingMale: number;
  pendingFemale: number;
  approvedMale: number;
  approvedFemale: number;
  deployedMale: number;
  deployedFemale: number;
  completedMale: number;
  completedFemale: number;
  rejectedMale: number;
  rejectedFemale: number;
  resignedMale: number;
  resignedFemale: number;
  interviewedMale: number;
  interviewedFemale: number;
}

export interface BarangayStats {
  barangay: string;
  total: number;
  male: number;
  female: number;
  pending: number;
  approved: number;
  deployed: number;
  completed: number;
  rejected: number;
  resigned: number;
}

export interface StatusStats {
  status: string;
  total: number;
  male: number;
  female: number;
  color: string;
}

export interface GenderStats {
  gender: 'MALE' | 'FEMALE';
  total: number;
  pending: number;
  approved: number;
  deployed: number;
  completed: number;
  rejected: number;
  resigned: number;
}

const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const convertToDbFormat = (applicant: any): any => {
  const dbApplicant: any = {};
  for (const key in applicant) {
    if (key === 'photoFile' || key === 'resumeFile') continue;
    const snakeKey = toSnakeCase(key);
    dbApplicant[snakeKey] = applicant[key] === undefined ? null : applicant[key];
  }
  return dbApplicant;
};

const convertFromDbFormat = (dbApplicant: any): Applicant => {
  const applicant: any = {};
  for (const key in dbApplicant) {
    const camelKey = toCamelCase(key);
    applicant[camelKey] = dbApplicant[key];
  }
  return applicant as Applicant;
};

export const getApplicants = async (program: 'GIP' | 'TUPAD'): Promise<Applicant[]> => {
  try {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .eq('program', program)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(convertFromDbFormat);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return [];
  }
};

export const generateApplicantCode = async (program: 'GIP' | 'TUPAD'): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('applicants')
      .select('code')
      .eq('program', program)
      .like('code', `${program}-%`)
      .order('code', { ascending: false })
      .limit(1);

    if (error) throw error;

    let maxNumber = 0;
    if (data && data.length > 0) {
      const match = data[0].code.match(new RegExp(`${program}-(\\d+)`));
      if (match) {
        maxNumber = parseInt(match[1], 10);
      }
    }

    const next = (maxNumber + 1).toString().padStart(6, '0');
    return `${program}-${next}`;
  } catch (error) {
    console.error('Error generating applicant code:', error);
    return `${program}-000001`;
  }
};

export const addApplicant = async (applicantData: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'>): Promise<Applicant> => {
  try {
    const code = await generateApplicantCode(applicantData.program);
    const dbApplicant = convertToDbFormat({
      ...applicantData,
      code,
      dateSubmitted: new Date().toISOString().split('T')[0]
    });

    const { data, error } = await supabase
      .from('applicants')
      .insert([dbApplicant])
      .select()
      .single();

    if (error) throw error;
    return convertFromDbFormat(data);
  } catch (error) {
    console.error('Error adding applicant:', error);
    throw error;
  }
};

export const updateApplicant = async (program: 'GIP' | 'TUPAD', updatedApplicant: Applicant): Promise<void> => {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('applicants')
      .select('status')
      .eq('id', updatedApplicant.id)
      .single();

    if (fetchError) throw fetchError;

    const oldStatus = existingData?.status;
    const newStatus = updatedApplicant.status;

    if (oldStatus === 'PENDING' && newStatus !== 'PENDING') {
      updatedApplicant.interviewed = true;
    } else if (oldStatus !== 'PENDING' && newStatus === 'PENDING') {
      updatedApplicant.interviewed = false;
    }

    const dbApplicant = convertToDbFormat(updatedApplicant);
    delete dbApplicant.id;

    const { error } = await supabase
      .from('applicants')
      .update(dbApplicant)
      .eq('id', updatedApplicant.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating applicant:', error);
    throw error;
  }
};

export const archiveApplicant = async (program: 'GIP' | 'TUPAD', applicantId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('applicants')
      .update({
        archived: true,
        archived_date: new Date().toISOString().split('T')[0]
      })
      .eq('id', applicantId);

    if (error) throw error;
  } catch (error) {
    console.error('Error archiving applicant:', error);
    throw error;
  }
};

export const unarchiveApplicant = async (program: 'GIP' | 'TUPAD', applicantId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('applicants')
      .update({
        archived: false,
        archived_date: null
      })
      .eq('id', applicantId);

    if (error) throw error;
  } catch (error) {
    console.error('Error unarchiving applicant:', error);
    throw error;
  }
};

export const deleteApplicant = async (program: 'GIP' | 'TUPAD', applicantId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('applicants')
      .delete()
      .eq('id', applicantId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting applicant:', error);
    throw error;
  }
};

export const getStatistics = async (program: 'GIP' | 'TUPAD'): Promise<Statistics> => {
  try {
    const applicants = await getApplicants(program);
    const activeApplicants = applicants.filter(a => !a.archived);

    const getGenderCount = (status: string, gender: 'MALE' | 'FEMALE') =>
      activeApplicants.filter(a => a.status === status && a.gender === gender).length;

    const interviewed = activeApplicants.filter(a => a.interviewed === true);

    const stats: Statistics = {
      totalApplicants: activeApplicants.length,
      pending: activeApplicants.filter(a => a.status === 'PENDING').length,
      approved: activeApplicants.filter(a => a.status === 'APPROVED').length,
      deployed: activeApplicants.filter(a => a.status === 'DEPLOYED').length,
      completed: activeApplicants.filter(a => a.status === 'COMPLETED').length,
      rejected: activeApplicants.filter(a => a.status === 'REJECTED').length,
      resigned: activeApplicants.filter(a => a.status === 'RESIGNED').length,
      interviewed: interviewed.length,
      barangaysCovered: [...new Set(activeApplicants.map(a => a.barangay))].length,
      maleCount: activeApplicants.filter(a => a.gender === 'MALE').length,
      femaleCount: activeApplicants.filter(a => a.gender === 'FEMALE').length,

      pendingMale: getGenderCount('PENDING', 'MALE'),
      pendingFemale: getGenderCount('PENDING', 'FEMALE'),
      approvedMale: getGenderCount('APPROVED', 'MALE'),
      approvedFemale: getGenderCount('APPROVED', 'FEMALE'),
      deployedMale: getGenderCount('DEPLOYED', 'MALE'),
      deployedFemale: getGenderCount('DEPLOYED', 'FEMALE'),
      completedMale: getGenderCount('COMPLETED', 'MALE'),
      completedFemale: getGenderCount('COMPLETED', 'FEMALE'),
      rejectedMale: getGenderCount('REJECTED', 'MALE'),
      rejectedFemale: getGenderCount('REJECTED', 'FEMALE'),
      resignedMale: getGenderCount('RESIGNED', 'MALE'),
      resignedFemale: getGenderCount('RESIGNED', 'FEMALE'),
      interviewedMale: interviewed.filter(a => a.gender === 'MALE').length,
      interviewedFemale: interviewed.filter(a => a.gender === 'FEMALE').length
    };

    return stats;
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {
      totalApplicants: 0,
      pending: 0,
      approved: 0,
      deployed: 0,
      completed: 0,
      rejected: 0,
      resigned: 0,
      interviewed: 0,
      barangaysCovered: 0,
      maleCount: 0,
      femaleCount: 0,
      pendingMale: 0,
      pendingFemale: 0,
      approvedMale: 0,
      approvedFemale: 0,
      deployedMale: 0,
      deployedFemale: 0,
      completedMale: 0,
      completedFemale: 0,
      rejectedMale: 0,
      rejectedFemale: 0,
      resignedMale: 0,
      resignedFemale: 0,
      interviewedMale: 0,
      interviewedFemale: 0
    };
  }
};

export const getBarangayStatistics = async (program: 'GIP' | 'TUPAD'): Promise<BarangayStats[]> => {
  const applicants = await getApplicants(program);
  const activeApplicants = applicants.filter(a => !a.archived);
  const barangays = [
    'APLAYA', 'BALIBAGO', 'CAINGIN', 'DILA', 'DITA', 'DON JOSE', 'IBABA',
    'KANLURAN', 'LABAS', 'MACABLING', 'MALITLIT', 'MALUSAK', 'MARKET AREA',
    'POOC', 'PULONG SANTA CRUZ', 'SANTO DOMINGO', 'SINALHAN', 'TAGAPO'
  ];
  return barangays.map(barangay => {
    const list = activeApplicants.filter(a => a.barangay === barangay);
    return {
      barangay,
      total: list.length,
      male: list.filter(a => a.gender === 'MALE').length,
      female: list.filter(a => a.gender === 'FEMALE').length,
      pending: list.filter(a => a.status === 'PENDING').length,
      approved: list.filter(a => a.status === 'APPROVED').length,
      deployed: list.filter(a => a.status === 'DEPLOYED').length,
      completed: list.filter(a => a.status === 'COMPLETED').length,
      rejected: list.filter(a => a.status === 'REJECTED').length,
      resigned: list.filter(a => a.status === 'RESIGNED').length
    };
  });
};

export const getStatusStatistics = async (program: 'GIP' | 'TUPAD'): Promise<StatusStats[]> => {
  const applicants = await getApplicants(program);
  const activeApplicants = applicants.filter(a => !a.archived);
  const statuses = [
    { name: 'PENDING', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'APPROVED', color: 'bg-blue-100 text-blue-800' },
    { name: 'DEPLOYED', color: 'bg-green-100 text-green-800' },
    { name: 'COMPLETED', color: 'bg-pink-100 text-pink-800' },
    { name: 'REJECTED', color: 'bg-orange-100 text-orange-800' },
    { name: 'RESIGNED', color: 'bg-gray-100 text-gray-800' }
  ];
  return statuses.map(status => {
    const list = activeApplicants.filter(a => a.status === status.name);
    return {
      status: status.name,
      total: list.length,
      male: list.filter(a => a.gender === 'MALE').length,
      female: list.filter(a => a.gender === 'FEMALE').length,
      color: status.color
    };
  });
};

export const getGenderStatistics = async (program: 'GIP' | 'TUPAD'): Promise<GenderStats[]> => {
  const applicants = await getApplicants(program);
  const activeApplicants = applicants.filter(a => !a.archived);
  return ['MALE', 'FEMALE'].map(g => {
    const list = activeApplicants.filter(a => a.gender === g);
    return {
      gender: g as 'MALE' | 'FEMALE',
      total: list.length,
      pending: list.filter(a => a.status === 'PENDING').length,
      approved: list.filter(a => a.status === 'APPROVED').length,
      deployed: list.filter(a => a.status === 'DEPLOYED').length,
      completed: list.filter(a => a.status === 'COMPLETED').length,
      rejected: list.filter(a => a.status === 'REJECTED').length,
      resigned: list.filter(a => a.status === 'RESIGNED').length
    };
  });
};

export const filterApplicants = async (
  program: 'GIP' | 'TUPAD',
  filters: { searchTerm?: string; status?: string; barangay?: string; gender?: string; ageRange?: string; education?: string; }
): Promise<Applicant[]> => {
  let list = await getApplicants(program);
  if (filters.searchTerm) {
    const s = filters.searchTerm.toLowerCase();
    list = list.filter(a =>
      a.firstName.toLowerCase().includes(s) ||
      a.lastName.toLowerCase().includes(s) ||
      a.code.toLowerCase().includes(s) ||
      a.barangay.toLowerCase().includes(s)
    );
  }
  if (filters.status && filters.status !== 'All Status') list = list.filter(a => a.status === filters.status);
  if (filters.barangay && filters.barangay !== 'All Barangays') list = list.filter(a => a.barangay === filters.barangay);
  if (filters.gender && filters.gender !== 'All Genders') list = list.filter(a => a.gender === filters.gender);
  if (filters.ageRange && filters.ageRange !== 'All Ages') {
    const [min, max] = filters.ageRange.split('-').map(n => parseInt(n.replace('+', '')));
    list = max ? list.filter(a => a.age >= min && a.age <= max) : list.filter(a => a.age >= min);
  }
  if (filters.education && filters.education !== 'All Education Levels')
    list = list.filter(a => a.tertiaryEducation === filters.education);
  return list;
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// ---------- Initialize Sample Data ----------
export const initializeSampleData = (): void => {
  if (getApplicants('GIP').length === 0 && getApplicants('TUPAD').length === 0) {
    const sampleGIP: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'> = {
      firstName: 'JUAN',
      lastName: 'DELA CRUZ',
      birthDate: '2000-01-15',
      age: 24,
      barangay: 'BALIBAGO',
      contactNumber: '09123456789',
      gender: 'MALE',
      tertiaryEducation: 'COLLEGE GRADUATE',
      encoder: 'Administrator',
      status: 'PENDING',
      program: 'GIP',
      civilStats: 'SINGLE', // ✅ add this
      residentialAddress: '123 MAIN STREET, BALIBAGO, STA. ROSA CITY' // ✅ your new field
    };

    const sampleTUPAD: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'> = {
      firstName: 'MARIA',
      lastName: 'SANTOS',
      birthDate: '1995-05-20',
      age: 29,
      barangay: 'DITA',
      contactNumber: '09987654321',
      gender: 'FEMALE',
      tertiaryEducation: 'HIGH SCHOOL GRADUATE',
      encoder: 'Administrator',
      status: 'APPROVED',
      program: 'TUPAD',
      civilStats: 'SINGLE', // ✅ add this
    };

      const sampleTUPAD: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'> = {
        firstName: 'MARIA',
        lastName: 'SANTOS',
        birthDate: '1995-05-20',
        age: 29,
        barangay: 'DITA',
        contactNumber: '09987654321',
        gender: 'FEMALE',
        educationalAttainment: 'HIGH SCHOOL GRADUATE',
        encoder: 'Administrator',
        status: 'APPROVED',
        program: 'TUPAD',
        civilStats: 'SINGLE'
      };

      await addApplicant(sampleGIP);
      await addApplicant(sampleTUPAD);
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

export const getAvailableYears = async (program: 'GIP' | 'TUPAD'): Promise<number[]> => {
  const applicants = await getApplicants(program);
  const years = new Set<number>();

  applicants.forEach(applicant => {
    if (applicant.dateSubmitted) {
      const year = new Date(applicant.dateSubmitted).getFullYear();
      years.add(year);
    }
  });

  return Array.from(years).sort((a, b) => b - a);
};

export const getStatisticsByYear = async (program: 'GIP' | 'TUPAD', year?: number): Promise<Statistics> => {
  let applicants = await getApplicants(program);
  applicants = applicants.filter(a => !a.archived);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

  const interviewed = applicants.filter(a => a.interviewed === true);

  const stats: Statistics = {
    totalApplicants: applicants.length,
    pending: applicants.filter(a => a.status === 'PENDING').length,
    approved: applicants.filter(a => a.status === 'APPROVED').length,
    deployed: applicants.filter(a => a.status === 'DEPLOYED').length,
    completed: applicants.filter(a => a.status === 'COMPLETED').length,
    rejected: applicants.filter(a => a.status === 'REJECTED').length,
    resigned: applicants.filter(a => a.status === 'RESIGNED').length,
    interviewed: interviewed.length,
    barangaysCovered: [...new Set(applicants.map(a => a.barangay))].length,
    maleCount: applicants.filter(a => a.gender === 'MALE').length,
    femaleCount: applicants.filter(a => a.gender === 'FEMALE').length,
    pendingMale: applicants.filter(a => a.status === 'PENDING' && a.gender === 'MALE').length,
    pendingFemale: applicants.filter(a => a.status === 'PENDING' && a.gender === 'FEMALE').length,
    approvedMale: applicants.filter(a => a.status === 'APPROVED' && a.gender === 'MALE').length,
    approvedFemale: applicants.filter(a => a.status === 'APPROVED' && a.gender === 'FEMALE').length,
    deployedMale: applicants.filter(a => a.status === 'DEPLOYED' && a.gender === 'MALE').length,
    deployedFemale: applicants.filter(a => a.status === 'DEPLOYED' && a.gender === 'FEMALE').length,
    completedMale: applicants.filter(a => a.status === 'COMPLETED' && a.gender === 'MALE').length,
    completedFemale: applicants.filter(a => a.status === 'COMPLETED' && a.gender === 'FEMALE').length,
    rejectedMale: applicants.filter(a => a.status === 'REJECTED' && a.gender === 'MALE').length,
    rejectedFemale: applicants.filter(a => a.status === 'REJECTED' && a.gender === 'FEMALE').length,
    resignedMale: applicants.filter(a => a.status === 'RESIGNED' && a.gender === 'MALE').length,
    resignedFemale: applicants.filter(a => a.status === 'RESIGNED' && a.gender === 'FEMALE').length,
    interviewedMale: interviewed.filter(a => a.gender === 'MALE').length,
    interviewedFemale: interviewed.filter(a => a.gender === 'FEMALE').length
  };

  return stats;
};

export const getBarangayStatisticsByYear = async (program: 'GIP' | 'TUPAD', year?: number): Promise<BarangayStats[]> => {
  let applicants = await getApplicants(program);
  applicants = applicants.filter(a => !a.archived);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

  const barangays = [
    'APLAYA', 'BALIBAGO', 'CAINGIN', 'DILA', 'DITA', 'DON JOSE', 'IBABA',
    'KANLURAN', 'LABAS', 'MACABLING', 'MALITLIT', 'MALUSAK', 'MARKET AREA',
    'POOC', 'PULONG SANTA CRUZ', 'SANTO DOMINGO', 'SINALHAN', 'TAGAPO'
  ];

  return barangays.map(barangay => {
    const barangayApplicants = applicants.filter(a => a.barangay === barangay);

    return {
      barangay,
      total: barangayApplicants.length,
      male: barangayApplicants.filter(a => a.gender === 'MALE').length,
      female: barangayApplicants.filter(a => a.gender === 'FEMALE').length,
      pending: barangayApplicants.filter(a => a.status === 'PENDING').length,
      approved: barangayApplicants.filter(a => a.status === 'APPROVED').length,
      deployed: barangayApplicants.filter(a => a.status === 'DEPLOYED').length,
      completed: barangayApplicants.filter(a => a.status === 'COMPLETED').length,
      rejected: barangayApplicants.filter(a => a.status === 'REJECTED').length,
      resigned: barangayApplicants.filter(a => a.status === 'RESIGNED').length
    };
  });
};

export const getStatusStatisticsByYear = async (program: 'GIP' | 'TUPAD', year?: number): Promise<StatusStats[]> => {
  let applicants = await getApplicants(program);
  applicants = applicants.filter(a => !a.archived);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

  const statuses = [
    { name: 'PENDING', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'APPROVED', color: 'bg-blue-100 text-blue-800' },
    { name: 'DEPLOYED', color: 'bg-green-100 text-green-800' },
    { name: 'COMPLETED', color: 'bg-pink-100 text-pink-800' },
    { name: 'REJECTED', color: 'bg-orange-100 text-orange-800' },
    { name: 'RESIGNED', color: 'bg-gray-100 text-gray-800' }
  ];

  return statuses.map(status => {
    const statusApplicants = applicants.filter(a => a.status === status.name);

    return {
      status: status.name,
      total: statusApplicants.length,
      male: statusApplicants.filter(a => a.gender === 'MALE').length,
      female: statusApplicants.filter(a => a.gender === 'FEMALE').length,
      color: status.color
    };
  });
};

export const getGenderStatisticsByYear = async (program: 'GIP' | 'TUPAD', year?: number): Promise<GenderStats[]> => {
  let applicants = await getApplicants(program);
  applicants = applicants.filter(a => !a.archived);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

  const genders: ('MALE' | 'FEMALE')[] = ['MALE', 'FEMALE'];

  return genders.map(gender => {
    const genderApplicants = applicants.filter(a => a.gender === gender);

    return {
      gender,
      total: genderApplicants.length,
      pending: genderApplicants.filter(a => a.status === 'PENDING').length,
      approved: genderApplicants.filter(a => a.status === 'APPROVED').length,
      deployed: genderApplicants.filter(a => a.status === 'DEPLOYED').length,
      completed: genderApplicants.filter(a => a.status === 'COMPLETED').length,
      rejected: genderApplicants.filter(a => a.status === 'REJECTED').length,
      resigned: genderApplicants.filter(a => a.status === 'RESIGNED').length
    };
  });
};

export const getApplicantsByStatus = async (program: 'GIP' | 'TUPAD', status: string, year?: number): Promise<Applicant[]> => {
  let applicants = await getApplicants(program);
  applicants = applicants.filter(a => !a.archived && a.status === status);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

  return applicants;
};

export const getApplicantsByBarangay = async (program: 'GIP' | 'TUPAD', barangay: string, year?: number): Promise<Applicant[]> => {
  let applicants = await getApplicants(program);
  applicants = applicants.filter(a => !a.archived && a.barangay === barangay);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

  return applicants;
};

export const getApplicantsByGenderAndStatus = async (program: 'GIP' | 'TUPAD', gender: string, status: string, year?: number): Promise<Applicant[]> => {
  let applicants = await getApplicants(program);
  applicants = applicants.filter(a => !a.archived && a.gender === gender && a.status === status);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

  return applicants;
};

export const getApplicantsByType = async (program: 'GIP' | 'TUPAD', type: string, year?: number): Promise<Applicant[]> => {
  let applicants = await getApplicants(program);
  applicants = applicants.filter(a => !a.archived);

  if (year) {
    applicants = applicants.filter(a => {
      if (!a.dateSubmitted) return false;
      return new Date(a.dateSubmitted).getFullYear() === year;
    });
  }

  if (type === 'total') return applicants;
  return applicants.filter(a => a.status === type);
};
