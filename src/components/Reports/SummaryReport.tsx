import React, { useState } from 'react';
import { Filter } from 'lucide-react';

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
  const programColor = isGIP ? 'blue' : 'green';

  const getColorClasses = (colorName: string) => {
    const colorMap: { [key: string]: { [key: string]: string } } = {
      blue: {
        bg: 'bg-blue-50',
        bgHover: 'hover:bg-blue-50',
        bgGradient: 'from-blue-50 to-blue-100',
        bgHoverGradient: 'hover:from-blue-100 hover:to-blue-200',
        border: 'border-blue-200',
        text: 'text-blue-700',
        textLight: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        bgHover: 'hover:bg-green-50',
        bgGradient: 'from-green-50 to-green-100',
        bgHoverGradient: 'hover:from-green-100 hover:to-green-200',
        border: 'border-green-200',
        text: 'text-green-700',
        textLight: 'text-green-600'
      }
    };
    return colorMap[colorName] || colorMap.blue;
  };

  const barangayColors = getColorClasses(programColor);
  const statusColors = getColorClasses(programColor);
  const genderColors = getColorClasses(programColor);

  if (!data) return <p className="text-center text-gray-500">No summary data available.</p>;

  const summary = [
    { label: 'Total Applicants', value: data.totalApplicants, male: data.maleCount, female: data.femaleCount, color: 'text-blue-600', type: 'total' },
    { label: 'Approved', value: data.approved, male: data.approvedMale, female: data.approvedFemale, color: 'text-green-600', type: 'APPROVED' },
    { label: 'Deployed', value: data.deployed, male: data.deployedMale, female: data.deployedFemale, color: 'text-orange-600', type: 'DEPLOYED' },
    { label: 'Completed', value: data.completed, male: data.completedMale, female: data.completedFemale, color: 'text-purple-600', type: 'COMPLETED' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {programName} SUMMARY REPORT
          </h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as 'summary' | 'barangay' | 'status' | 'gender')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white cursor-pointer"
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
                className="text-center p-4 rounded-lg bg-gray-50 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                <h4 className="text-sm font-medium text-gray-600 mb-2">{item.label}</h4>
                <div className={`text-3xl font-bold mb-2 ${item.color}`}>
                  {item.value}
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <span>♂</span>
                    <span>{item.male}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>♀</span>
                    <span>{item.female}</span>
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
                className={`p-4 text-left bg-gradient-to-r ${barangayColors.bgGradient} ${barangayColors.bgHoverGradient} rounded-lg border ${barangayColors.border} transition-all hover:shadow-md`}
              >
                <div className={`font-semibold ${barangayColors.text} text-lg mb-2`}>{barangay.barangay}</div>
                <div className={`text-sm ${barangayColors.textLight} space-y-1`}>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-bold">{barangay.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Male:</span>
                    <span className="font-semibold">{barangay.male}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Female:</span>
                    <span className="font-semibold">{barangay.female}</span>
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
                className={`p-4 text-left bg-gradient-to-r ${statusColors.bgGradient} ${statusColors.bgHoverGradient} rounded-lg border ${statusColors.border} transition-all hover:shadow-md`}
              >
                <div className={`font-semibold ${statusColors.text} text-lg mb-2`}>{status.status}</div>
                <div className={`text-sm ${statusColors.textLight} space-y-1`}>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-bold">{status.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Male:</span>
                    <span className="font-semibold">{status.male}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Female:</span>
                    <span className="font-semibold">{status.female}</span>
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
                className={`border rounded-xl p-6 bg-gradient-to-br ${genderColors.bgGradient} to-white shadow-sm hover:shadow-md transition-all duration-200 ${genderColors.border}`}
              >
                <div className="font-semibold text-gray-700 text-lg mb-4 text-center">
                  {genderGroup.gender === 'MALE' ? '♂ Male' : '♀ Female'} —
                  <span className="ml-1 text-gray-600 font-bold">Total: {genderGroup.total}</span>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {['PENDING', 'APPROVED', 'DEPLOYED', 'COMPLETED', 'REJECTED', 'RESIGNED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => onRowClick(genderGroup.gender, status, 'gender')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border ${genderColors.border} bg-white ${genderColors.bgHover} hover:shadow-sm transition-all duration-200`}
                    >
                      <span className="text-sm font-medium text-gray-700">{status}</span>
                      <span
                        className={`text-lg font-bold ${
                          status === 'APPROVED'
                            ? 'text-gray-600'
                            : status === 'REJECTED'
                            ? 'text-gray-600'
                            : status === 'DEPLOYED'
                            ? 'text-gray-600'
                            : status === 'COMPLETED'
                            ? 'text-gray-600'
                            : status === 'RESIGNED'
                            ? 'text-gray-600'
                            : 'text-gray-600'
                        }`}
                      >
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
