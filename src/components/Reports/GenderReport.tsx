import React from 'react';

interface GenderReportProps {
  data: any[];
  programName: string;
  onRowClick?: (gender: string, status: string) => void;
}

const GenderReport: React.FC<GenderReportProps> = ({ data, programName, onRowClick }) => {
  const statuses = ['PENDING', 'APPROVED', 'DEPLOYED', 'COMPLETED', 'REJECTED', 'RESIGNED'];

  const statusColors: { [key: string]: string } = {
    'PENDING': 'text-yellow-600',
    'APPROVED': 'text-blue-600',
    'DEPLOYED': 'text-green-600',
    'COMPLETED': 'text-pink-600',
    'REJECTED': 'text-orange-600',
    'RESIGNED': 'text-gray-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        {programName} APPLICANTS BY GENDER
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((g, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <h4 className="text-lg font-semibold text-center mb-4 text-gray-800">
              {g.gender} — <span className="text-pink-600 font-bold">{g.total}</span> total
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {statuses.map((status) => (
                <div
                  key={status}
                  onClick={() => onRowClick && onRowClick(g.gender, status)}
                  className={`flex flex-col items-center justify-center border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-white hover:shadow-sm transition-all duration-150 ${
                    onRowClick ? 'hover:scale-[1.02]' : ''
                  }`}
                >
                  <span className="font-medium text-gray-600">{status}</span>
                  <span className={`text-lg font-semibold ${statusColors[status] || 'text-gray-700'}`}>
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
