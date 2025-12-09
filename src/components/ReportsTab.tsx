import React, { useState } from 'react';
import { Printer, Download, Calendar } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { exportStatsToCSV, exportStatsToPDF, printStats } from '../utils/exportUtils';
import { useReportData } from '../hooks/useReportData';
import { getApplicantsByType, getApplicantsByStatus, getApplicantsByBarangay, getApplicantsByGenderAndStatus } from '../utils/dataService';
import SummaryReport from '../components/Reports/SummaryReport';
import ReportDetailsModal from '../components/Reports/ReportDetailsModal';

const ReportsTab = ({ activeProgram }: { activeProgram: 'GIP' | 'TUPAD' }) => {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('Details');
  const [shouldShowEmailActions, setShouldShowEmailActions] = useState(true);
  const { availableYears, statistics, barangayStats, statusStats, genderStats, loading } =
    useReportData(activeProgram, selectedYear);

  const handleRowClick = (type: string, filterValue?: string, filterType?: string) => {
    let data: any[] = [];
    let title = 'Detailed Report';
    let allowEmailActions = true;

    if (filterType === 'barangay') {
      data = getApplicantsByBarangay(activeProgram, filterValue || '', selectedYear);
      title = `Applicants - ${filterValue}`;
      allowEmailActions = false;
    } else if (filterType === 'status') {
      data = getApplicantsByStatus(activeProgram, filterValue || '', selectedYear);
      title = `Applicants - ${filterValue}`;
      allowEmailActions = filterValue === 'APPROVED' || filterValue === 'REJECTED';
    } else if (filterType === 'gender') {
      data = getApplicantsByGenderAndStatus(activeProgram, type, filterValue || '', selectedYear);
      title = `Applicants - ${type} (${filterValue})`;
      allowEmailActions = filterValue === 'APPROVED' || filterValue === 'REJECTED';
    } else {
      data = getApplicantsByType(activeProgram, type, selectedYear);
      title = type === 'total' ? 'All Applicants' : `Applicants - ${type}`;
      allowEmailActions = type === 'APPROVED' || type === 'REJECTED';
    }

    setModalTitle(title);
    setSelectedDetailData(data);
    setShouldShowEmailActions(allowEmailActions);
    setShowModal(true);
  };

  const handleExport = (type: 'pdf' | 'csv') => {
    if (!statistics) return;
    type === 'pdf'
      ? exportStatsToPDF(statistics, activeProgram)
      : exportStatsToCSV(statistics, activeProgram);
  };

  const handlePrint = () => statistics && printStats(statistics, activeProgram);


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeProgram} REPORTS</h1>
            <p className="text-gray-600 dark:text-gray-300">Generate and view comprehensive reports</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeProgram} REPORTS</h1>
          <p className="text-gray-600 dark:text-gray-300">Generate and view comprehensive reports</p>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
              className="text-sm border-0 focus:ring-0 bg-transparent dark:bg-transparent text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <option className="bg-white dark:bg-slate-800" value="">All Years</option>
              {availableYears.map((y) => (
                <option
                  key={y}
                  value={y}
                  className="bg-white dark:bg-slate-800"
                >
                  {y}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handlePrint}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <Printer className="w-4 h-4" /><span>Print</span>
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => handleExport('csv')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
              >
                <Download className="w-4 h-4" /><span>CSV</span>
              </button>
            </>
          )}
        </div>
      </div>

      <SummaryReport
        data={statistics}
        barangayStats={barangayStats}
        statusStats={statusStats}
        genderStats={genderStats}
        onRowClick={handleRowClick}
        programName={activeProgram}
      />

      {showModal && (
        <ReportDetailsModal
          title={modalTitle}
          data={selectedDetailData}
          onClose={() => setShowModal(false)}
          program={activeProgram}
          showEmailActions={shouldShowEmailActions}
        />
      )}
    </div>
  );
};

export default ReportsTab;
