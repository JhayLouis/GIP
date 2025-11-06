import React from 'react';

interface GenderReportProps {
  data: any[];
  programName: string;
  onRowClick?: (gender: string, status: string) => void;
}

const GenderReport: React.FC<GenderReportProps> = ({ data, programName, onRowClick }) => {
  const statusColors: { [key: string]: string } = {
    'PENDING': 'text-yellow-600 hover:text-yellow-700',
    'APPROVED': 'text-blue-600 hover:text-blue-700',
    'DEPLOYED': 'text-green-600 hover:text-green-700',
    'COMPLETED': 'text-pink-600 hover:text-pink-700',
    'REJECTED': 'text-orange-600 hover:text-orange-700',
    'RESIGNED': 'text-gray-600 hover:text-gray-700'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        {programName} APPLICANTS BY GENDER
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((g, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
          >
            <h4 className="text-xl font-bold text-center mb-6 text-gray-800">
              {g.gender} ({g.total} total)
            </h4>
            <div className="space-y-3 text-sm">
              {['PENDING', 'APPROVED', 'DEPLOYED', 'COMPLETED', 'REJECTED', 'RESIGNED'].map((status) => (
                <div
                  key={status}
                  onClick={() => onRowClick && onRowClick(g.gender, status)}
                  className={`flex justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    onRowClick
                      ? 'hover:bg-white hover:shadow-sm hover:scale-[1.01]'
                      : ''
                  }`}
                >
                  <span className="font-medium text-gray-700">{status}</span>
                  <span className={`font-semibold ${statusColors[status] || 'text-gray-700'}`}>
                    {g[status.toLowerCase()] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenderReport;
