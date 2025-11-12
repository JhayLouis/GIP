import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

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
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          {programName} SUMMARY REPORT
        </h3>
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
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <button
            onClick={() => setExpandedFilter(expandedFilter === 'barangay' ? null : 'barangay')}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all"
          >
            <h4 className="text-lg font-semibold text-green-700">Filter by Barangay</h4>
            {expandedFilter === 'barangay' ? (
              <ChevronUp className="w-5 h-5 text-green-700" />
            ) : (
              <ChevronDown className="w-5 h-5 text-green-700" />
            )}
          </button>
          {expandedFilter === 'barangay' && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {barangayStats.map((barangay, index) => (
                <button
                  key={index}
                  onClick={() => onRowClick(barangay.barangay, barangay.barangay, 'barangay')}
                  className="p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-all"
                >
                  <div className="font-medium text-green-700">{barangay.barangay}</div>
                  <div className="text-xs text-green-600 mt-1">
                    Total: {barangay.total} | ♂ {barangay.male} | ♀ {barangay.female}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <button
            onClick={() => setExpandedFilter(expandedFilter === 'status' ? null : 'status')}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all"
          >
            <h4 className="text-lg font-semibold text-purple-700">Filter by Status</h4>
            {expandedFilter === 'status' ? (
              <ChevronUp className="w-5 h-5 text-purple-700" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-700" />
            )}
          </button>
          {expandedFilter === 'status' && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {statusStats.map((status, index) => (
                <button
                  key={index}
                  onClick={() => onRowClick(status.status, status.status, 'status')}
                  className="p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all"
                >
                  <div className="font-medium text-purple-700">{status.status}</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Total: {status.total} | ♂ {status.male} | ♀ {status.female}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <button
            onClick={() => setExpandedFilter(expandedFilter === 'gender' ? null : 'gender')}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg hover:from-pink-100 hover:to-pink-200 transition-all"
          >
            <h4 className="text-lg font-semibold text-pink-700">Filter by Gender</h4>
            {expandedFilter === 'gender' ? (
              <ChevronUp className="w-5 h-5 text-pink-700" />
            ) : (
              <ChevronDown className="w-5 h-5 text-pink-700" />
            )}
          </button>
          {expandedFilter === 'gender' && (
            <div className="mt-4 space-y-3">
              {genderStats.map((genderGroup, index) => (
                <div key={index} className="border border-pink-200 rounded-lg p-3 bg-pink-50">
                  <div className="font-medium text-pink-700 mb-2">
                    {genderGroup.gender === 'MALE' ? '♂ Male' : '♀ Female'} - Total: {genderGroup.total}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['PENDING', 'APPROVED', 'DEPLOYED', 'COMPLETED', 'REJECTED', 'RESIGNED'].map((status) => (
                      genderGroup[status.toLowerCase()] > 0 && (
                        <button
                          key={status}
                          onClick={() => onRowClick(genderGroup.gender, status, 'gender')}
                          className="text-xs p-2 bg-white hover:bg-pink-100 rounded border border-pink-200 transition-all text-pink-700 font-medium"
                        >
                          {status}: {genderGroup[status.toLowerCase()]}
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
    </div>
  );
};

export default SummaryReport;
