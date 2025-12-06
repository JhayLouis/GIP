import { backendService, getBackendConfig } from './backendService';
import { Applicant } from './dataService';

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime?: Date;
  pendingChanges: number;
  syncErrors: string[];
}

let syncStatus: SyncStatus = {
  isSyncing: false,
  pendingChanges: 0,
  syncErrors: []
};

export const getSyncStatus = (): SyncStatus => {
  return { ...syncStatus };
};

export const resetSyncStatus = () => {
  syncStatus = {
    isSyncing: false,
    pendingChanges: 0,
    syncErrors: []
  };
};

export const addSyncError = (error: string) => {
  syncStatus.syncErrors.push(error);
};

export const clearSyncErrors = () => {
  syncStatus.syncErrors = [];
};

export const syncService = {
  async initializeSync() {
    const config = getBackendConfig();
    if (!config.useBackend) return;

    try {
      syncStatus.isSyncing = true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addSyncError(`Initialization failed: ${errorMsg}`);
    }
  },

  async syncLocalToBackend(program: 'GIP' | 'TUPAD', localApplicants: Applicant[]) {
    const config = getBackendConfig();
    if (!config.useBackend) return;

    try {
      syncStatus.isSyncing = true;
      syncStatus.pendingChanges = 0;

      for (const applicant of localApplicants) {
        try {
          const dbApplicant = {
            id: applicant.id,
            code: applicant.code,
            firstName: applicant.firstName,
            middleName: applicant.middleName,
            lastName: applicant.lastName,
            extensionName: applicant.extensionName,
            birthDate: applicant.birthDate,
            age: applicant.age,
            residentialAddress: applicant.residentialAddress,
            barangay: applicant.barangay,
            contactNumber: applicant.contactNumber,
            telephoneNumber: applicant.telephoneNumber,
            email: applicant.email,
            placeOfBirth: applicant.placeOfBirth,
            school: applicant.school,
            gender: applicant.gender,
            civilStatus: applicant.civilStatus,
            primaryEducation: applicant.primaryEducation,
            primarySchoolName: applicant.primarySchoolName,
            primaryFrom: applicant.primaryFrom,
            primaryTo: applicant.primaryTo,
            juniorHighEducation: applicant.juniorHighEducation,
            juniorHighSchoolName: applicant.juniorHighSchoolName,
            juniorHighFrom: applicant.juniorHighFrom,
            juniorHighTo: applicant.juniorHighTo,
            seniorHighEducation: applicant.seniorHighEducation,
            seniorHighSchoolName: applicant.seniorHighSchoolName,
            seniorHighFrom: applicant.seniorHighFrom,
            seniorHighTo: applicant.seniorHighTo,
            tertiarySchoolName: applicant.tertiarySchoolName,
            tertiaryEducation: applicant.tertiaryEducation,
            tertiaryFrom: applicant.tertiaryFrom,
            tertiaryTo: applicant.tertiaryTo,
            courseType: applicant.courseType,
            course: applicant.course,
            beneficiaryName: applicant.beneficiaryName,
            photoFileName: applicant.photoFileName,
            resumeFileName: applicant.resumeFileName,
            encoder: applicant.encoder,
            status: applicant.status,
            dateSubmitted: applicant.dateSubmitted,
            program: applicant.program,
            idType: applicant.idType,
            idNumber: applicant.idNumber,
            occupation: applicant.occupation,
            averageMonthlyIncome: applicant.averageMonthlyIncome,
            dependentName: applicant.dependentName,
            relationshipToDependent: applicant.relationshipToDependent,
            archived: applicant.archived,
            archivedDate: applicant.archivedDate,
            interviewed: applicant.interviewed
          };

          await backendService.updateApplicant(applicant.id, dbApplicant);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          addSyncError(`Failed to sync applicant ${applicant.code}: ${errorMsg}`);
          syncStatus.pendingChanges++;
        }
      }

      syncStatus.lastSyncTime = new Date();
      syncStatus.isSyncing = false;
    } catch (error) {
      syncStatus.isSyncing = false;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addSyncError(`Sync failed: ${errorMsg}`);
    }
  },

  async syncBackendToLocal(program: 'GIP' | 'TUPAD'): Promise<Applicant[]> {
    const config = getBackendConfig();
    if (!config.useBackend) return [];

    try {
      syncStatus.isSyncing = true;
      const backendApplicants = await backendService.getApplicants(program);

      const localApplicants: Applicant[] = backendApplicants.map((app) => ({
        id: app.id,
        code: app.code,
        firstName: app.firstName,
        middleName: app.middleName,
        lastName: app.lastName,
        extensionName: app.extensionName,
        birthDate: app.birthDate,
        age: app.age,
        residentialAddress: app.residentialAddress,
        barangay: app.barangay,
        contactNumber: app.contactNumber,
        telephoneNumber: app.telephoneNumber,
        email: app.email,
        placeOfBirth: app.placeOfBirth,
        school: app.school,
        gender: app.gender,
        civilStatus: app.civilStatus,
        primaryEducation: app.primaryEducation,
        primarySchoolName: app.primarySchoolName,
        primaryFrom: app.primaryFrom,
        primaryTo: app.primaryTo,
        juniorHighEducation: app.juniorHighEducation,
        juniorHighSchoolName: app.juniorHighSchoolName,
        juniorHighFrom: app.juniorHighFrom,
        juniorHighTo: app.juniorHighTo,
        seniorHighEducation: app.seniorHighEducation,
        seniorHighSchoolName: app.seniorHighSchoolName,
        seniorHighFrom: app.seniorHighFrom,
        seniorHighTo: app.seniorHighTo,
        tertiarySchoolName: app.tertiarySchoolName,
        tertiaryEducation: app.tertiaryEducation,
        tertiaryFrom: app.tertiaryFrom,
        tertiaryTo: app.tertiaryTo,
        courseType: app.courseType,
        course: app.course,
        beneficiaryName: app.beneficiaryName,
        photoFileName: app.photoFileName,
        resumeFileName: app.resumeFileName,
        encoder: app.encoder,
        status: app.status,
        dateSubmitted: app.dateSubmitted,
        program: app.program,
        idType: app.idType,
        idNumber: app.idNumber,
        occupation: app.occupation,
        averageMonthlyIncome: app.averageMonthlyIncome,
        dependentName: app.dependentName,
        relationshipToDependent: app.relationshipToDependent,
        archived: app.archived,
        archivedDate: app.archivedDate,
        interviewed: app.interviewed
      }));

      syncStatus.lastSyncTime = new Date();
      syncStatus.isSyncing = false;
      return localApplicants;
    } catch (error) {
      syncStatus.isSyncing = false;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addSyncError(`Sync from backend failed: ${errorMsg}`);
      return [];
    }
  },

  async uploadProfileFiles(applicantId: string, photoFile?: File, resumeFile?: File): Promise<{ photoUrl?: string; resumeUrl?: string }> {
    const config = getBackendConfig();
    if (!config.useBackend) return {};

    const result: { photoUrl?: string; resumeUrl?: string } = {};

    try {
      if (photoFile) {
        const photoPath = `applicants/${applicantId}/photo`;
        result.photoUrl = await backendService.uploadFile('applicants', photoPath, photoFile);
      }

      if (resumeFile) {
        const resumePath = `applicants/${applicantId}/resume`;
        result.resumeUrl = await backendService.uploadFile('applicants', resumePath, resumeFile);
      }

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addSyncError(`File upload failed: ${errorMsg}`);
      throw error;
    }
  }
};

export default syncService;
