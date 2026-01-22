import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { pool } from '../config/database';
import { contactLimiter } from '../middleware/rateLimiter';
import logger from '../utils/logger';
import { contactFormTemplate } from '../utils/emailTemplates';

const router = express.Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      // Verifică formatul (doar cifre și caractere telefonice)
      if (!/^[0-9+\-() ]+$/.test(val)) return false;
      // Verifică că nu are mai mult de 15 cifre
      const digitsOnly = val.replace(/[^0-9]/g, '');
      return digitsOnly.length <= 15;
    }, {
      message: 'Phone number can only contain numbers and phone characters (+, -, spaces, parentheses), and cannot exceed 15 digits',
    }),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

router.post('/', contactLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = contactSchema.parse(req.body);

    // Try to save to database (optional - don't fail if DB is not configured)
    try {
      const result = await pool.query(
        `INSERT INTO contact_submissions (name, email, subject, message)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, email, subject, message]
      );
      logger.info(`New contact submission saved to database from ${email}`);
    } catch (dbError: any) {
      logger.warn('Failed to save contact submission to database:', dbError.message);
      // Continue with email sending even if DB save fails
    }

    // Send email notification (this is the main functionality)
    const contactEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
    
    if (!contactEmail) {
      logger.warn('CONTACT_EMAIL or SMTP_USER not configured. Email will not be sent.');
      return res.status(500).json({ 
        success: false, 
        error: 'Email configuration is missing. Please contact the administrator.' 
      });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn('SMTP credentials not configured. Email will not be sent.');
      return res.status(500).json({ 
        success: false, 
        error: 'Email service is not configured. Please contact the administrator.' 
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Try to send email appearing to come from the user
      // If Gmail rejects (from different than auth), fallback to SMTP_USER
      let mailOptions = {
        from: `"${name}" <${email}>`, // Try user's email first
        to: contactEmail,
        subject: `Contact Form: ${subject}`,
        html: contactFormTemplate({ name, email, phone, subject, message }),
        replyTo: `"${name}" <${email}>`,
        headers: {
          'Reply-To': `"${name}" <${email}>`,
          'X-Contact-Form': 'true',
          'X-Original-Sender': email,
        },
      };

      try {
        await transporter.sendMail(mailOptions);
        logger.info(`Contact form email sent to ${contactEmail} from ${email} (appearing as from user)`);
      } catch (fromError: any) {
        // If Gmail rejects due to 'from' mismatch, retry with SMTP_USER as from
        if (fromError.message && fromError.message.includes('from')) {
          logger.warn('Gmail rejected user email as from, using SMTP_USER instead:', fromError.message);
          mailOptions.from = `"${name} via SoftIonyx" <${process.env.SMTP_USER}>`;
          await transporter.sendMail(mailOptions);
          logger.info(`Contact form email sent to ${contactEmail} (from SMTP_USER, replyTo: ${email})`);
        } else {
          throw fromError; // Re-throw if it's a different error
        }
      }
    } catch (emailError: any) {
      logger.error('Email sending error:', emailError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send email. Please try again later or contact us directly.' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Thank you for your message! We will get back to you soon.' 
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn('Contact form validation error:', error.errors);
      return res.status(400).json({ 
        success: false, 
        error: error.errors[0].message 
      });
    }
    
    logger.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});

export default router;

