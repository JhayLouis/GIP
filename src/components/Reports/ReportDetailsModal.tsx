import React from 'react';
import { Printer, X, Download } from 'lucide-react';

interface ReportDetailsModalProps {
  title: string;
  data: any[];
  onClose: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ title, data, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;

    const headers = ['Code', 'Name', 'Gender', 'Age', 'Barangay', 'Contact', 'Educational Attainment', 'Status'];
    const rows = data.map(p => [
      p.code || '',
      `${p.firstName} ${p.middleName ? p.middleName + ' ' : ''}${p.lastName}${p.extensionName ? ' ' + p.extensionName : ''}`,
      p.gender || '',
      p.age || '',
      p.barangay || '',
      p.contactNumber || '',
      p.educationalAttainment || '',
      p.status || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2">
            {data.length > 0 && (
              <>
                <button
                  onClick={handlePrint}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                  title="Print"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={handleExportCSV}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                  title="Export CSV"
                >
                  <Download className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-6xl text-gray-300 mb-4">📭</div>
                <p className="text-gray-500 text-lg font-medium">No data available</p>
                <p className="text-gray-400 text-sm">No applicants match the selected criteria</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Full Name</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Gender</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Age</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Barangay</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Contact</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Education</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{p.code || '-'}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {`${p.firstName} ${p.middleName ? p.middleName + ' ' : ''}${p.lastName}${p.extensionName ? ' ' + p.extensionName : ''}`}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{p.gender || '-'}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{p.age || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{p.barangay || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{p.contactNumber || '-'}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{p.educationalAttainment || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                        p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        p.status === 'DEPLOYED' ? 'bg-green-100 text-green-800' :
                        p.status === 'COMPLETED' ? 'bg-pink-100 text-pink-800' :
                        p.status === 'REJECTED' ? 'bg-orange-100 text-orange-800' :
                        p.status === 'RESIGNED' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {p.status || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
          Showing {data.length} record{data.length !== 1 ? 's' : ''} • Generated on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
