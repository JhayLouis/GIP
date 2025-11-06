import React, { useState } from 'react';
import { Printer, FileText, Download, Calendar, BarChart3, PieChart } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { exportStatsToCSV, exportStatsToPDF, printStats } from '../utils/exportUtils';
import { useReportData } from '../hooks/useReportData';
import { getApplicantsByType, getApplicantsByStatus, getApplicantsByBarangay, getApplicantsByGenderAndStatus } from '../utils/dataService';
import SummaryReport from '../components/Reports/SummaryReport';
import BarangayReport from '../components/Reports/BarangayReport';
import StatusReport from '../components/Reports/StatusReport';
import GenderReport from '../components/Reports/GenderReport';
import ReportDetailsModal from '../components/Reports/ReportDetailsModal';

const ReportsTab = ({ activeProgram }: { activeProgram: 'GIP' | 'TUPAD' }) => {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedReportType, setSelectedReportType] = useState('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('Details');
  const { availableYears, statistics, barangayStats, statusStats, genderStats, loading } =
    useReportData(activeProgram, selectedYear);

  const handleRowClick = (type: string, filterValue?: string) => {
    let data: any[] = [];
    let title = 'Detailed Report';

    if (selectedReportType === 'summary') {
      data = getApplicantsByType(activeProgram, type, selectedYear);
      title = type === 'total' ? 'All Applicants' : `Applicants - ${type}`;
    } else if (selectedReportType === 'barangay') {
      data = getApplicantsByBarangay(activeProgram, filterValue || '', selectedYear);
      title = `Applicants - ${filterValue}`;
    } else if (selectedReportType === 'status') {
      data = getApplicantsByStatus(activeProgram, filterValue || '', selectedYear);
      title = `Applicants - ${filterValue}`;
    } else if (selectedReportType === 'gender') {
      data = getApplicantsByGenderAndStatus(activeProgram, type, filterValue || '', selectedYear);
      title = `Applicants - ${type} (${filterValue})`;
    }

    setModalTitle(title);
    setSelectedDetailData(data);
    setShowModal(true);
  };

  const handleExport = (type: 'pdf' | 'csv') => {
    if (!statistics) return;
    type === 'pdf'
      ? exportStatsToPDF(statistics, activeProgram)
      : exportStatsToCSV(statistics, activeProgram);
  };

  const handlePrint = () => statistics && printStats(statistics, activeProgram);

  const reportTypes = [
    { id: 'summary', label: 'Summary Report', icon: BarChart3, color: 'border-blue-500 bg-blue-50 text-blue-600' },
    { id: 'barangay', label: 'By Barangay', icon: PieChart, color: 'border-green-500 bg-green-50 text-green-600' },
    { id: 'status', label: 'By Status', icon: BarChart3, color: 'border-purple-500 bg-purple-50 text-purple-600' },
    { id: 'gender', label: 'By Gender', icon: PieChart, color: 'border-pink-500 bg-pink-50 text-pink-600' },
  ];

  const renderReport = () => {
    switch (selectedReportType) {
      case 'barangay':
        return (
          <BarangayReport
            data={barangayStats}
            entriesPerPage={entriesPerPage}
            currentPage={currentPage}
            setEntriesPerPage={setEntriesPerPage}
            setCurrentPage={setCurrentPage}
            onRowClick={(v) => handleRowClick(v, v)}
            programName={activeProgram}
          />
        );
      case 'status':
        return (
          <StatusReport
            data={statusStats}
            entriesPerPage={entriesPerPage}
            currentPage={currentPage}
            setEntriesPerPage={setEntriesPerPage}
            setCurrentPage={setCurrentPage}
            onRowClick={(v) => handleRowClick(v, v)}
            programName={activeProgram}
          />
        );
      case 'gender':
        return (
          <GenderReport
            data={genderStats}
            programName={activeProgram}
            onRowClick={(gender, status) => handleRowClick(gender, status)}
          />
        );
      default:
        return (
          <SummaryReport
            data={statistics}
            onRowClick={(type) => handleRowClick(type)}
            programName={activeProgram}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{activeProgram} REPORTS</h1>
            <p className="text-gray-600">Generate and view comprehensive reports</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
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
          <h1 className="text-2xl font-bold text-gray-900">{activeProgram} REPORTS</h1>
          <p className="text-gray-600">Generate and view comprehensive reports</p>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
              className="text-sm border-0 focus:ring-0 bg-transparent cursor-pointer"
            >
              <option value="">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
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
              <button
                onClick={() => handleExport('pdf')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
              >
                <FileText className="w-4 h-4" /><span>PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReportType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedReportType === type.id
                    ? type.color
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className={`w-8 h-8 ${
                    selectedReportType === type.id
                      ? type.color.split(' ')[2]
                      : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedReportType === type.id ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {type.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {renderReport()}

      {showModal && (
        <ReportDetailsModal
          title={modalTitle}
          data={selectedDetailData}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ReportsTab;
