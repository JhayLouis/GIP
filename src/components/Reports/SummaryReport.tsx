import React from 'react';

interface SummaryReportProps {
  data: any;
  onRowClick: () => void;
  programName: string;
}

const SummaryReport: React.FC<SummaryReportProps> = ({ data, onRowClick, programName }) => {
  if (!data) return <p className="text-center text-gray-500">No summary data available.</p>;

  const summary = [
    { label: 'Total Applicants', value: data.totalApplicants, male: data.maleCount, female: data.femaleCount, color: 'text-blue-600' },
    { label: 'Approved', value: data.approved, male: data.approvedMale, female: data.approvedFemale, color: 'text-green-600' },
    { label: 'Deployed', value: data.deployed, male: data.deployedMale, female: data.deployedFemale, color: 'text-orange-600' },
    { label: 'Completed', value: data.completed, male: data.completedMale, female: data.completedFemale, color: 'text-purple-600' },
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
              onClick={onRowClick}
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
    </div>
  );
};

export default SummaryReport;
