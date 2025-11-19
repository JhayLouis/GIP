import React, { useState } from 'react';

interface SummaryReportProps {
  data: any;
  barangayStats?: any[];
  statusStats?: any[];
  genderStats?: any[];
  onRowClick: (type: string, filterValue?: string, filterType?: string) => void;
  programName: string;
}

const SummaryReport: React.FC<SummaryReportProps> = ({
  data,
  barangayStats = [],
  statusStats = [],
  genderStats = [],
  onRowClick,
  programName
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'summary' | 'barangay' | 'status' | 'gender'>('summary');

  const isGIP = programName === 'GIP';

  const getColorClasses = () => {
    if (isGIP) {
      return {
        bg: 'bg-red-50',
        bgHover: 'hover:bg-red-50',
        bgGradient: 'from-red-50 to-red-100',
        bgHoverGradient: 'hover:from-red-100 hover:to-red-150',
        border: 'border-red-200',
        text: 'text-red-700',
        textLight: 'text-red-600',
        badge: 'bg-red-100 text-red-700',
        cardBg: 'bg-red-50',
        headerBg: 'bg-gradient-to-r from-red-600 to-red-700',
        headerText: 'text-white'
      };
    } else {
      return {
        bg: 'bg-green-50',
        bgHover: 'hover:bg-green-50',
        bgGradient: 'from-green-50 to-green-100',
        bgHoverGradient: 'hover:from-green-100 hover:to-green-150',
        border: 'border-green-200',
        text: 'text-green-700',
        textLight: 'text-green-600',
        badge: 'bg-green-100 text-green-700',
        cardBg: 'bg-green-50',
        headerBg: 'bg-gradient-to-r from-green-600 to-green-700',
        headerText: 'text-white'
      };
    }
  };

  const colors = getColorClasses();

  if (!data) return <p className="text-center text-gray-500 dark:text-gray-400">No summary data available.</p>;

  const summary = [
    { label: 'Total Applicants', value: data.totalApplicants, male: data.maleCount, female: data.femaleCount, type: 'total' },
    { label: 'Approved', value: data.approved, male: data.approvedMale, female: data.approvedFemale, type: 'APPROVED' },
    { label: 'Deployed', value: data.deployed, male: data.deployedMale, female: data.deployedFemale, type: 'DEPLOYED' },
    { label: 'Completed', value: data.completed, male: data.completedMale, female: data.completedFemale, type: 'COMPLETED' },
  ];

  return (
    <div className="space-y-6">
      <div className={`${colors.headerBg} rounded-xl p-6 shadow-md`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-bold ${colors.headerText}`}>
            {programName} SUMMARY REPORT
          </h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as 'summary' | 'barangay' | 'status' | 'gender')}
              className={`px-4 py-2 border-2 ${colors.border} rounded-lg focus:ring-2 ${isGIP ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-green-500 focus:border-green-500'} text-sm bg-white dark:bg-slate-800 cursor-pointer font-medium`}
            >
              <option value="summary">Summary View</option>
              <option value="barangay">By Barangay</option>
              <option value="status">By Status</option>
              <option value="gender">By Gender</option>
            </select>
          </div>
        </div>

        {selectedFilter === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summary.map((item, index) => (
              <div
                key={index}
                onClick={() => onRowClick(item.type)}
                className={`text-center p-6 rounded-lg ${colors.cardBg} cursor-pointer border-2 ${colors.border} hover:shadow-lg hover:scale-[1.03] transition-all duration-200 hover:${colors.bgHoverGradient}`}
              >
                <h4 className={`text-sm font-semibold ${colors.textLight} mb-3`}>{item.label}</h4>
                <div className={`text-4xl font-bold mb-3 ${colors.text}`}>
                  {item.value}
                </div>
                <div className={`flex items-center justify-center space-x-4 text-xs font-medium ${colors.text}`}>
                  <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full">
                    <span>♂</span>
                    <span className="font-bold">{item.male}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full">
                    <span>♀</span>
                    <span className="font-bold">{item.female}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedFilter === 'barangay' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {barangayStats.map((barangay, index) => (
              <button
                key={index}
                onClick={() => onRowClick(barangay.barangay, barangay.barangay, 'barangay')}
                className={`p-5 text-left bg-gradient-to-r ${colors.bgGradient} rounded-lg border-2 ${colors.border} transition-all hover:shadow-lg hover:scale-[1.02] duration-200`}
              >
                <div className={`font-bold ${colors.text} text-lg mb-3`}>{barangay.barangay}</div>
                <div className={`text-sm space-y-2`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium  ${colors.text}`}>Total:</span>
                    <span className={`font-bold text-base ${colors.text}`}>{barangay.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium  ${colors.text}`}>Male:</span>
                    <span className={`font-semibold ${colors.textLight}`}>{barangay.male}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium  ${colors.text}`}>Female:</span>
                    <span className={`font-semibold ${colors.textLight}`}>{barangay.female}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedFilter === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusStats.map((status, index) => (
              <button
                key={index}
                onClick={() => onRowClick(status.status, status.status, 'status')}
                className={`p-5 text-left bg-gradient-to-r ${colors.bgGradient} rounded-lg border-2 ${colors.border} transition-all hover:shadow-lg hover:scale-[1.02] duration-200`}
              >
                <div className={`font-bold ${colors.text} text-lg mb-3`}>{status.status}</div>
                <div className={`text-sm space-y-2`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium  ${colors.text}`}>Total:</span>
                    <span className={`font-bold text-base ${colors.text}`}>{status.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium  ${colors.text}`}>Male:</span>
                    <span className={`font-semibold ${colors.textLight}`}>{status.male}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium  ${colors.text}`}>Female:</span>
                    <span className={`font-semibold ${colors.textLight}`}>{status.female}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedFilter === 'gender' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {genderStats.map((genderGroup, index) => (
              <div
                key={index}
                className={`border-2 rounded-xl p-6 bg-gradient-to-br ${colors.bgGradient} to-white shadow-md hover:shadow-lg transition-all duration-200 ${colors.border}`}
              >
                <div className={`font-bold text-lg mb-4 text-center`}>
                  <span className={`${colors.text}`}>
                    {genderGroup.gender === 'MALE' ? '♂ Male' : '♀ Female'}
                  </span>
                  <span className={`ml-3 ${colors.textLight} font-bold`}>Total: {genderGroup.total}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['PENDING', 'APPROVED', 'DEPLOYED', 'COMPLETED', 'REJECTED', 'RESIGNED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => onRowClick(genderGroup.gender, status, 'gender')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${colors.border} bg-white dark:bg-slate-800 hover:shadow-md hover:scale-[1.05] transition-all duration-200`}
                    >
                      <span className={`text-xs font-semibold ${colors.text} mb-1`}>{status}</span>
                      <span className={`text-xl font-bold ${colors.text}`}>
                        {genderGroup[status.toLowerCase()] ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryReport;
