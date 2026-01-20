import { pool } from '../config/database';
import logger from './logger';

export interface DashboardStats {
  totalContacts: number;
  totalHelpRequests: number;
  totalJobApplications: number;
  totalBlogPosts: number;
  totalUsers: number;
  totalServices: number;
  recentContacts: any[];
  recentHelpRequests: any[];
  recentJobApplications: any[];
  helpRequestsByStatus: { status: string; count: number }[];
  contactsByMonth: { month: string; count: number }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total counts
    const [
      contactsResult,
      helpRequestsResult,
      jobApplicationsResult,
      blogPostsResult,
      usersResult,
      servicesResult,
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM contact_submissions'),
      pool.query('SELECT COUNT(*) as count FROM help_requests'),
      pool.query('SELECT COUNT(*) as count FROM job_applications'),
      pool.query("SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'"),
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query("SELECT COUNT(*) as count FROM services WHERE is_active = true"),
    ]);

    // Get recent items
    const [recentContacts, recentHelpRequests, recentJobApplications] = await Promise.all([
      pool.query(
        'SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 5'
      ),
      pool.query(
        'SELECT * FROM help_requests ORDER BY created_at DESC LIMIT 5'
      ),
      pool.query(
        `SELECT ja.*, jp.title as job_title 
         FROM job_applications ja 
         JOIN job_postings jp ON ja.job_id = jp.id 
         ORDER BY ja.created_at DESC LIMIT 5`
      ),
    ]);

    // Get help requests by status
    const helpRequestsByStatusResult = await pool.query(
      `SELECT status, COUNT(*) as count 
       FROM help_requests 
       GROUP BY status 
       ORDER BY count DESC`
    );

    // Get contacts by month (last 6 months)
    const contactsByMonthResult = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'YYYY-MM') as month,
         COUNT(*) as count
       FROM contact_submissions
       WHERE created_at >= NOW() - INTERVAL '6 months'
       GROUP BY TO_CHAR(created_at, 'YYYY-MM')
       ORDER BY month ASC`
    );

    return {
      totalContacts: parseInt(contactsResult.rows[0].count),
      totalHelpRequests: parseInt(helpRequestsResult.rows[0].count),
      totalJobApplications: parseInt(jobApplicationsResult.rows[0].count),
      totalBlogPosts: parseInt(blogPostsResult.rows[0].count),
      totalUsers: parseInt(usersResult.rows[0].count),
      totalServices: parseInt(servicesResult.rows[0].count),
      recentContacts: recentContacts.rows,
      recentHelpRequests: recentHelpRequests.rows,
      recentJobApplications: recentJobApplications.rows,
      helpRequestsByStatus: helpRequestsByStatusResult.rows.map((row) => ({
        status: row.status,
        count: parseInt(row.count),
      })),
      contactsByMonth: contactsByMonthResult.rows.map((row) => ({
        month: row.month,
        count: parseInt(row.count),
      })),
    };
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    throw error;
  }
};
