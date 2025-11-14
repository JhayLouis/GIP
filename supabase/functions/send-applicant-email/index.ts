import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  to: string;
  name: string;
  status: 'APPROVED' | 'REJECTED';
  program: 'GIP' | 'TUPAD';
  applicantCode: string;
}

const getEmailTemplate = (name: string, status: string, program: string, applicantCode: string) => {
  const programName = program === 'GIP' 
    ? 'Government Internship Program (GIP)' 
    : 'Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers (TUPAD)';

  if (status === 'APPROVED') {
    return {
      subject: `Application Approved - ${program} Program`,
      html: `
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
              <p>Dear <strong>${name}</strong>,</p>
              
              <p>Good day!</p>
              
              <p>We are pleased to inform you that your application for the <strong>${programName}</strong> has been <strong style="color: #16a34a;">APPROVED</strong>.</p>
              
              <div class="highlight">
                <strong>Application Details:</strong><br>
                Application Code: <strong>${applicantCode}</strong><br>
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
      `,
      text: `Dear ${name},\n\nGood day!\n\nWe are pleased to inform you that your application for the ${programName} has been APPROVED.\n\nApplication Code: ${applicantCode}\nProgram: ${program}\nStatus: APPROVED\n\nNext Steps:\n- You will receive further instructions regarding your deployment schedule via email or phone call.\n- Please ensure that all your contact information is up to date.\n- Prepare all necessary documents as previously submitted.\n- Wait for further announcements from our office.\n\nCongratulations on your approval! We look forward to working with you in the ${program} program.\n\nBest regards,\nSOFT Projects Management Team\nCity Government of Santa Rosa\nOffice of the City Mayor`
    };
  } else if (status === 'REJECTED') {
    return {
      subject: `Application Status Update - ${program} Program`,
      html: `
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
              <p>Dear <strong>${name}</strong>,</p>
              
              <p>Good day!</p>
              
              <p>We regret to inform you that after careful review and consideration, your application for the <strong>${programName}</strong> has not been approved at this time.</p>
              
              <div class="highlight">
                <strong>Application Details:</strong><br>
                Application Code: <strong>${applicantCode}</strong><br>
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
      `,
      text: `Dear ${name},\n\nGood day!\n\nWe regret to inform you that after careful review and consideration, your application for the ${programName} has not been approved at this time.\n\nApplication Code: ${applicantCode}\nProgram: ${program}\nStatus: NOT APPROVED\n\nWhat this means:\n- Your application did not meet the current selection criteria for this program cycle.\n- This decision does not reflect on your qualifications or worth as an applicant.\n- You may be eligible to apply for future program cycles when they become available.\n\nWe appreciate your interest in the ${program} program and thank you for taking the time to apply.\n\nSincerely,\nSOFT Projects Management Team\nCity Government of Santa Rosa\nOffice of the City Mayor`
    };
  }

  throw new Error('Invalid status');
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { to, name, status, program, applicantCode }: EmailRequest = await req.json();

    if (!to || !name || !status || !program || !applicantCode) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status. Must be APPROVED or REJECTED' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          message: 'Please configure RESEND_API_KEY in your Supabase Edge Function secrets'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const emailTemplate = getEmailTemplate(name, status, program, applicantCode);

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SOFT Projects <noreply@yourdomain.com>',
        to: [to],
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: resendData.message || 'Unknown error from email service'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Email sent successfully to: ${to}`);
    console.log(`Email ID: ${resendData.id}`);

    const data = {
      success: true,
      message: `Email sent successfully to ${to}`,
      details: {
        recipient: to,
        name,
        status,
        program,
        applicantCode,
        subject: emailTemplate.subject,
        emailId: resendData.id
      }
    };

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});