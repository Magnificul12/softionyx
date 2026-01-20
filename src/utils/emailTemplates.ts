export interface EmailData {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string;
  phone?: string;
  serviceType?: string;
  priority?: string;
  jobTitle?: string;
  [key: string]: any;
}

// Contact form submission template
export const contactFormTemplate = (data: EmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #6366f1; margin-bottom: 5px; display: block; }
        .value { color: #1f2937; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span>
            <span class="value">${data.name || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="label">Email:</span>
            <span class="value">${data.email || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="label">Subject:</span>
            <span class="value">${data.subject || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="label">Message:</span>
            <div class="value" style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">${data.message || 'N/A'}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the SoftIonyx website contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Help request template
export const helpRequestTemplate = (data: EmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #6366f1; margin-bottom: 5px; display: block; }
        .value { color: #1f2937; }
        .priority { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 12px; }
        .priority-urgent { background: #ef4444; color: white; }
        .priority-high { background: #f59e0b; color: white; }
        .priority-medium { background: #3b82f6; color: white; }
        .priority-low { background: #10b981; color: white; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Help Request</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span>
            <span class="value">${data.name || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="label">Email:</span>
            <span class="value">${data.email || 'N/A'}</span>
          </div>
          ${data.company ? `
          <div class="field">
            <span class="label">Company:</span>
            <span class="value">${data.company}</span>
          </div>
          ` : ''}
          ${data.phone ? `
          <div class="field">
            <span class="label">Phone:</span>
            <span class="value">${data.phone}</span>
          </div>
          ` : ''}
          <div class="field">
            <span class="label">Service Type:</span>
            <span class="value">${data.serviceType || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="label">Priority:</span>
            <span class="priority priority-${data.priority || 'medium'}">${(data.priority || 'medium').toUpperCase()}</span>
          </div>
          <div class="field">
            <span class="label">Subject:</span>
            <span class="value">${data.subject || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="label">Description:</span>
            <div class="value" style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">${data.description || 'N/A'}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the SoftIonyx website help request form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Job application template
export const jobApplicationTemplate = (data: EmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #6366f1; margin-bottom: 5px; display: block; }
        .value { color: #1f2937; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Job Application</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Position:</span>
            <span class="value">${data.jobTitle || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="label">Applicant Name:</span>
            <span class="value">${data.name || 'N/A'}</span>
          </div>
          <div class="field">
            <span class="label">Email:</span>
            <span class="value">${data.email || 'N/A'}</span>
          </div>
          ${data.phone ? `
          <div class="field">
            <span class="label">Phone:</span>
            <span class="value">${data.phone}</span>
          </div>
          ` : ''}
          ${data.resumeUrl ? `
          <div class="field">
            <span class="label">Resume:</span>
            <span class="value"><a href="${data.resumeUrl}" target="_blank">Download Resume</a></span>
          </div>
          ` : ''}
          ${data.coverLetter ? `
          <div class="field">
            <span class="label">Cover Letter:</span>
            <div class="value" style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">${data.coverLetter}</div>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>This email was sent from the SoftIonyx website job application form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Welcome email template
export const welcomeEmailTemplate = (data: EmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to SoftIonyx!</h1>
        </div>
        <div class="content">
          <p>Hello ${data.name || 'there'},</p>
          <p>Thank you for registering with SoftIonyx. We're excited to have you on board!</p>
          <p>You can now access your account and explore our services.</p>
          <a href="${data.loginUrl || '#'}" class="button">Login to Your Account</a>
          <p style="margin-top: 30px;">Best regards,<br>The SoftIonyx Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} SoftIonyx Technologies. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
