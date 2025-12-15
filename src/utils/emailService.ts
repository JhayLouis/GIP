/*
  EMAIL SERVICE
  ==============
  This service uses mock email by default. Uncomment the API calls to connect to backend.

  To enable backend email service:
  1. Update .env file with your backend API URL:
     VITE_BACKEND_URL=https://api.sampledomain.com/api

  2. Backend should implement this endpoint:
     POST /emails/send-applicant
     {
       "to": "Email Address",
       "name": "Applicant Name",
       "status": "APPROVED|REJECTED",
       "program": "GIP|TUPAD",
       "applicantCode": "APP-001"
     }

  Currently using mock email service for local development.
  To switch to API backend, uncomment the API_ENABLED constant in backendService.ts
*/

const API_ENABLED = false;

export interface SendEmailParams {
  to: string;
  name: string;
  status: 'APPROVED' | 'REJECTED';
  program: 'GIP' | 'TUPAD';
  applicantCode: string;
}

// ============================================
// MOCK EMAIL IMPLEMENTATION (DEFAULT)
// ============================================
const mockEmailService = {
  async sendApplicantEmail(params: SendEmailParams): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      console.log('Email service (mock):', params);
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Email sent successfully (mock)'
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async sendBulkEmails(applicants: Array<{ email: string; firstName: string; lastName: string; code: string; status: 'APPROVED' | 'REJECTED' }>, program: 'GIP' | 'TUPAD'): Promise<{ sent: number; failed: number; errors: string[] }> {
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const applicant of applicants) {
      if (!applicant.email) {
        failed++;
        errors.push(`${applicant.firstName} ${applicant.lastName}: No email address`);
        continue;
      }

      const result = await this.sendApplicantEmail({
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
  }
};

// API EMAIL IMPLEMENTATION (COMMENTED OUT)
/*
const apiEmailService = {
  async sendApplicantEmail(params: SendEmailParams): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';
      const response = await fetch(`${backendUrl}/emails/send-applicant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

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
  },

  async sendBulkEmails(applicants: Array<{ email: string; firstName: string; lastName: string; code: string; status: 'APPROVED' | 'REJECTED' }>, program: 'GIP' | 'TUPAD'): Promise<{ sent: number; failed: number; errors: string[] }> {
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const applicant of applicants) {
      if (!applicant.email) {
        failed++;
        errors.push(`${applicant.firstName} ${applicant.lastName}: No email address`);
        continue;
      }

      const result = await this.sendApplicantEmail({
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
  }
};
*/

// EXPORT SERVICE (USES SELECTED IMPLEMENTATION)
export const sendApplicantEmail = async (params: SendEmailParams): Promise<{ success: boolean; message: string; error?: string }> => {
  return mockEmailService.sendApplicantEmail(params);
};

export const sendBulkEmails = async (applicants: Array<{ email: string; firstName: string; lastName: string; code: string; status: 'APPROVED' | 'REJECTED' }>, program: 'GIP' | 'TUPAD'): Promise<{ sent: number; failed: number; errors: string[] }> => {
  return mockEmailService.sendBulkEmails(applicants, program);
};
