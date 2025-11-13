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
              <option value="barangay">Filter by Barangay</option>
              <option value="status">Filter by Status</option>
              <option value="gender">Filter by Gender</option>
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
                className="p-4 text-left bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg border border-green-200 transition-all hover:shadow-md"
              >
                <div className="font-semibold text-green-700 text-lg mb-2">{barangay.barangay}</div>
                <div className="text-sm text-green-600 space-y-1">
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
                className="p-4 text-left bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg border border-purple-200 transition-all hover:shadow-md"
              >
                <div className="font-semibold text-purple-700 text-lg mb-2">{status.status}</div>
                <div className="text-sm text-purple-600 space-y-1">
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
          <div className="space-y-4">
            {genderStats.map((genderGroup, index) => (
              <div key={index} className="border border-pink-200 rounded-lg p-4 bg-gradient-to-r from-pink-50 to-pink-100">
                <div className="font-semibold text-pink-700 text-lg mb-3">
                  {genderGroup.gender === 'MALE' ? '♂ Male' : '♀ Female'} - Total: {genderGroup.total}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {['PENDING', 'APPROVED', 'DEPLOYED', 'COMPLETED', 'REJECTED', 'RESIGNED'].map((status) => (
                    genderGroup[status.toLowerCase()] > 0 && (
                      <button
                        key={status}
                        onClick={() => onRowClick(genderGroup.gender, status, 'gender')}
                        className="text-xs p-3 bg-white hover:bg-pink-100 rounded-lg border border-pink-200 transition-all text-pink-700 font-medium hover:shadow-md"
                      >
                        <div className="font-semibold">{status}</div>
                        <div className="text-lg font-bold mt-1">{genderGroup[status.toLowerCase()]}</div>
                      </button>
                    )
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
