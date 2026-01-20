import express, { Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import logger from '../utils/logger';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  long_description: z.string().optional(),
  color: z.string().optional(),
  order_index: z.number().optional(),
  is_active: z.boolean().optional(),
});

// Get all active services
router.get('/', apiLimiter, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE is_active = true ORDER BY order_index ASC'
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get single service by slug
router.get('/:slug', apiLimiter, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE slug = $1 AND is_active = true',
      [req.params.slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create service (admin only)
router.post('/', authenticate, apiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const data = serviceSchema.parse(req.body);
    
    const result = await pool.query(
      `INSERT INTO services (title, slug, icon, description, long_description, color, order_index, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.title,
        data.slug,
        data.icon || null,
        data.description,
        data.long_description || null,
        data.color || null,
        data.order_index || 0,
        data.is_active !== undefined ? data.is_active : true,
      ]
    );
    
    logger.info(`Service created: ${data.slug} by ${req.user!.email}`);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    logger.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service (admin only)
router.put('/:id', authenticate, apiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const data = serviceSchema.partial().parse(req.body);
    const serviceId = parseInt(req.params.id);
    
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    Object.keys(data).forEach((key) => {
      if (data[key as keyof typeof data] !== undefined) {
        updateFields.push(`${key} = $${paramIndex++}`);
        values.push(data[key as keyof typeof data]);
      }
    });
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(serviceId);
    
    const result = await pool.query(
      `UPDATE services 
       SET ${updateFields.join(', ')} 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    logger.info(`Service updated: ${serviceId} by ${req.user!.email}`);
    res.json(result.rows[0]);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service (admin only)
router.delete('/:id', authenticate, apiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const serviceId = parseInt(req.params.id);
    
    const result = await pool.query(
      'DELETE FROM services WHERE id = $1 RETURNING *',
      [serviceId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    logger.info(`Service deleted: ${serviceId} by ${req.user!.email}`);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    logger.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
