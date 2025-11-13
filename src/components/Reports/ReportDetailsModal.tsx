import React, { useState, useMemo } from 'react';
import { Printer, X, Mail } from 'lucide-react';
import EmailComposer from './EmailComposer';

interface ReportDetailsModalProps {
  title: string;
  data: any[];
  onClose: () => void;
  program?: 'GIP' | 'TUPAD';
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  title,
  data,
  onClose,
  program = 'GIP',
}) => {
  const [courseFilter, setCourseFilter] = useState('');
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const filteredData = useMemo(() => {
    if (!courseFilter.trim()) return data;
    return data.filter((item) =>
      item.course?.toLowerCase().includes(courseFilter.toLowerCase())
    );
  }, [data, courseFilter]);

  const applicantStatus = useMemo<'APPROVED' | 'REJECTED' | null>(() => {
    if (data.length === 0) return null;
    const status = data[0]?.status;
    return status === 'APPROVED' || status === 'REJECTED' ? status : null;
  }, [data]);

  const handleEmailClick = (applicant: any) => {
    setSelectedApplicant(applicant);
    setEmailComposerOpen(true);
  };

  const handleSendEmailSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page {
              size: legal portrait;
              margin: 5mm;
            }

            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            body {
              font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              font-size: 10pt;
              color: #1f2937;
              background-color: #fff;
              line-height: 1.5;
            }

            .document {
              max-width: 100%;
            }

            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 3px solid #dc2626;
              padding-bottom: 10px;
              margin-bottom: 25px;
            }

            .header img {
              height: 80px;
              width: auto;
              object-fit: contain;
            }

            .header-center {
              text-align: center;
              flex: 1;
            }

            .header-center h1 {
              font-size: 18pt;
              font-weight: 700;
              color: #dc2626;
              margin-bottom: 5px;
            }

            .header-center p {
              font-size: 9pt;
              color: #555;
              margin: 2px 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            th, td {
              border: 1px solid #e5e7eb;
              padding: 3px 4px;
              text-align: center;
              vertical-align: middle;
            }

            th {
              background-color: #f3f4f6;
              font-weight: 600;
              color: #111827;
              font-size: 8.5pt;
            }

            td {
              font-size: 8pt;
              color: #374151;
            }

            .no-data {
              text-align: center;
              padding: 40px;
              font-style: italic;
              color: #999;
            }

            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="document">
            <div class="header">
              <img src="src/assets/GIPlogo.png" alt="GIP Logo" />
              <div class="header-center">
                <h1>${title}</h1>
                <p>City Government of Santa Rosa - Office of the City Mayor</p>
                <p>Soft Projects Management System</p>
                <p>Generated on: ${new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
              </div>
              <img src="src/assets/DOLElogo.png" alt="DOLE Logo" />
            </div>

            ${
              filteredData.length === 0
                ? `
              <div class="no-data">
                No applicants found matching the selected criteria.
              </div>
            `
                : `
              <table>
                <thead>
                  <tr>
                    <th style="width: 12%;">Code</th>
                    <th style="width: 25%;">Full Name</th>
                    <th style="width: 8%;">Gender</th>
                    <th style="width: 6%;">Age</th>
                    <th style="width: 15%;">Barangay</th>
                    <th style="width: 12%;">Contact</th>
                    <th style="width: 22%;">Education</th>
                    <th style="width: 22%;">Course</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredData
                    .map(
                      (p) => `
                    <tr>
                      <td>${p.code || '-'}</td>
                      <td>${p.firstName || ''} ${
                        p.middleName ? p.middleName + ' ' : ''
                      }${p.lastName || ''}${
                        p.extensionName ? ' ' + p.extensionName : ''
                      }</td>
                      <td>${p.gender || '-'}</td>
                      <td>${p.age || '-'}</td>
                      <td>${p.barangay || '-'}</td>
                      <td>${p.contactNumber || '-'}</td>
                      <td>${p.educationalAttainment || '-'}</td>
                      <td>${p.course || '-'}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            `
            }
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
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

        {/* Table content */}
        <div className="flex-1 overflow-y-auto">
          {filteredData.length === 0 ? (
            <div className="flex items-center justify-center h-500 p-6">
              <p className="text-gray-400 text-sm">
                {courseFilter
                  ? 'No applicants match the course filter'
                  : 'No applicants match the selected criteria'}
              </p>
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Course</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((p, i) => (
                  <tr
                    key={`${refreshKey}-${i}`}
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
                    <td className="px-4 py-3 text-gray-700 text-xs">{p.educationalAttainment || '-'}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{p.course || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      {applicantStatus && p.email ? (
                        <button
                          onClick={() => handleEmailClick(p)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-all bg-blue-100 hover:bg-blue-200 text-blue-700"
                          title="Send email"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-xs font-medium">Email</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                          title={!applicantStatus ? 'Email only available for APPROVED/REJECTED' : 'No email address'}
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-xs font-medium">Email</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 rounded-b-xl no-print">
          Showing {filteredData.length} of {data.length} record
          {data.length !== 1 ? 's' : ''} • Generated on {new Date().toLocaleDateString()}
        </div>
      </div>

      {emailComposerOpen && selectedApplicant && applicantStatus && (
        <EmailComposer
          applicant={selectedApplicant}
          program={program}
          status={applicantStatus}
          onClose={() => {
            setEmailComposerOpen(false);
            setSelectedApplicant(null);
          }}
          onSendSuccess={handleSendEmailSuccess}
        />
      )}
    </div>
  );
};

export default ReportDetailsModal;
