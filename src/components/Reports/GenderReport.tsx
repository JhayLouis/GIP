import React from 'react';

interface GenderReportProps {
  data: any[];
  programName: string;
}

const GenderReport: React.FC<GenderReportProps> = ({ data, programName }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        {programName} APPLICANTS BY GENDER
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((g, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-lg p-6 shadow-sm hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:shadow-md transition-all duration-200"
          >
            <h4 className="text-xl font-bold text-center mb-4 text-gray-800">
              {g.gender} ({g.total})
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="font-medium">Pending</span><span>{g.pending}</span></div>
              <div className="flex justify-between"><span className="font-medium">Approved</span><span>{g.approved}</span></div>
              <div className="flex justify-between"><span className="font-medium">Deployed</span><span>{g.deployed}</span></div>
              <div className="flex justify-between"><span className="font-medium">Completed</span><span>{g.completed}</span></div>
              <div className="flex justify-between"><span className="font-medium">Rejected</span><span>{g.rejected}</span></div>
              <div className="flex justify-between"><span className="font-medium">Resigned</span><span>{g.resigned}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenderReport;
