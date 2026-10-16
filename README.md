# Enterprise AI Platform — Frontend

> Modern React + TypeScript frontend for the Enterprise AI / Retrieval-Augmented Generation (RAG) platform.

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-purple)](https://vite.dev/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)](https://vercel.com/)

**Backend API:** [Enterprise AI Backend](https://github.com/calvinoke/Backend-Enterprise-ai-app)

**Live Application:** https://enterprise-ai-frontend-nine.vercel.app

---

## Overview

The Enterprise AI Platform frontend is a production-oriented React and TypeScript application that provides the user interface for an enterprise knowledge and AI platform.

The application communicates with a separate FastAPI backend through a versioned REST API.

The frontend provides the foundation for:

- User registration
- User authentication
- JWT-based session management
- Current-user profile retrieval
- User profile management
- Administrator user management
- Password management
- Email verification
- AI conversations
- Enterprise knowledge workflows
- Document-related functionality
- RAG-powered AI interactions

The frontend is designed to remain independent from the backend implementation while consuming its documented REST API.

---

# Architecture

The overall platform is split into two independent applications:

```text
┌──────────────────────────────────────────┐
│              User Browser                │
└────────────────────┬─────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌──────────────────────────────────────────┐
│                  Vercel                  │
│                                          │
│       React + TypeScript Frontend        │
│                                          │
│  UI / Pages / Components / Auth State    │
└────────────────────┬─────────────────────┘
                     │
                     │ REST API
                     ▼
┌──────────────────────────────────────────┐
│                 Render                   │
│                                          │
│              FastAPI Backend             │
└────────────────────┬─────────────────────┘
                     │
                     ▼
              PostgreSQL + pgvector
```

---

# Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Static typing |
| Vite | Development and build tooling |
| Axios | REST API communication |
| React Context | Application/authentication state |
| Vercel | Production deployment |

---

# Repository

GitHub:

https://github.com/calvinoke/enterprise-ai-frontend

Backend repository:

https://github.com/calvinoke/Backend-Enterprise-ai-app

---

# Production Environment

The frontend is deployed on Vercel.

Production URL:

https://enterprise-ai-frontend-nine.vercel.app

The frontend communicates with the production backend:

```text
https://backend-enterprise-ai-app.onrender.com/api/v1
```

Backend API documentation:

https://backend-enterprise-ai-app.onrender.com/docs

---

# Project Structure

The frontend follows a modular React/TypeScript structure.

```text
enterprise-ai-frontend/
│
├── public/
│
├── src/
│   │
│   ├── api/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   └── ...
│   │
│   ├── components/
│   │   └── ...
│   │
│   ├── contexts/
│   │   └── ...
│   │
│   ├── pages/
│   │   └── ...
│   │
│   ├── services/
│   │   └── ...
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   └── ...
│   │
│   └── ...
│
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── README.md
```

The structure is intentionally modular so additional enterprise AI functionality can be introduced without turning the frontend into a single monolithic application.

---

# Authentication

Authentication is handled through the backend API.

The frontend communicates with endpoints such as:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout

POST /api/v1/auth/password/forgot
POST /api/v1/auth/password/reset
POST /api/v1/auth/password/change

POST /api/v1/auth/email/verify
POST /api/v1/auth/email/resend-verification
```

---

# Authentication Flow

The login flow is approximately:

```text
User
 │
 │ Email + Password
 ▼
Login Page
 │
 ▼
POST /auth/login
 │
 ▼
FastAPI Backend
 │
 ├── Validate credentials
 │
 └── Generate tokens
 │
 ▼
Access Token + Refresh Token
 │
 ▼
Frontend Authentication State
 │
 ▼
GET /users/me
 │
 ▼
Current User
 │
 ▼
Authenticated Application
```

The frontend should never treat client-side authentication state as the final security boundary.

Authorization is enforced by the backend.

---

# Current User

The frontend uses:

```text
GET /api/v1/users/me
```

to retrieve the authenticated user's profile.

The corresponding frontend API call is conceptually:

```typescript
const response = await apiClient.get<CurrentUser>(
  "/users/me",
);
```

This allows the application to restore the authenticated user's state after login or page reload.

---

# User Management

The frontend provides API integration for user management.

Supported operations include:

```text
GET    /users/me
PATCH  /users/me

GET    /users
POST   /users

GET    /users/{user_id}
PATCH  /users/{user_id}

PATCH  /users/{user_id}/role
PATCH  /users/{user_id}/activate
PATCH  /users/{user_id}/deactivate

DELETE /users/{user_id}
```

Administrator-only operations are protected by backend authorization.

---

# User Roles

The current frontend role model is:

```typescript
type UserRole = "user" | "admin";
```

The UI can use the current user's role to control navigation and presentation.

However, frontend role checks are for user experience only.

The backend remains responsible for enforcing authorization.

---

# API Client

The frontend uses a centralized Axios client.

This provides a single place to manage:

- API base URL
- Authorization headers
- Request configuration
- Response handling
- Token refresh behavior
- Error handling

A typical production configuration is:

```text
VITE_API_BASE_URL=https://backend-enterprise-ai-app.onrender.com/api/v1
```

---

# Environment Variables

Create a local `.env` file when running the application locally.

Example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

For production:

```env
VITE_API_BASE_URL=https://backend-enterprise-ai-app.onrender.com/api/v1
```

## Important

Never place secrets in frontend environment variables.

Anything exposed through a `VITE_` variable can potentially be included in the browser application.

Do not put any of the following in the frontend:

```text
Database passwords
JWT signing secrets
Gemini API keys
Groq API keys
Resend API keys
Private cloud credentials
Backend service secrets
```

---

# Local Development

## Requirements

Install:

- Node.js
- npm
- Git

---

## Clone the repository

```bash
git clone https://github.com/calvinoke/enterprise-ai-frontend.git
cd enterprise-ai-frontend
```

---

## Install dependencies

```bash
npm install
```

---

## Configure the backend URL

Create:

```text
.env
```

Example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Make sure the backend is running locally.

---

## Start development server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

---

# Production Build

Build the frontend:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Before deploying, ensure the production API URL is configured correctly.

---

# Deployment

The frontend is deployed using Vercel.

Production:

```text
https://enterprise-ai-frontend-nine.vercel.app
```

A typical Vercel deployment process is:

```text
GitHub
   │
   ▼
Vercel
   │
   ├── Install dependencies
   ├── Build React application
   └── Deploy static assets
```

The frontend then communicates with the backend over HTTPS.

---

# Backend Dependency

The frontend requires the Enterprise AI backend.

Backend repository:

https://github.com/calvinoke/Backend-Enterprise-ai-app

Production backend:

```text
https://backend-enterprise-ai-app.onrender.com
```

Swagger/OpenAPI:

```text
https://backend-enterprise-ai-app.onrender.com/docs
```

The frontend should not implement backend business logic that belongs in the API.

---

# AI / RAG User Experience

The frontend is the presentation layer for the platform's AI and RAG capabilities.

The intended interaction is:

```text
User
 │
 │ Ask question
 ▼
Frontend
 │
 │ API request
 ▼
Backend
 │
 ├── Query processing
 ├── Embedding generation
 ├── Vector retrieval
 ├── Context construction
 └── LLM generation
 │
 ▼
AI response
 │
 ▼
Frontend
 │
 ▼
User
```

The backend is responsible for retrieval, context construction, model interaction, and security.

---

# Enterprise Knowledge Experience

The frontend is designed to evolve into a complete enterprise knowledge interface.

Potential user workflows include:

- Uploading documents
- Browsing knowledge sources
- Asking questions about organizational information
- Viewing AI conversations
- Reviewing retrieved sources
- Managing user profiles
- Managing users as an administrator
- Managing enterprise AI workflows

---

# Security Considerations

The frontend follows several important security principles.

## Never store backend secrets

The frontend should never contain:

```text
DATABASE_URL
JWT_SECRET_KEY
GEMINI_API_KEY
GROQ_API_KEY
RESEND_API_KEY
```

## HTTPS

Production communication should use HTTPS.

## Backend Authorization

UI restrictions do not replace backend authorization.

For example:

```text
Frontend:
"Hide admin button"

Backend:
"Reject non-admin request"
```

The backend check is the security boundary.

---

# Development Workflow

Recommended workflow:

```text
1. Start backend
2. Start frontend
3. Test authentication
4. Test current-user retrieval
5. Test protected routes
6. Test feature API integration
7. Run production build
8. Deploy
```

For changes:

```bash
git checkout -b feature/my-feature

npm install

npm run build

git add .
git commit -m "feat: describe change"

git push origin feature/my-feature
```

---

# Current Platform Capabilities

The frontend foundation supports integration with:

- Authentication
- User registration
- Login
- Logout
- Refresh tokens
- Current user
- Profile updates
- Password management
- Email verification
- Administrator user management
- AI/RAG workflows
- Conversations
- Document workflows

The platform is actively evolving.

---

# Roadmap

Planned frontend improvements include:

- [ ] Complete AI chat interface
- [ ] Streaming AI responses
- [ ] Source/citation display
- [ ] Document management UI
- [ ] Document upload progress
- [ ] Knowledge-base management
- [ ] Conversation history
- [ ] Conversation search
- [ ] Advanced admin dashboard
- [ ] Organization management
- [ ] Multi-tenant UI
- [ ] Fine-grained permissions UI
- [ ] Usage analytics
- [ ] Audit log interface
- [ ] Improved accessibility
- [ ] Comprehensive automated frontend testing
- [ ] End-to-end testing

---

# Related Project

## Backend

[Enterprise AI Backend](https://github.com/calvinoke/Backend-Enterprise-ai-app)

The backend provides:

- FastAPI REST API
- PostgreSQL
- pgvector
- Authentication
- Authorization
- Documents
- Embeddings
- RAG
- LLM services
- Conversations
- Email services

---

# License

This project is currently under active development.

A formal license should be added before distributing the project as an open-source product.

---

# Vision

The frontend is intended to become the primary interface for a secure enterprise AI environment where users can interact with organizational knowledge using natural language.

The long-term vision is:

```text
                 ENTERPRISE AI
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
      Knowledge      AI        Enterprise
       Search       Chat       Management
          │           │           │
          ▼           ▼           ▼
      Documents     RAG       Users/Roles
      Sources       LLM       Permissions
      Metadata      Agents    Governance
```

The application is designed to provide a clean, scalable frontend foundation for that platform.
