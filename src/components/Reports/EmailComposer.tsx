import React, { useState, useMemo } from 'react';
import { Send, X, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { sendApplicantEmail } from '../../utils/emailService';

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  code: string;
}

interface EmailComposerProps {
  applicant: Applicant;
  program: 'GIP' | 'TUPAD';
  status: 'APPROVED' | 'REJECTED';
  onClose: () => void;
  onSendSuccess: () => void;
}

const EmailComposer: React.FC<EmailComposerProps> = ({
  applicant,
  program,
  status,
  onClose,
  onSendSuccess
}) => {
  const [customizeMode, setCustomizeMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const programName =
    program === 'GIP'
      ? 'Government Internship Program (GIP)'
      : 'Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers (TUPAD)';

  const getEmailTemplate = (statusType: 'APPROVED' | 'REJECTED') => {
    const isApproved = statusType === 'APPROVED';
    const headerColor = program === 'GIP' ? '#dc2626' : '#16a34a';
    const accentColor = isApproved ? '#16a34a' : '#dc2626';
    const highlightBg = isApproved ? '#f0fdf4' : '#fef2f2';
    const highlightBorder = isApproved ? '#22c55e' : '#ef4444';
    const statusText = isApproved ? 'APPROVED' : 'NOT APPROVED';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${program} Application Status</title>
        <style>
          body {
            font-family: 'Segoe UI', Roboto, Arial, sans-serif;
            background-color: #f9fafb;
            color: #1f2937;
            margin: 0;
            padding: 40px 0;
          }

          .email-wrapper {
            max-width: 640px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            border: 1px solid #e5e7eb;
          }

          .header {
            background-color: ${headerColor};
            color: #fff;
            text-align: center;
            padding: 26px 16px;
            border-bottom: 6px solid #facc15;
          }

          .header h1 {
            font-size: 18pt;
            font-weight: 700;
            margin: 0;
          }

          .body {
            padding: 30px 36px;
          }

          .body p {
            font-size: 11pt;
            line-height: 1.7;
            margin: 10px 0;
          }

          .highlight-box {
            background-color: ${highlightBg};
            border-left: 5px solid ${highlightBorder};
            padding: 14px 18px;
            margin: 24px 0;
            border-radius: 8px;
          }

          .highlight-box strong {
            color: ${accentColor};
          }

          ul {
            margin-top: 12px;
            padding-left: 20px;
          }

          ul li {
            font-size: 10.5pt;
            margin-bottom: 6px;
          }

          .signature {
            margin-top: 28px;
            font-size: 10.5pt;
            line-height: 1.6;
          }

          .footer {
            background-color: #dc2626;
            text-align: center;
            font-size: 9pt;
            color: #fff  ;
            padding: 18px;
            border-top: 6px solid #facc15;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>${program} Application Status</h1>
          </div>
          <div class="body">
            <p>Dear <strong>${applicant.firstName} ${applicant.lastName}</strong>,</p>
            <p>Good day!</p>

            ${
              isApproved
                ? `
                <p>We are pleased to inform you that your application for the <strong>${programName}</strong> has been <strong style="color:${accentColor}">${statusText}</strong>.</p>
                <div class="highlight-box">
                  <strong>Application Details:</strong><br/>
                  Application Code: <strong>${applicant.code}</strong><br/>
                  Program: <strong>${program}</strong><br/>
                  Status: <strong>${statusText}</strong>
                </div>
                <p><strong>Next Steps:</strong></p>
                <ul>
                  <li>You will receive your deployment schedule via email or phone call.</li>
                  <li>Ensure that your contact information is up to date.</li>
                  <li>Prepare all necessary supporting documents.</li>
                  <li>Wait for further announcements from our office.</li>
                </ul>
                <p>Congratulations on your approval! We look forward to working with you in the ${program} program.</p>
              `
                : `
                <p>We regret to inform you that after careful review, your application for the <strong>${programName}</strong> has <strong style="color:${accentColor}">${statusText}</strong> at this time.</p>
                <div class="highlight-box">
                  <strong>Application Details:</strong><br/>
                  Application Code: <strong>${applicant.code}</strong><br/>
                  Program: <strong>${program}</strong><br/>
                  Status: <strong>${statusText}</strong>
                </div>
                <p><strong>Moving Forward:</strong></p>
                <ul>
                  <li>Your application did not meet current selection criteria for this cycle.</li>
                  <li>You may reapply in the next batch or explore other city programs.</li>
                  <li>We encourage you to stay updated through our official channels.</li>
                </ul>
                <p>Thank you for your interest in the ${program} program, and we wish you all the best in your future endeavors.</p>
              `
            }

            <div class="signature">
              <p>Best regards,</p>
              <p><strong>SOFT Projects Management Team</strong><br>
              City Government of Santa Rosa<br>
              Office of the City Mayor</p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message from the SOFT Projects Management System.</p>
            <p>&copy; ${new Date().getFullYear()} City Government of Santa Rosa – Office of the City Mayor</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const emailContent = useMemo(() => {
    return customizeMode ? htmlContent : getEmailTemplate(status);
  }, [customizeMode, htmlContent, status]);

  const handleSendEmail = async () => {
    if (!applicant.email) {
      await Swal.fire({
        icon: 'error',
        title: 'No Email Address',
        text: 'This applicant does not have an email address on file.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Send Email?',
      html: `
        <p>Are you sure you want to send this email to:</p>
        <p class="font-semibold text-lg mt-2">${applicant.email}</p>
        <p class="text-sm text-gray-600 mt-4">Name: ${applicant.firstName} ${applicant.lastName}</p>
        <p class="text-sm text-gray-600">Status: ${status}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Send Email',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    setIsSending(true);

    try {
      const response = await sendApplicantEmail({
        to: applicant.email,
        name: `${applicant.firstName} ${applicant.lastName}`,
        status,
        program,
        applicantCode: applicant.code
      });

      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Email Sent Successfully',
          html: `<p>Email has been sent to <strong>${applicant.email}</strong></p>`,
          confirmButtonColor: '#3085d6'
        });
        onSendSuccess();
        onClose();
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Failed to Send Email',
          html: `<p>${response.error || response.message}</p>`,
          confirmButtonColor: '#3085d6'
        });
      }
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred while sending the email.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Send Email</h2>
            <p className="text-sm text-gray-600 mt-1">
              {applicant.firstName} {applicant.lastName} ({applicant.email || 'No email'})
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Editor */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className={`border rounded-lg p-4 ${
            status === 'APPROVED'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">Email Status</label>
              <span className={`px-4 py-1 rounded-full font-semibold text-sm ${
                status === 'APPROVED'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}>
                {status}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              This email will be sent as an {status.toLowerCase()} notification to the applicant.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">Email Content</label>
              <button
                onClick={() => setCustomizeMode(!customizeMode)}
                className="text-sm px-3 py-1 bg-purple-200 text-purple-700 rounded-lg hover:bg-purple-300 transition-colors font-medium"
              >
                {customizeMode ? 'Reset to Template' : 'Customize'}
              </button>
            </div>

            {customizeMode ? (
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="w-full h-64 p-3 border border-purple-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                placeholder="Enter HTML content..."
              />
            ) : (
              <div
                className="w-full h-64 p-4 bg-white border border-purple-300 rounded-lg overflow-auto text-xs"
                dangerouslySetInnerHTML={{ __html: emailContent }}
              />
            )}
          </div>

          {!applicant.email && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 text-sm">No Email Address</h4>
                <p className="text-xs text-red-700 mt-1">
                  This applicant does not have an email address on file.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-2 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isSending || !applicant.email}
            className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-all ${
              isSending || !applicant.email
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;
