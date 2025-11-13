import React, { useState, useMemo } from 'react';
import { Send, X, AlertCircle, CheckCircle } from 'lucide-react';
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
  onClose: () => void;
  onSendSuccess: () => void;
}

const EmailComposer: React.FC<EmailComposerProps> = ({
  applicant,
  program,
  onClose,
  onSendSuccess
}) => {
  const [status, setStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [customizeMode, setCustomizeMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const programName = program === 'GIP'
    ? 'Government Internship Program (GIP)'
    : 'Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers (TUPAD)';

  const getEmailTemplate = (statusType: 'APPROVED' | 'REJECTED') => {
    if (statusType === 'APPROVED') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: ${program === 'GIP' ? '#dc2626' : '#16a34a'}; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .highlight { background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${program} Application Status</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${applicant.firstName} ${applicant.lastName}</strong>,</p>

              <p>Good day!</p>

              <p>We are pleased to inform you that your application for the <strong>${programName}</strong> has been <strong style="color: #16a34a;">APPROVED</strong>.</p>

              <div class="highlight">
                <strong>Application Details:</strong><br>
                Application Code: <strong>${applicant.code}</strong><br>
                Program: <strong>${program}</strong><br>
                Status: <strong>APPROVED</strong>
              </div>

              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>You will receive further instructions regarding your deployment schedule via email or phone call.</li>
                <li>Please ensure that all your contact information is up to date.</li>
                <li>Prepare all necessary documents as previously submitted.</li>
                <li>Wait for further announcements from our office.</li>
              </ul>

              <p>Congratulations on your approval! We look forward to working with you in the ${program} program.</p>

              <p>Should you have any questions or concerns, please do not hesitate to contact our office.</p>

              <p>Best regards,</p>
              <p><strong>SOFT Projects Management Team</strong><br>
              City Government of Santa Rosa<br>
              Office of the City Mayor</p>
            </div>
            <div class="footer">
              <p>This is an automated message from the SOFT Projects Management System.</p>
              <p>&copy; 2025 City Government of Santa Rosa - Office of the City Mayor</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: ${program === 'GIP' ? '#dc2626' : '#16a34a'}; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .highlight { background-color: #fee2e2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${program} Application Status</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${applicant.firstName} ${applicant.lastName}</strong>,</p>

              <p>Good day!</p>

              <p>We regret to inform you that after careful review and consideration, your application for the <strong>${programName}</strong> has not been approved at this time.</p>

              <div class="highlight">
                <strong>Application Details:</strong><br>
                Application Code: <strong>${applicant.code}</strong><br>
                Program: <strong>${program}</strong><br>
                Status: <strong>NOT APPROVED</strong>
              </div>

              <p><strong>What this means:</strong></p>
              <ul>
                <li>Your application did not meet the current selection criteria for this program cycle.</li>
                <li>This decision does not reflect on your qualifications or worth as an applicant.</li>
                <li>You may be eligible to apply for future program cycles when they become available.</li>
              </ul>

              <p><strong>Moving Forward:</strong></p>
              <ul>
                <li>We encourage you to stay updated with our office for future opportunities.</li>
                <li>You may inquire about other available programs that may suit your qualifications.</li>
                <li>Consider strengthening your application for future submissions.</li>
              </ul>

              <p>We appreciate your interest in the ${program} program and thank you for taking the time to apply. We wish you all the best in your future endeavors.</p>

              <p>Should you have any questions or require clarification, please feel free to contact our office.</p>

              <p>Sincerely,</p>
              <p><strong>SOFT Projects Management Team</strong><br>
              City Government of Santa Rosa<br>
              Office of the City Mayor</p>
            </div>
            <div class="footer">
              <p>This is an automated message from the SOFT Projects Management System.</p>
              <p>&copy; 2025 City Government of Santa Rosa - Office of the City Mayor</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }
  };

  const emailContent = useMemo(() => {
    return customizeMode ? htmlContent : getEmailTemplate(status);
  }, [customizeMode, htmlContent, status]);

  const handleStatusChange = (newStatus: 'APPROVED' | 'REJECTED') => {
    setStatus(newStatus);
    if (!customizeMode) {
      setHtmlContent(getEmailTemplate(newStatus));
    }
  };

  const handleSendEmail = async () => {
    if (!applicant.email) {
      await Swal.fire({
        icon: 'error',
        title: 'No Email Address',
        text: 'This applicant does not have an email address on file.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Send Email',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl shadow-lg',
        confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold',
        cancelButton: 'px-5 py-2 rounded-lg text-white font-semibold'
      }
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
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
        onSendSuccess();
        onClose();
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Failed to Send Email',
          html: `<p>${response.error || response.message}</p>`,
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
          }
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred while sending the email.',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'px-5 py-2 rounded-lg text-white font-semibold'
        }
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email Status
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusChange('APPROVED')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    status === 'APPROVED'
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => handleStatusChange('REJECTED')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    status === 'REJECTED'
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-red-300 text-red-700 hover:bg-red-50'
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Email Content
                </label>
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
                    This applicant does not have an email address on file. Please update their information first.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

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
