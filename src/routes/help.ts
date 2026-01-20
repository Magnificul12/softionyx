import express, { Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { helpRequestLimiter } from '../middleware/rateLimiter';
import logger from '../utils/logger';
import { helpRequestTemplate } from '../utils/emailTemplates';

const router = express.Router();

const helpRequestSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  service_type: z.string().min(1, 'Service type is required'),
  subject: z.string().min(3, 'Subject is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

// Create help request (public - no auth required)
router.post('/', helpRequestLimiter, async (req: Request, res: Response) => {
  try {
    const data = helpRequestSchema.parse(req.body);
    const userId = (req as any).user?.id || null;

    const result = await pool.query(
      `INSERT INTO help_requests 
       (user_id, name, email, company_name, phone, service_type, subject, description, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        userId,
        data.name,
        data.email,
        data.company_name || null,
        data.phone || null,
        data.service_type,
        data.subject,
        data.description,
        data.priority || 'medium',
      ]
    );

    const helpRequest = result.rows[0];

    logger.info(`New help request created: ${data.email} - ${data.subject}`);

    // Send email notification if configured
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
          subject: `New Help Request: ${data.subject}`,
          html: helpRequestTemplate({
            name: data.name,
            email: data.email,
            company: data.company_name,
            phone: data.phone,
            serviceType: data.service_type,
            priority: data.priority || 'medium',
            subject: data.subject,
            description: data.description,
          }),
          replyTo: data.email,
        });

        logger.info(`Help request email sent for ${data.email}`);
      } catch (emailError) {
        logger.error('Email sending error:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Help request submitted successfully. We will contact you soon!',
      request: helpRequest,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn('Help request validation error:', error.errors);
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('Help request error:', error);
    res.status(500).json({ error: 'Failed to submit help request' });
  }
});

// Get user's help requests (authenticated)
router.get('/my-requests', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM help_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user!.id]
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Get help requests error:', error);
    res.status(500).json({ error: 'Failed to fetch help requests' });
  }
});

// Get all help requests (admin only)
router.get('/all', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const result = await pool.query(
      'SELECT * FROM help_requests ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Get all help requests error:', error);
    res.status(500).json({ error: 'Failed to fetch help requests' });
  }
});

export default router;

