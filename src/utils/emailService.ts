/*
  EMAIL SERVICE - SUPABASE INTEGRATION
  ======================================

  Current Mode: Mock email service (DEFAULT)
  Available: Supabase edge function (commented out, ready to use)

  To enable Supabase email:
  1. Set up Supabase edge function for sending emails
  2. See SUPABASE_SETUP.md for email function setup
  3. Uncomment the supabaseEmailService implementation below
  4. Replace the export to use supabaseEmailService
*/

const SUPABASE_ENABLED = false;

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

// ============================================
// SUPABASE EMAIL IMPLEMENTATION (COMMENTED OUT)
// ============================================
/*
import { supabase } from './backendService'; // Uncomment when enabling Supabase

const supabaseEmailService = {
  async sendApplicantEmail(params: SendEmailParams): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/send-applicant-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`
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
