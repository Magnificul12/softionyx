import express, { Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import logger from '../utils/logger';
import { apiLimiter } from '../middleware/rateLimiter';
import { uploadResume, getFileUrl } from '../utils/upload';
import { jobApplicationTemplate } from '../utils/emailTemplates';
import nodemailer from 'nodemailer';

const router = express.Router();

const jobPostingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().optional(),
  location: z.string().optional(),
  employment_type: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  requirements: z.string().optional(),
  salary_range: z.string().optional(),
  status: z.enum(['active', 'closed', 'draft']).optional(),
});

const jobApplicationSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  cover_letter: z.string().optional(),
});

// Get all active job postings
router.get('/', apiLimiter, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM job_postings WHERE status = $1 ORDER BY created_at DESC',
      ['active']
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get single job posting
router.get('/:id', apiLimiter, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM job_postings WHERE id = $1 AND status = $2',
      [parseInt(req.params.id), 'active']
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Apply for job
router.post('/:id/apply', apiLimiter, uploadResume.single('resume'), async (req: Request, res: Response) => {
  try {
    const jobId = parseInt(req.params.id);
    const data = jobApplicationSchema.parse(req.body);
    
    // Check if job exists
    const jobResult = await pool.query(
      'SELECT * FROM job_postings WHERE id = $1 AND status = $2',
      [jobId, 'active']
    );
    
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or not active' });
    }
    
    const resumeUrl = req.file ? getFileUrl(req.file.filename, 'resume') : null;
    
    const result = await pool.query(
      `INSERT INTO job_applications (job_id, full_name, email, phone, resume_url, cover_letter)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [jobId, data.full_name, data.email, data.phone || null, resumeUrl, data.cover_letter || null]
    );
    
    logger.info(`New job application: ${data.email} for job ${jobId}`);
    
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
          subject: `New Job Application: ${jobResult.rows[0].title}`,
          html: jobApplicationTemplate({
            jobTitle: jobResult.rows[0].title,
            name: data.full_name,
            email: data.email,
            phone: data.phone,
            resumeUrl: resumeUrl,
            coverLetter: data.cover_letter,
          }),
          replyTo: data.email,
        });
      } catch (emailError) {
        logger.error('Email sending error:', emailError);
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: result.rows[0]
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn('Job application validation error:', error.errors);
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('Job application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Create job posting (admin only)
router.post('/', authenticate, apiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const data = jobPostingSchema.parse(req.body);
    
    const result = await pool.query(
      `INSERT INTO job_postings (title, department, location, employment_type, description, requirements, salary_range, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.title,
        data.department || null,
        data.location || null,
        data.employment_type || null,
        data.description,
        data.requirements || null,
        data.salary_range || null,
        data.status || 'draft',
      ]
    );
    
    logger.info(`Job posting created: ${data.title} by ${req.user!.email}`);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('Create job posting error:', error);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

export default router;
