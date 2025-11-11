import React from 'react';
import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';

interface StatusReportProps {
  data: any[];
  entriesPerPage: number;
  currentPage: number;
  setEntriesPerPage: (n: number) => void;
  setCurrentPage: (n: number) => void;
  onRowClick: (status: string) => void;
  onSendEmails?: (status: string) => void;
  programName: string;
}

const StatusReport: React.FC<StatusReportProps> = ({
  data, entriesPerPage, currentPage, setEntriesPerPage, setCurrentPage, onRowClick, onSendEmails, programName
}) => {
  const statusColors: { [key: string]: string } = {
    'PENDING': 'bg-yellow-50 border-yellow-200 hover:from-yellow-50 hover:to-yellow-100',
    'APPROVED': 'bg-blue-50 border-blue-200 hover:from-blue-50 hover:to-blue-100',
    'REJECTED': 'bg-orange-50 border-orange-200 hover:from-orange-50 hover:to-orange-100',
    'DEPLOYED': 'bg-green-50 border-green-200 hover:from-green-50 hover:to-green-100',
    'COMPLETED': 'bg-pink-50 border-pink-200 hover:from-pink-50 hover:to-pink-100',
    'RESIGNED': 'bg-gray-50 border-gray-200 hover:from-gray-50 hover:to-gray-100'
  };

  const statusTextColors: { [key: string]: string } = {
    'PENDING': 'text-yellow-700',
    'APPROVED': 'text-blue-700',
    'REJECTED': 'text-orange-700',
    'DEPLOYED': 'text-green-700',
    'COMPLETED': 'text-pink-700',
    'RESIGNED': 'text-gray-700'
  };

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
              className={`relative text-center p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${statusColors[s.status] || statusColors['PENDING']}`}
            >
              <div
                onClick={() => onRowClick(s.status)}
                className="cursor-pointer hover:scale-[1.02]"
              >
                <div className={`text-lg font-semibold mb-1 ${statusTextColors[s.status] || statusTextColors['PENDING']}`}>
                  {s.status}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{s.total}</div>
                <div className="text-sm text-gray-600">Applicants</div>
              </div>
              {onSendEmails && (s.status === 'APPROVED' || s.status === 'REJECTED') && s.total > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendEmails(s.status);
                  }}
                  className="mt-3 w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  title={`Send emails to ${s.status.toLowerCase()} applicants`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Emails</span>
                </button>
              )}
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