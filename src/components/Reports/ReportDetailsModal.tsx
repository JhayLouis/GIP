import React, { useState, useMemo } from 'react';
import { Printer, X, Mail } from 'lucide-react';
import EmailComposer from './EmailComposer';
import { getHighestEducationAttainment } from '../../utils/dataService';

interface ReportDetailsModalProps {
  title: string;
  data: any[];
  onClose: () => void;
  program?: 'GIP' | 'TUPAD';
  showEmailActions?: boolean;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  title,
  data,
  onClose,
  program = 'GIP',
  showEmailActions = true,
}) => {
  const [courseFilter, setCourseFilter] = useState('');
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    if (!courseFilter.trim()) return data;
    return data.filter((item) =>
      item.course?.toLowerCase().includes(courseFilter.toLowerCase())
    );
  }, [data, courseFilter]);

  // ✅ Paginated data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const applicantStatus = useMemo<'APPROVED' | 'REJECTED' | null>(() => {
    if (data.length === 0 || !showEmailActions) return null;
    const status = data[0]?.status;
    return (status === 'APPROVED' || status === 'REJECTED') ? status : null;
  }, [data, showEmailActions]);

  const shouldShowEmailActions = showEmailActions && applicantStatus !== null && (applicantStatus === 'APPROVED' || applicantStatus === 'REJECTED');

  const handleEmailClick = (applicant: any) => {
    setSelectedApplicant(applicant);
    setEmailComposerOpen(true);
  };

  const handleSendEmailSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

const handlePrint = () => {
  const leftLogo = program === 'TUPAD' ? 'src/assets/TupadLogo.png' : 'src/assets/GIPlogo.png';

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: legal portrait; margin: 12.7mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 10.5pt; color: #1f2937; background-color: #fff; line-height: 1.55; padding: 5px; }
          .document { width: 100%; }
          .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #dc2626; padding-bottom: 14px; margin-bottom: 32px; }
          .header img { height: 85px; object-fit: contain; }
          .header-center { text-align: center; flex: 1; padding: 0 15px; }
          .header-center h1 { font-size: 19pt; font-weight: 700; color: #dc2626; margin-bottom: 6px; }
          .header-center p { font-size: 9.5pt; color: #555; margin: 2px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #e5e7eb; padding: 5px 6px; text-align: center; vertical-align: middle; }
          th { background-color: #f3f4f6; font-weight: 600; color: #111827; font-size: 9pt; }
          td { font-size: 8.5pt; color: #374151; }
          tbody tr:nth-child(even) { background: #fafafa; }
          .no-data { text-align: center; padding: 40px; font-style: italic; color: #999; font-size: 11pt; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } }
        </style>
      </head>
      <body>
        <div class="document">
          <div class="header">
            <img src="${leftLogo}" />
            <div class="header-center">
              <h1>${title}</h1>
              <p>City Government of Santa Rosa - Office of the City Mayor</p>
              <p>Soft Projects Management System</p>
              <p>Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <img src="src/assets/DOLElogo.png" />
          </div>

          ${
            filteredData.length === 0
              ? `<div class="no-data">No applicants found.</div>`
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
                <th style="width: 22%;">Educational Attainment</th>
                <th style="width: 22%;">Course</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map((p) => `
              <tr>
                <td>${p.code || '-'}</td>
                <td>${p.firstName || ''} ${p.middleName ? p.middleName + ' ' : ''}${p.lastName || ''}${p.extensionName ? ' ' + p.extensionName : ''}</td>
                <td>${p.gender || '-'}</td>
                <td>${p.age || '-'}</td>
                <td>${p.barangay || '-'}</td>
                <td>${p.contactNumber || '-'}</td>
                <td>${getHighestEducationAttainment(p)}</td>
                <td>${p.course || '-'}</td>
              </tr>
              `).join('')}
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
      <div className="bg-white dark:bg-slate-800 dark:text-gray-100 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 no-print space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>

            <div className="flex items-center space-x-2">
              {filteredData.length > 0 && (
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  title="Print"
                >
                  <Printer className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="rounded-lg p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:bg-slate-700 dark:bg-none">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Filter by Course</label>
            <input type="text" value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }} placeholder="Type course name to filter..." className="w-full px-3 py-2 border rounded-lg border-blue-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm" />
            {courseFilter && <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">Showing {filteredData.length} of {data.length} records</p>}
          </div>
        </div>

        {/* Table content */}
        <div className="flex-1 overflow-y-auto">
          {filteredData.length === 0 ? (
            <div className="flex items-center justify-center h-500 p-6">
              <p className="text-gray-400 text-sm">
                {courseFilter
                  ? 'No Applicants Match The Course Filter'
                  : 'No Applicants Found.'}
              </p>
            </div>
          ) : (
            <>
          <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Code</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Full Name</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">Gender</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">Age</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Barangay</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Contact</th>

              {program !== "TUPAD" && (
                <>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Education</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Course</th>
                </>
              )}

              {program !== "TUPAD" && shouldShowEmailActions && (
                <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">Actions</th>
              )}
            </tr>
          </thead>
            <tbody className="bg-white dark:bg-slate-900">
              {paginatedData.map((p, i) => (
                <tr
                  key={`${refreshKey}-${i}`}
                  className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{p.code || "-"}</td>

                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                    {`${p.firstName} ${p.middleName ? p.middleName + " " : ""}${p.lastName}`}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                    {p.gender || "-"}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                    {p.age || "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {p.barangay || "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {p.contactNumber || "-"}
                  </td>

                  {program !== "TUPAD" && (
                    <>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-xs">
                        {getHighestEducationAttainment(p)}
                      </td>

                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-xs">
                        {p.course || "-"}
                      </td>
                    </>
                  )}

                  {program !== "TUPAD" && shouldShowEmailActions && (
                    <td className="px-4 py-3 text-center">
                      {p.email ? (
                        <button
                          onClick={() => handleEmailClick(p)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-all
                                    bg-blue-100 hover:bg-blue-200 text-blue-700
                                    dark:bg-blue-900/40 dark:hover:bg-blue-900/60 dark:text-blue-300"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-xs font-medium">Email</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg cursor-not-allowed
                                    bg-gray-100 text-gray-400
                                    dark:bg-slate-700 dark:text-slate-500"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-xs font-medium">Email</span>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-3 
                          bg-gray-50 dark:bg-slate-800 
                          border-t border-gray-200 dark:border-slate-700 
                          text-sm text-gray-700 dark:text-gray-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg 
                          bg-white dark:bg-slate-700 
                          border-gray-300 dark:border-slate-600 
                          hover:bg-gray-100 dark:hover:bg-slate-600
                          disabled:opacity-40 disabled:cursor-not-allowed
                          transition"
              >
                Previous
              </button>

              <span className="text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded-lg 
                          bg-white dark:bg-slate-700 
                          border-gray-300 dark:border-slate-600 
                          hover:bg-gray-100 dark:hover:bg-slate-600
                          disabled:opacity-40 disabled:cursor-not-allowed
                          transition"
              >
                Next
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 dark:text-gray-300">
                Rows per page:
              </span>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-2 py-1 
                          bg-white dark:bg-slate-700 
                          text-gray-800 dark:text-gray-200
                          border-gray-300 dark:border-slate-600 
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n} className="dark:bg-slate-700">
                    {n}
                  </option>
                ))}
              </select>
            </div>

              </div>
            </>
          )}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-600 dark:text-gray-300 rounded-b-xl no-print">
          Showing {filteredData.length} of {data.length} record{data.length !== 1 ? 's' : ''} • Generated on {new Date().toLocaleDateString()}
        </div>
      </div>

      {emailComposerOpen && selectedApplicant && shouldShowEmailActions && applicantStatus && (
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
