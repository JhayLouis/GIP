import React, { useState, useMemo } from 'react';
import { Printer, X } from 'lucide-react';

interface ReportDetailsModalProps {
  title: string;
  data: any[];
  onClose: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ title, data, onClose }) => {
  const [courseFilter, setCourseFilter] = useState('');

  const filteredData = useMemo(() => {
    if (!courseFilter.trim()) return data;
    return data.filter(item =>
      item.course?.toLowerCase().includes(courseFilter.toLowerCase())
    );
  }, [data, courseFilter]);
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 10mm;
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: Arial, sans-serif;
              font-size: 10pt;
              color: #000;
            }

            .header {
              text-align: center;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #333;
            }

            .header h1 {
              font-size: 16pt;
              font-weight: bold;
              margin-bottom: 3px;
              color: #dc2626;
            }

            .header p {
              font-size: 9pt;
              color: #666;
              margin: 1px 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th, td {
              border: 1px solid #000;
              padding: 7px 5px;
              text-align: left;
            }

            th {
              background-color: #dc2626;
              color: white;
              font-weight: bold;
              font-size: 10pt;
            }

            td {
              font-size: 9pt;
            }

            tr:nth-child(even) {
              background-color: #f9f9f9;
            }

            .text-center {
              text-align: center;
            }

            .no-data {
              text-align: center;
              padding: 40px;
              color: #999;
              font-style: italic;
            }

            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>City Government of Santa Rosa - Office of the City Mayor</p>
            <p>Soft Projects Management System</p>
            <p>Generated on: ${new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>

          ${filteredData.length === 0 ? `
            <div class="no-data">
              No applicants found matching the selected criteria.
            </div>
          ` : `
            <table>
              <thead>
                <tr>
                  <th style="width: 12%;">Code</th>
                  <th style="width: 25%;">Full Name</th>
                  <th style="width: 8%;" class="text-center">Gender</th>
                  <th style="width: 6%;" class="text-center">Age</th>
                  <th style="width: 15%;">Barangay</th>
                  <th style="width: 12%;">Contact</th>
                  <th style="width: 22%;">Education</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData.map((p, index) => `
                  <tr>
                    <td>${p.code || '-'}</td>
                    <td>${p.firstName || ''} ${p.middleName ? p.middleName + ' ' : ''}${p.lastName || ''}${p.extensionName ? ' ' + p.extensionName : ''}</td>
                    <td class="text-center">${p.gender || '-'}</td>
                    <td class="text-center">${p.age || '-'}</td>
                    <td>${p.barangay || '-'}</td>
                    <td>${p.contactNumber || '-'}</td>
                    <td style="font-size: 8pt;">${p.educationalAttainment || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 no-print">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 no-print space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <div className="flex items-center space-x-2">
              {filteredData.length > 0 && (
                <button
                  onClick={handlePrint}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                  title="Print"
                >
                  <Printer className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Course
            </label>
            <input
              type="text"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              placeholder="Type course name to filter..."
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            />
            {courseFilter && (
              <p className="text-xs text-gray-600 mt-2">
                Showing {filteredData.length} of {data.length} records
              </p>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {filteredData.length === 0 ? (
            <div className="flex items-center justify-center h-500 p-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  {courseFilter ? 'No applicants match the course filter' : 'No applicants match the selected criteria'}
                </p>
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
                </tr>
              </thead>
              <tbody>
                {filteredData.map((p, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{p.code || '-'}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {`${p.firstName} ${p.middleName ? p.middleName + ' ' : ''}${p.lastName}`}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{p.gender || '-'}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{p.age || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{p.barangay || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{p.contactNumber || '-'}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">
                      {p.educationalAttainment || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 rounded-b-xl no-print">
          Showing {filteredData.length} of {data.length} record{data.length !== 1 ? 's' : ''} • Generated on{' '}
          {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
