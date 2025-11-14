import { useState, useEffect } from 'react';
import {
  getAvailableYears,
  getStatisticsByYear,
  getBarangayStatisticsByYear,
  getStatusStatisticsByYear,
  getGenderStatisticsByYear
} from '../utils/dataService';

export const useReportData = (activeProgram: 'GIP' | 'TUPAD', selectedYear?: number) => {
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [barangayStats, setBarangayStats] = useState<any[]>([]);
  const [statusStats, setStatusStats] = useState<any[]>([]);
  const [genderStats, setGenderStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [years, stats, barangay, status, gender] = await Promise.all([
        getAvailableYears(activeProgram),
        getStatisticsByYear(activeProgram, selectedYear),
        getBarangayStatisticsByYear(activeProgram, selectedYear),
        getStatusStatisticsByYear(activeProgram, selectedYear),
        getGenderStatisticsByYear(activeProgram, selectedYear)
      ]);
      setAvailableYears(years);
      setStatistics(stats);
      setBarangayStats(barangay);
      setStatusStats(status);
      setGenderStats(gender);
      setLoading(false);
    };

    load();
  }, [activeProgram, selectedYear]);

  return { availableYears, statistics, barangayStats, statusStats, genderStats, loading };
};
