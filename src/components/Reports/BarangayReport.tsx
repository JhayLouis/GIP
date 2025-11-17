import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BarangayReportProps {
  data: any[];
  entriesPerPage: number;
  currentPage: number;
  setEntriesPerPage: (n: number) => void;
  setCurrentPage: (n: number) => void;
  onRowClick: (barangay: string) => void;
  programName: string;
}

const BarangayReport: React.FC<BarangayReportProps> = ({
  data, entriesPerPage, currentPage, setEntriesPerPage, setCurrentPage, onRowClick, programName
}) => {
  const totalPages = Math.ceil(data.length / entriesPerPage);
  const start = (currentPage - 1) * entriesPerPage;
  const currentEntries = data.slice(start, start + entriesPerPage);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          {programName} APPLICANTS BY BARANGAY
        </h3>

        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="py-3 px-4 text-center font-semibold text-gray-800">BARANGAY</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-800">TOTAL</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-800">MALE</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-800">FEMALE</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-800">PENDING</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-800">APPROVED</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-800">DEPLOYED</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-800">COMPLETED</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((b, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick(b.barangay)}
                  className="border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md hover:scale-[1.01]"
                >
                  <td className="py-3 px-4 text-center font-bold text-gray-900 dark:text-gray-100">{b.barangay}</td>
                  <td className="py-3 px-4 text-center font-bold text-blue-600">{b.total}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{b.male}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{b.female}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{b.pending}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{b.approved}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{b.deployed}</td>
                  <td className="py-3 px-4 text-center text-gray-800">{b.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default BarangayReport;