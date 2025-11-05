import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StatusReportProps {
  data: any[];
  entriesPerPage: number;
  currentPage: number;
  setEntriesPerPage: (n: number) => void;
  setCurrentPage: (n: number) => void;
  onRowClick: (status: string) => void;
  programName: string;
}

const StatusReport: React.FC<StatusReportProps> = ({
  data, entriesPerPage, currentPage, setEntriesPerPage, setCurrentPage, onRowClick, programName
}) => {
  const totalPages = Math.ceil(data.length / entriesPerPage);
  const start = (currentPage - 1) * entriesPerPage;
  const currentEntries = data.slice(start, start + entriesPerPage);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          {programName} APPLICANTS BY STATUS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentEntries.map((s, i) => (
            <div
              key={i}
              onClick={() => onRowClick(s.status)}
              className="text-center p-6 rounded-lg bg-gray-50 border hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            >
              <div className="text-lg font-semibold text-gray-800 mb-1">{s.status}</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{s.total}</div>
              <div className="text-sm text-gray-500">Applicants</div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" /><span>Previous</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 text-sm border rounded-md ${currentPage === i + 1
                ? 'bg-blue-600 text-white border-transparent'
                : 'border-gray-300 hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center space-x-1"
          >
            <span>Next</span><ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StatusReport;