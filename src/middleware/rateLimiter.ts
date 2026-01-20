import rateLimit from 'express-rate-limit';
import logger from '../utils/logger';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
    });
  },
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
    });
  },
});

// Rate limiter for contact form
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 contact submissions per hour
  message: {
    error: 'Too many contact form submissions, please try again later.',
  },
  handler: (req, res) => {
    logger.warn(`Contact form rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many contact form submissions, please try again later.',
    });
  },
});

// Rate limiter for help requests
export const helpRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 help requests per hour
  message: {
    error: 'Too many help requests, please try again later.',
  },
  handler: (req, res) => {
    logger.warn(`Help request rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many help requests, please try again later.',
    });
  },
});
