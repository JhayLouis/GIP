# Backend API Integration Guide

This document provides detailed information on how to integrate your backend database with the GIP/TUPAD Applicant Management System.

## System Overview

The frontend application has been configured to work with any backend system via REST API calls. The system is no longer dependent on Supabase and is ready to connect to your company's database infrastructure.

## Environment Configuration

### Frontend Environment Variables

Set these variables in your `.env` file:

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

For production:
```env
VITE_BACKEND_URL=https://your-domain.com/api
```

## API Endpoints Required

Your backend must implement the following REST API endpoints:

### 1. Authentication Endpoints

#### POST `/auth/login`
Login endpoint for user authentication.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "role": "admin" | "user",
    "name": "string"
  },
  "token": "string (JWT or similar)"
}
```

**Response (Error - 401/400):**
```json
{
  "success": false,
  "error": "string",
  "message": "string"
}
```

**Token Format:**
- Must be a JWT or Base64-encoded token
- Must include `exp` (expiration time in seconds since epoch)
- Must be valid for at least 24 hours

### 2. Applicant Management Endpoints

#### GET `/applicants`
Retrieve applicants with optional filters.

**Query Parameters:**
- `program` (required): "GIP" | "TUPAD"
- `status` (optional): "PENDING" | "APPROVED" | "DEPLOYED" | "COMPLETED" | "REJECTED" | "RESIGNED"
- `barangay` (optional): string

**Response (200):**
```json
{
  "data": [
    {
      "id": "string",
      "code": "string",
      "firstName": "string",
      "middleName": "string",
      "lastName": "string",
      "extensionName": "string",
      "birthDate": "string (YYYY-MM-DD)",
      "age": "number",
      "residentialAddress": "string",
      "barangay": "string",
      "contactNumber": "string",
      "telephoneNumber": "string",
      "email": "string",
      "placeOfBirth": "string",
      "gender": "MALE" | "FEMALE",
      "civilStatus": "string",
      "status": "PENDING" | "APPROVED" | "DEPLOYED" | "COMPLETED" | "REJECTED" | "RESIGNED",
      "program": "GIP" | "TUPAD",
      "photoFileName": "string",
      "resumeFileName": "string",
      "archived": "boolean",
      "interviewed": "boolean",
      "created_at": "string (ISO timestamp)",
      "updated_at": "string (ISO timestamp)"
    }
  ]
}
```

#### POST `/applicants`
Create a new applicant.

**Request Body:**
Same as applicant object (excluding id, created_at, updated_at)

**Response (201):**
```json
{
  "data": {
    "id": "string",
    "...": "applicant fields"
  }
}
```

#### PUT `/applicants/:id`
Update an existing applicant.

**URL Parameters:**
- `id`: string (applicant ID)

**Request Body:**
Partial applicant object with fields to update

**Response (200):**
```json
{
  "data": {
    "...": "updated applicant"
  }
}
```

#### DELETE `/applicants/:id`
Delete an applicant.

**URL Parameters:**
- `id`: string (applicant ID)

**Response (200):**
```json
{
  "success": true,
  "message": "Applicant deleted"
}
```

#### PATCH `/applicants/:id/archive`
Archive an applicant (soft delete).

**URL Parameters:**
- `id`: string (applicant ID)

**Response (200):**
```json
{
  "success": true,
  "message": "Applicant archived"
}
```

### 3. File Management Endpoints

#### POST `/files/upload`
Upload a file (photo, resume, etc.).

**Request (multipart/form-data):**
- `file`: File (binary)
- `bucket`: string (e.g., "applicants", "resumes")
- `path`: string (file path)

**Response (200):**
```json
{
  "url": "string (public URL to access the file)",
  "data": {
    "url": "string"
  }
}
```

#### GET `/files/download`
Download a file.

**Query Parameters:**
- `bucket`: string
- `path`: string

**Response (200):**
- Binary file data

### 4. Email Endpoints

#### POST `/emails/send-applicant`
Send email notification to applicant.

**Request Body:**
```json
{
  "to": "string (email address)",
  "name": "string",
  "status": "APPROVED" | "REJECTED",
  "program": "GIP" | "TUPAD",
  "applicantCode": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "string",
  "message": "string"
}
```

## Authentication

All requests (except login) should include the Authorization header:

```
Authorization: Bearer {token}
```

Where `{token}` is the JWT or token received from the login endpoint.

## Error Handling

All endpoints should follow this error response format:

```json
{
  "error": "string (error code or message)",
  "message": "string (human-readable description)",
  "status": "number (HTTP status code)"
}
```

HTTP Status Codes:
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## CORS Configuration

Your backend must allow CORS requests from the frontend domain:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Database Schema Requirements

Your database should have a table/collection with at least these fields:

```
applicants:
- id (primary key, UUID or string)
- code (unique, string)
- firstName (string)
- middleName (string, nullable)
- lastName (string)
- extensionName (string, nullable)
- birthDate (date)
- age (integer)
- residentialAddress (string)
- barangay (string)
- contactNumber (string)
- telephoneNumber (string, nullable)
- email (string)
- placeOfBirth (string, nullable)
- gender (MALE | FEMALE)
- civilStatus (string)
- status (PENDING | APPROVED | DEPLOYED | COMPLETED | REJECTED | RESIGNED)
- program (GIP | TUPAD)
- photoFileName (string, nullable)
- resumeFileName (string, nullable)
- encoder (string)
- archived (boolean, default false)
- archivedDate (date, nullable)
- interviewed (boolean, default false)
- created_at (timestamp)
- updated_at (timestamp)
- [Educational fields...]
- [Employment fields...]
```

## Implementation Example

Here's a basic example of how the frontend makes API calls:

```typescript
// From backendService.ts
export const backendService = {
  async getApplicants(program: 'GIP' | 'TUPAD'): Promise<DatabaseApplicant[]> {
    const response = await fetch(
      `${BACKEND_URL}/applicants?program=${program}`,
      {
        method: 'GET',
        headers: buildHeaders(),
      }
    );
    const data = await response.json();
    return data.data || [];
  }
};
```

## Testing the Integration

To test your backend integration:

1. Start your backend server on `http://localhost:3000`
2. Update `.env` with your backend URL
3. Run the frontend: `npm run dev`
4. Open the application and try to login
5. Navigate through applicant management features

## Common Issues

### CORS Errors
Ensure your backend allows CORS for the frontend domain.

### Token Expiration
Make sure tokens have an `exp` field in the correct format (seconds since epoch for JWT).

### Response Format
The frontend expects `data` or direct object/array in responses. Adjust the response parsing if needed.

### File Upload
Ensure the upload endpoint returns a public URL that can be accessed from the frontend.

## Migration from Supabase

If migrating from Supabase:

1. Export your applicant data from Supabase
2. Import into your database
3. Implement the required API endpoints
4. Update `.env` with your backend URL
5. Test thoroughly before deploying

## Support

For integration assistance, ensure your backend API:
- Returns consistent response formats
- Implements proper error handling
- Supports JWT token authentication
- Handles file uploads and storage
- Provides all required endpoints listed above
