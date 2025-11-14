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
    const years = getAvailableYears(activeProgram);
    setAvailableYears(years);

    const load = async () => {
      setLoading(true);
      setStatistics(getStatisticsByYear(activeProgram, selectedYear));
      setBarangayStats(getBarangayStatisticsByYear(activeProgram, selectedYear));
      setStatusStats(getStatusStatisticsByYear(activeProgram, selectedYear));
      setGenderStats(getGenderStatisticsByYear(activeProgram, selectedYear));
      setLoading(false);
    };

    load();
  }, [activeProgram, selectedYear]);

  return { availableYears, statistics, barangayStats, statusStats, genderStats, loading };
};
