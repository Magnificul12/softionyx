import express, { Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';
import { apiLimiter } from '../middleware/rateLimiter';
import { getDashboardStats } from '../utils/analytics';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// Get dashboard stats
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all contact submissions
router.get('/contacts', async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const result = await pool.query(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Update contact submission status
router.patch('/contacts/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { status } = req.body;
    const contactId = parseInt(req.params.id);
    
    const result = await pool.query(
      'UPDATE contact_submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, contactId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    logger.info(`Contact status updated: ${contactId} by ${req.user!.email}`);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Update contact error:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Get all job applications
router.get('/job-applications', async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const result = await pool.query(
      `SELECT ja.*, jp.title as job_title 
       FROM job_applications ja 
       JOIN job_postings jp ON ja.job_id = jp.id 
       ORDER BY ja.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get job applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Update job application status
router.patch('/job-applications/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { status } = req.body;
    const applicationId = parseInt(req.params.id);
    
    const result = await pool.query(
      'UPDATE job_applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, applicationId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    logger.info(`Job application status updated: ${applicationId} by ${req.user!.email}`);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Update job application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Get all users (admin only)
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const result = await pool.query(
      'SELECT id, email, full_name, company_name, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
