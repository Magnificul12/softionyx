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
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

router.post('/', contactLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = contactSchema.parse(req.body);

    // Save to database
    const result = await pool.query(
      `INSERT INTO contact_submissions (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, subject, message]
    );

    logger.info(`New contact submission from ${email}`);

    // If email is configured, send email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
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

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
          subject: `Contact Form: ${subject}`,
          html: contactFormTemplate({ name, email, subject, message }),
          replyTo: email,
        });

        logger.info(`Contact form email sent for ${email}`);
      } catch (emailError) {
        logger.error('Email sending error:', emailError);
        // Don't fail the request if email fails
      }
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

