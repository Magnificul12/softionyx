# SoftIonyx Website

Professional website for SoftIonyx IT Company with modern design, full-stack functionality, and comprehensive admin panel.

## Features

✅ **Modern Dark Theme** - Beautiful glassmorphism design with animations  
✅ **User Authentication** - Secure login/register with JWT  
✅ **Contact Forms** - Contact and help request forms with email notifications  
✅ **Blog System** - Full CRUD for blog posts  
✅ **Job Postings** - Job listings with application system  
✅ **File Uploads** - Resume and image upload support  
✅ **Admin Dashboard** - Analytics and content management  
✅ **Email Templates** - Professional HTML email templates  
✅ **Rate Limiting** - API protection against abuse  
✅ **Logging** - Comprehensive Winston logging system  
✅ **SEO Optimized** - Meta tags, sitemap, robots.txt  
✅ **Security** - Helmet.js security headers  

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication
- Winston Logging
- Nodemailer
- Multer (File Uploads)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand (State Management)
- React Helmet Async (SEO)

## Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Database Setup

```bash
# Create database
createdb softionyx

# Run schema
psql -d softionyx -f database/schema.sql
```

### 3. Environment Configuration

**Important:** After cloning the repository, you need to create a `.env` file.

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your configuration values:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=softionyx
DB_USER=deur  # or your PostgreSQL username
DB_PASSWORD=your_password_here

# JWT Secret (generate a strong random string, min 32 characters)
# Generate one using: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters

# Server Configuration
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Email Configuration (SMTP) - Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
CONTACT_EMAIL=your_contact_email@example.com

# Logging
LOG_LEVEL=info
```

**Important:** 
- Generate a strong JWT_SECRET (min 32 characters) - use: `openssl rand -base64 32`
- For Gmail, use an App Password (not your regular password)
- Update `DB_USER` to match your PostgreSQL username (default: `deur`)
- Update BASE_URL for production
- The `.env` file is gitignored for security - each developer needs their own copy

### 4. Run Development Server

```bash
# Run both backend and frontend
npm run dev

# Or separately:
npm run dev:server  # Backend only
npm run dev:client  # Frontend only
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Production Build

```bash
# Build both
npm run build

# Start production server
npm start
```

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   └── utils/         # Utilities
│   └── package.json
├── src/                    # Express backend
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.ts          # Main server file
├── database/              # Database schemas
│   └── schema.sql        # Database schema
├── uploads/               # Uploaded files (created automatically)
│   ├── resumes/          # Resume files
│   └── images/           # Image files
├── logs/                  # Log files (created automatically)
│   ├── combined.log      # All logs
│   └── error.log         # Error logs only
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Contact
- `POST /api/contact` - Submit contact form

### Help Requests
- `POST /api/help` - Submit help request
- `GET /api/help/my-requests` - Get user's requests (auth)
- `GET /api/help/all` - Get all requests (admin)

### Blog
- `GET /api/blog` - Get all published posts
- `GET /api/blog/:slug` - Get single post
- `POST /api/blog` - Create post (admin)
- `PUT /api/blog/:id` - Update post (admin)
- `DELETE /api/blog/:id` - Delete post (admin)

### Jobs
- `GET /api/jobs` - Get all active jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs/:id/apply` - Apply for job (with resume upload)
- `POST /api/jobs` - Create job posting (admin)

### Services
- `GET /api/services` - Get all active services
- `GET /api/services/:slug` - Get single service
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/contacts` - Get all contacts
- `PATCH /api/admin/contacts/:id` - Update contact status
- `GET /api/admin/job-applications` - Get all job applications
- `PATCH /api/admin/job-applications/:id` - Update application status
- `GET /api/admin/users` - Get all users

## Default Admin User

After setting up the database, create an admin user:

```sql
-- Hash password using bcrypt (password: admin123)
-- Use online bcrypt generator or Node.js:
-- const bcrypt = require('bcryptjs');
-- console.log(bcrypt.hashSync('admin123', 10));

INSERT INTO users (email, password_hash, full_name, role) 
VALUES (
  'admin@softionyx.com',
  '$2a$10$YourHashedPasswordHere',
  'Admin User',
  'admin'
);
```

## Security Features

- ✅ JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on all endpoints
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation with Zod
- ✅ File upload restrictions
- ✅ SQL injection protection (parameterized queries)

## Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Errors only

Log levels: `error`, `warn`, `info`, `debug`

## Email Configuration

The application uses Nodemailer for sending emails. Configure SMTP settings in `.env`.

For Gmail:
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password in `SMTP_PASS`

## File Uploads

- **Resumes**: PDF, DOC, DOCX (max 5MB)
- **Images**: JPG, PNG, WEBP (max 10MB)

Files are stored in `uploads/` directory and served at `/uploads/`.

## SEO

- Meta tags via React Helmet
- Sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- Canonical URLs
- Open Graph tags
- Twitter Card tags

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

### Email Not Sending
- Verify SMTP credentials
- Check firewall/network settings
- For Gmail, ensure App Password is used

### File Upload Fails
- Check `uploads/` directory permissions
- Verify file size limits
- Check file type restrictions

## License

MIT## SupportFor issues and questions, contact: contact@softionyx.com
