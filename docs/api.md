# API Documentation

## Overview

This document provides detailed information about the REST API endpoints available in the AI Career Coach application. All endpoints follow REST conventions and return JSON responses.

## Authentication

Most API endpoints require authentication using Clerk. Authenticated requests must include a valid session token in the Authorization header.

## Base URL

All API endpoints are prefixed with `/api`. For example: `GET /api/user`

## User Management

### Get Current User
```
GET /api/user
```

Returns the current authenticated user's profile information.

**Response:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "imageUrl": "https://example.com/avatar.jpg"
}
```

### Update User Profile
```
PUT /api/user
```

Updates the current user's profile information.

**Request Body:**
```json
{
  "name": "John Doe",
  "bio": "Software engineer with 5 years of experience",
  "industry": "tech-software-development",
  "experience": 5,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

**Response:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "bio": "Software engineer with 5 years of experience",
  "industry": "tech-software-development",
  "experience": 5,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

## Resume

### Get User's Resume
```
GET /api/resume
```

Returns the current user's resume content.

**Response:**
```json
{
  "id": "resume_123",
  "content": "# John Doe\n\n## Experience\n\n...",
  "atsScore": 85.5,
  "feedback": "Great resume! Consider adding more quantifiable achievements."
}
```

### Save Resume Content
```
POST /api/resume
```

Saves the user's resume content.

**Request Body:**
```json
{
  "content": "# John Doe\n\n## Experience\n\n..."
}
```

**Response:**
```json
{
  "id": "resume_123",
  "content": "# John Doe\n\n## Experience\n\n...",
  "atsScore": null,
  "feedback": null
}
```

### Improve Resume with AI
```
POST /api/resume/improve
```

Uses AI to improve the user's resume content.

**Request Body:**
```json
{
  "content": "# John Doe\n\n## Experience\n\n..."
}
```

**Response:**
```json
{
  "improvedContent": "# John Doe\n\n## Professional Summary\n\n...",
  "atsScore": 92.0,
  "feedback": "Excellent improvements! The revised version highlights your achievements more effectively."
}
```

## Cover Letter

### List User's Cover Letters
```
GET /api/cover-letter
```

Returns a list of the current user's cover letters.

**Response:**
```json
[
  {
    "id": "cl_123",
    "jobTitle": "Senior Software Engineer",
    "companyName": "Tech Corp",
    "status": "completed",
    "createdAt": "2023-06-01T12:00:00Z"
  }
]
```

### Generate New Cover Letter
```
POST /api/cover-letter
```

Generates a new cover letter using AI.

**Request Body:**
```json
{
  "jobTitle": "Senior Software Engineer",
  "companyName": "Tech Corp",
  "jobDescription": "We're looking for an experienced software engineer..."
}
```

**Response:**
```json
{
  "id": "cl_123",
  "content": "Dear Hiring Manager,\n\nI am excited to apply for...",
  "jobTitle": "Senior Software Engineer",
  "companyName": "Tech Corp",
  "status": "completed"
}
```

### Get Specific Cover Letter
```
GET /api/cover-letter/[id]
```

Returns a specific cover letter by ID.

**Response:**
```json
{
  "id": "cl_123",
  "content": "Dear Hiring Manager,\n\nI am excited to apply for...",
  "jobTitle": "Senior Software Engineer",
  "companyName": "Tech Corp",
  "status": "completed",
  "createdAt": "2023-06-01T12:00:00Z"
}
```

### Delete Specific Cover Letter
```
DELETE /api/cover-letter/[id]
```

Deletes a specific cover letter by ID.

**Response:**
```json
{
  "message": "Cover letter deleted successfully"
}
```

## Interview Preparation

### List Interview Assessments
```
GET /api/interview
```

Returns a list of the current user's interview assessments.

**Response:**
```json
[
  {
    "id": "int_123",
    "category": "Technical",
    "quizScore": 85.0,
    "createdAt": "2023-06-01T12:00:00Z"
  }
]
```

### Generate New Interview Assessment
```
POST /api/interview
```

Generates a new interview assessment with AI-generated questions.

**Request Body:**
```json
{
  "category": "Technical",
  "jobTitle": "Software Engineer"
}
```

**Response:**
```json
{
  "id": "int_123",
  "category": "Technical",
  "jobTitle": "Software Engineer",
  "questions": [
    {
      "id": 1,
      "question": "Explain the concept of closures in JavaScript.",
      "type": "text"
    }
  ]
}
```

### Get Specific Assessment
```
GET /api/interview/[id]
```

Returns a specific interview assessment by ID.

**Response:**
```json
{
  "id": "int_123",
  "category": "Technical",
  "jobTitle": "Software Engineer",
  "questions": [
    {
      "id": 1,
      "question": "Explain the concept of closures in JavaScript.",
      "type": "text"
    }
  ],
  "quizScore": null,
  "improvementTip": null,
  "createdAt": "2023-06-01T12:00:00Z"
}
```

### Submit Answers to Assessment
```
POST /api/interview/[id]/submit
```

Submits answers to an interview assessment and calculates the score.

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": 1,
      "answer": "A closure is a combination of a function and its lexical environment..."
    }
  ]
}
```

**Response:**
```json
{
  "id": "int_123",
  "quizScore": 90.0,
  "improvementTip": "Great explanation! Consider mentioning practical use cases for closures."
}
```

### Delete Specific Assessment
```
DELETE /api/interview/[id]
```

Deletes a specific interview assessment by ID.

**Response:**
```json
{
  "message": "Interview assessment deleted successfully"
}
```

## Career Roadmap

### Generate New Career Roadmap
```
POST /api/roadmap
```

Generates a new career roadmap using AI.

**Request Body:**
```json
{
  "careerField": "Software Engineering",
  "experienceLevel": "beginner",
  "timeFrame": "standard",
  "additionalInfo": "Interested in web development"
}
```

**Response:**
```json
{
  "id": "rm_123",
  "title": "Career Roadmap for Software Engineering",
  "description": "A step-by-step guide to build your career in Software Engineering",
  "steps": [
    {
      "id": 1,
      "title": "Foundation Skills",
      "description": "Master the fundamental skills required for this field",
      "duration": "2-3 months"
    }
  ],
  "progress": {}
}
```

### Get Specific Roadmap
```
GET /api/roadmap/[id]
```

Returns a specific career roadmap by ID.

**Response:**
```json
{
  "id": "rm_123",
  "userId": "user_123",
  "title": "Career Roadmap for Software Engineering",
  "description": "A step-by-step guide to build your career in Software Engineering",
  "steps": [
    {
      "id": 1,
      "title": "Foundation Skills",
      "description": "Master the fundamental skills required for this field",
      "duration": "2-3 months"
    }
  ],
  "progress": {
    "1": true,
    "2": false
  },
  "createdAt": "2023-06-01T12:00:00Z",
  "updatedAt": "2023-06-01T12:00:00Z"
}
```

### Update Roadmap Progress
```
PUT /api/roadmap/[id]/progress
```

Updates the progress tracking for a specific roadmap.

**Request Body:**
```json
{
  "progress": {
    "1": true,
    "2": false
  }
}
```

**Response:**
```json
{
  "id": "rm_123",
  "progress": {
    "1": true,
    "2": false
  }
}
```

### Delete Specific Roadmap
```
DELETE /api/roadmap/[id]
```

Deletes a specific career roadmap by ID.

**Response:**
```json
{
  "message": "Career roadmap deleted successfully"
}
```

## Error Handling

All API endpoints follow consistent error response formats:

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per hour per IP address for most endpoints
- 10 requests per hour for AI generation endpoints

## Versioning

The API is currently at version 1. Breaking changes will be introduced in new versions, with the version number included in the URL path (e.g., `/api/v2/endpoint`).