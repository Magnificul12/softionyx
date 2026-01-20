import express, { Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import logger from '../utils/logger';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  featured_image: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

// Get all published blog posts
router.get('/', apiLimiter, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT bp.*, u.full_name as author_name 
       FROM blog_posts bp 
       LEFT JOIN users u ON bp.author_id = u.id 
       WHERE bp.status = 'published' 
       ORDER BY bp.published_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post by slug
router.get('/:slug', apiLimiter, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT bp.*, u.full_name as author_name 
       FROM blog_posts bp 
       LEFT JOIN users u ON bp.author_id = u.id 
       WHERE bp.slug = $1 AND bp.status = 'published'`,
      [req.params.slug]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment views
    await pool.query(
      'UPDATE blog_posts SET views = views + 1 WHERE id = $1',
      [result.rows[0].id]
    );
    
    logger.info(`Blog post viewed: ${req.params.slug}`);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get blog post error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Create blog post (admin only)
router.post('/', authenticate, apiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const data = blogPostSchema.parse(req.body);
    const { title, slug, excerpt, content, featured_image, status } = data;
    
    const result = await pool.query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author_id, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        slug,
        excerpt || null,
        content,
        featured_image || null,
        req.user!.id,
        status || 'draft',
        status === 'published' ? new Date() : null
      ]
    );
    
    logger.info(`Blog post created: ${slug} by ${req.user!.email}`);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn('Blog post validation error:', error.errors);
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    logger.error('Create blog post error:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update blog post (admin only)
router.put('/:id', authenticate, apiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const data = blogPostSchema.partial().parse(req.body);
    const postId = parseInt(req.params.id);
    
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (data.title) {
      updateFields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.slug) {
      updateFields.push(`slug = $${paramIndex++}`);
      values.push(data.slug);
    }
    if (data.excerpt !== undefined) {
      updateFields.push(`excerpt = $${paramIndex++}`);
      values.push(data.excerpt);
    }
    if (data.content) {
      updateFields.push(`content = $${paramIndex++}`);
      values.push(data.content);
    }
    if (data.featured_image !== undefined) {
      updateFields.push(`featured_image = $${paramIndex++}`);
      values.push(data.featured_image);
    }
    if (data.status) {
      updateFields.push(`status = $${paramIndex++}`);
      values.push(data.status);
      if (data.status === 'published') {
        updateFields.push(`published_at = $${paramIndex++}`);
        values.push(new Date());
      }
    }
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(postId);
    
    const result = await pool.query(
      `UPDATE blog_posts 
       SET ${updateFields.join(', ')} 
       WHERE id = $${paramIndex} 
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    logger.info(`Blog post updated: ${postId} by ${req.user!.email}`);
    res.json(result.rows[0]);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('Update blog post error:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete blog post (admin only)
router.delete('/:id', authenticate, apiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const postId = parseInt(req.params.id);
    
    const result = await pool.query(
      'DELETE FROM blog_posts WHERE id = $1 RETURNING *',
      [postId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    logger.info(`Blog post deleted: ${postId} by ${req.user!.email}`);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    logger.error('Delete blog post error:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

export default router;
