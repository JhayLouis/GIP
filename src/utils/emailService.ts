const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface SendEmailParams {
  to: string;
  name: string;
  status: 'APPROVED' | 'REJECTED';
  program: 'GIP' | 'TUPAD';
  applicantCode: string;
}

export const sendApplicantEmail = async (params: SendEmailParams): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase configuration is missing');
    }

    const apiUrl = `${SUPABASE_URL}/functions/v1/send-applicant-email`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to send email',
        error: data.error || data.details || 'Unknown error occurred'
      };
    }

    return {
      success: true,
      message: data.message || 'Email sent successfully'
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
