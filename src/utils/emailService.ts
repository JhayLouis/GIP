/*
  EMAIL SERVICE
  ==============
  This service is ready to connect to a custom backend API for sending emails.

  To enable backend email service:
  1. Update .env file with your backend API URL:
     VITE_BACKEND_URL=https://api.yourdomain.com/api

  2. Backend should implement this endpoint:
     POST /emails/send-applicant
     {
       "to": "email@example.com",
       "name": "Applicant Name",
       "status": "APPROVED|REJECTED",
       "program": "GIP|TUPAD",
       "applicantCode": "APP-001"
     }

  Currently using mock email service for local development.
*/

export interface SendEmailParams {
  to: string;
  name: string;
  status: 'APPROVED' | 'REJECTED';
  program: 'GIP' | 'TUPAD';
  applicantCode: string;
}

export const sendApplicantEmail = async (params: SendEmailParams): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    console.log('Email service (mock):', params);

    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const sendBulkEmails = async (applicants: Array<{ email: string; firstName: string; lastName: string; code: string; status: 'APPROVED' | 'REJECTED' }>, program: 'GIP' | 'TUPAD'): Promise<{ sent: number; failed: number; errors: string[] }> => {
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const applicant of applicants) {
    if (!applicant.email) {
      failed++;
      errors.push(`${applicant.firstName} ${applicant.lastName}: No email address`);
      continue;
    }

    const result = await sendApplicantEmail({
      to: applicant.email,
      name: `${applicant.firstName} ${applicant.lastName}`,
      status: applicant.status,
      program,
      applicantCode: applicant.code
    });

    if (result.success) {
      sent++;
    } else {
      failed++;
      errors.push(`${applicant.firstName} ${applicant.lastName}: ${result.error || 'Unknown error'}`);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return { sent, failed, errors };
};
