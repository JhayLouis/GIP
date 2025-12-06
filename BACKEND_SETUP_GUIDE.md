# Backend Setup Guide

This guide helps you set up the backend server for the GIP/TUPAD Applicant Management System.

## Overview

The frontend application is now **backend-agnostic** and can connect to any database system through REST API endpoints. The system no longer has Supabase dependencies.

## What Was Changed

### Removed from Frontend
- ✅ Supabase client (`@supabase/supabase-js` package)
- ✅ Supabase authentication configuration
- ✅ Supabase database queries
- ✅ Supabase edge functions
- ✅ Supabase environment variables

### Added to Frontend
- ✅ Generic backend service layer (`backendService.ts`)
- ✅ REST API integration using native Fetch API
- ✅ Backend-agnostic authentication system
- ✅ File upload/download abstraction
- ✅ Email service integration
- ✅ Comprehensive API documentation

## Backend Requirements

Your backend must provide REST API endpoints. It can be built with any technology:
- Node.js / Express
- Python / Django / FastAPI
- Java / Spring
- .NET / ASP.NET
- Go / Gin
- Ruby on Rails
- PHP / Laravel
- Or any other backend framework

## Quick Start

### 1. Configure Frontend Environment

Update `.env` file with your backend URL:

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

For production, use your company's domain:
```env
VITE_BACKEND_URL=https://api.yourcompany.com/api
```

### 2. Implement Backend Endpoints

Refer to `BACKEND_API_INTEGRATION.md` for complete endpoint specifications.

**Minimum required endpoints:**
1. `POST /auth/login` - Authentication
2. `GET /applicants` - List applicants
3. `POST /applicants` - Create applicant
4. `PUT /applicants/:id` - Update applicant
5. `DELETE /applicants/:id` - Delete applicant
6. `PATCH /applicants/:id/archive` - Archive applicant
7. `POST /files/upload` - Upload files
8. `GET /files/download` - Download files
9. `POST /emails/send-applicant` - Send email

### 3. Database Schema

Create a database table for applicants with these fields:

```sql
-- PostgreSQL Example
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  middleName VARCHAR(255),
  lastName VARCHAR(255) NOT NULL,
  extensionName VARCHAR(50),
  birthDate DATE NOT NULL,
  age INTEGER NOT NULL,
  residentialAddress TEXT,
  barangay VARCHAR(100) NOT NULL,
  contactNumber VARCHAR(20) NOT NULL,
  telephoneNumber VARCHAR(20),
  email VARCHAR(255),
  placeOfBirth VARCHAR(255),
  gender VARCHAR(10) NOT NULL,
  civilStatus VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  program VARCHAR(10) NOT NULL,
  photoFileName VARCHAR(255),
  resumeFileName VARCHAR(255),
  encoder VARCHAR(255) NOT NULL,
  archived BOOLEAN DEFAULT false,
  archivedDate DATE,
  interviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Authentication Implementation

Your backend's login endpoint should:

1. Accept username and password
2. Validate against your user database
3. Generate a JWT or similar token with:
   - User information (id, username, role, name)
   - Expiration time (exp in seconds)
4. Return token and user data

**Example login response:**
```json
{
  "success": true,
  "user": {
    "id": "123",
    "username": "john",
    "role": "admin",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. CORS Configuration

Enable CORS on your backend to accept requests from the frontend:

**Express.js Example:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourcompany.com'],
  credentials: true
}));
```

**Python Flask Example:**
```python
from flask_cors import CORS
CORS(app, origins=['http://localhost:5173', 'https://yourcompany.com'])
```

## Architecture

### Frontend Flow

```
React Component
    ↓
Auth/Data Hooks
    ↓
Business Logic
    ↓
backendService (abstraction layer)
    ↓
Fetch API (REST calls)
    ↓
Your Backend API
    ↓
Your Database
```

### File Structure

- `src/utils/auth.ts` - Authentication logic
- `src/utils/backendService.ts` - Database API calls
- `src/utils/emailService.ts` - Email API calls
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/hooks/useData.ts` - Data fetching hooks

## Example Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key';

// Mock users - replace with database query
const users = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' }
];

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    user: { id: user.id, username: user.username, role: user.role, name: user.name },
    token
  });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get applicants
app.get('/api/applicants', verifyToken, (req, res) => {
  const { program } = req.query;
  // Replace with actual database query
  res.json({ data: [] });
});

// Create applicant
app.post('/api/applicants', verifyToken, (req, res) => {
  const applicant = req.body;
  // Insert into database
  res.status(201).json({ data: { id: '1', ...applicant } });
});

// Add other endpoints...

app.listen(3000, () => console.log('Server running on port 3000'));
```

## Testing

1. Start your backend server:
   ```bash
   npm start  # or your backend's start command
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:5173` in your browser

4. Login with your backend credentials

## Deployment

### Frontend (Vite)

```bash
npm run build
# Deploy dist/ folder to your web server
```

### Backend

Deploy your backend to your company's infrastructure:
- Update `VITE_BACKEND_URL` to production backend URL
- Ensure CORS allows your production domain
- Set up SSL certificates
- Configure database connection strings

## Troubleshooting

### "Failed to fetch applicants"
- Check if backend server is running
- Verify `VITE_BACKEND_URL` is correct
- Check CORS configuration
- Verify authentication token is valid

### CORS errors
- Ensure backend allows requests from frontend domain
- Check `Access-Control-Allow-Origin` header

### Login fails
- Verify credentials are correct
- Check backend login endpoint is working
- Verify token format matches JWT standard

### File upload fails
- Check multipart/form-data handling
- Verify file storage configuration
- Ensure file size limits are appropriate

## Security Considerations

1. **Always use HTTPS** in production
2. **Validate all inputs** on the backend
3. **Never expose secrets** in frontend code
4. **Use strong JWT secrets** (long, random strings)
5. **Implement rate limiting** on authentication endpoints
6. **Use CORS carefully** - don't allow all origins in production
7. **Sanitize file uploads** to prevent security issues
8. **Implement proper access control** based on user roles

## Next Steps

1. Implement the required API endpoints in your backend
2. Set up your database schema
3. Configure CORS for your domain
4. Test the integration thoroughly
5. Deploy to production

For more details on specific endpoints, see `BACKEND_API_INTEGRATION.md`.
