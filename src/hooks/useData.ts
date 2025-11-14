import { useState, useEffect, useCallback } from 'react';
import {
  Applicant,
  Statistics,
  BarangayStats,
  StatusStats,
  GenderStats,
  getApplicants,
  getStatistics,
  getBarangayStatistics,
  getStatusStatistics,
  getGenderStatistics,
  filterApplicants,
  addApplicant,
  updateApplicant,
  archiveApplicant,
  unarchiveApplicant,
  deleteApplicant,
  initializeSampleData
} from '../utils/dataService.ts';

const defaultStats: Statistics = {
  totalApplicants: 0,
  pending: 0,
  approved: 0,
  deployed: 0,
  completed: 0,
  rejected: 0,
  resigned: 0,
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
  interviewed: 0,
  interviewedMale: 0,
  interviewedFemale: 0
};

export const useData = (program: 'GIP' | 'TUPAD') => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [statistics, setStatistics] = useState<Statistics>(defaultStats);
  const [barangayStats, setBarangayStats] = useState<BarangayStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [genderStats, setGenderStats] = useState<GenderStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        allApplicants,
        stats,
        barangayData,
        statusData,
        genderData
      ] = await Promise.all([
        getApplicants(program),
        getStatistics(program),
        getBarangayStatistics(program),
        getStatusStatistics(program),
        getGenderStatistics(program)
      ]);

      setApplicants(allApplicants || []);
      setStatistics(stats || defaultStats);
      setBarangayStats(barangayData || []);
      setStatusStats(statusData || []);
      setGenderStats(genderData || []);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setStatistics(defaultStats);
    } finally {
      setIsLoading(false);
    }
  }, [program]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeSampleData();
        await refreshData();
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initialize();
  }, [program, refreshData]);

  const handleAddApplicant = useCallback(
    async (applicantData: Omit<Applicant, 'id' | 'code' | 'dateSubmitted'>) => {
      try {
        const newApplicant = await addApplicant(applicantData);
        await refreshData();
        return newApplicant;
      } catch (error) {
        console.error('Error adding applicant:', error);
        throw error;
      }
    },
    [refreshData]
  );

  const handleUpdateApplicant = useCallback(
    async (updatedApplicant: Applicant) => {
      try {
        await updateApplicant(program, updatedApplicant);
        await refreshData();
      } catch (error) {
        console.error('Error updating applicant:', error);
        throw error;
      }
    },
    [program, refreshData]
  );

  const handleArchiveApplicant = useCallback(
    async (applicantId: string) => {
      try {
        await archiveApplicant(program, applicantId);
        await refreshData();
      } catch (error) {
        console.error('Error archiving applicant:', error);
        throw error;
      }
    },
    [program, refreshData]
  );

  const handleUnarchiveApplicant = useCallback(
    async (applicantId: string) => {
      try {
        await unarchiveApplicant(program, applicantId);
        await refreshData();
      } catch (error) {
        console.error('Error unarchiving applicant:', error);
        throw error;
      }
    },
    [program, refreshData]
  );

  const handleDeleteApplicant = useCallback(
    async (applicantId: string) => {
      try {
        await deleteApplicant(program, applicantId);
        await refreshData();
      } catch (error) {
        console.error('Error deleting applicant:', error);
        throw error;
      }
    },
    [program, refreshData]
  );

  const getFilteredApplicants = useCallback(
    async (filters: {
      searchTerm?: string;
      status?: string;
      barangay?: string;
      gender?: string;
      ageRange?: string;
      education?: string;
    }) => {
      try {
        return await filterApplicants(program, filters);
      } catch (error) {
        console.error('Error filtering applicants:', error);
        return [];
      }
    },
    [program]
  );

  return {
    applicants,
    statistics,
    barangayStats,
    statusStats,
    genderStats,
    isLoading,
    refreshData,
    addApplicant: handleAddApplicant,
    updateApplicant: handleUpdateApplicant,
    archiveApplicant: handleArchiveApplicant,
    unarchiveApplicant: handleUnarchiveApplicant,
    deleteApplicant: handleDeleteApplicant,
    getFilteredApplicants
  };
};
