import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { z } from 'zod';
import { authLimiter } from '../middleware/rateLimiter';
import logger from '../utils/logger';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Public self-registration is permanently disabled — this platform only
// allows admin-managed accounts. Kept as a handler (rather than removing
// the route) so that old clients get a clear, intentional error instead
// of a confusing 404. Accept both GET and POST so browsers hitting the
// URL directly also get a friendly message.
const registrationDisabled = (_req: Request, res: Response) => {
  return res.status(403).json({
    error: 'Registration is disabled',
    message: 'Self-registration is not available. Please contact an administrator.',
  });
};
router.post('/register', authLimiter, registrationDisabled);
router.get('/register', authLimiter, registrationDisabled);

// Login
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const { email, password } = data;

    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, company_name, role, is_active FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        company_name: user.company_name,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn('Login validation error:', error.errors);
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const result = await pool.query(
      'SELECT id, email, full_name, company_name, phone, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

