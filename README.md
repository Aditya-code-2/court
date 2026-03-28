# AI-Powered Legal Case Management Platform (MERN + ML)

This repository contains a full-stack legal case management platform with role-based access control, AI-assisted case analysis, and workflow collaboration.

## Architecture

- **Frontend (React + Vite):** role-aware dashboards, case creation, search, and urgent queue view.
- **Backend (Node.js + Express + MongoDB):** authentication, RBAC, case/task APIs, dashboard analytics.
- **ML Service (FastAPI + Python):** case categorization, priority scoring, summarization, and urgent recommendations.

## Supported Roles

- Judge
- Court Clerk
- Police Clerk
- Advocate (Lawyer)

## Core Features Implemented

1. **Secure Role-Based Authentication**
   - JWT authentication.
   - Role enforcement middleware for sensitive endpoints.

2. **AI Case Categorization & Prioritization**
   - `/analyze` endpoint scores urgency and complexity.
   - Priority classification into High/Medium/Low.

3. **Intelligent Case Summarization**
   - Automatic summary generation for long case descriptions.

4. **Smart Recommendation System**
   - `/recommend` endpoint ranks cases by severity + pending time.

5. **Comprehensive Dashboards**
   - Metrics by role: total/open/high-priority cases and pending tasks.
   - Status distribution analytics.

6. **Collaboration & Workflow**
   - Task assignment per case.
   - Status updates and timeline entries.

7. **Search & Filter**
   - Query by keyword, priority, type, status, and date range.

8. **Scalability & Security Basics**
   - Helmet, CORS, structured validation, environment-based config.

## Getting Started

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2) ML Service

```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### backend/.env.example

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/court-ai
JWT_SECRET=super-secret-change-me
JWT_EXPIRES_IN=8h
ML_SERVICE_URL=http://127.0.0.1:8001
```

### frontend/.env.example

```env
VITE_API_URL=http://localhost:5000/api
```

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/dashboard/overview`
- `POST /api/cases`
- `GET /api/cases` (supports filters)
- `PATCH /api/cases/:id/status`
- `GET /api/cases/recommend/urgent`
- `POST /api/tasks`
- `GET /api/tasks/mine`

## Notes

- The ML logic currently uses lightweight NLP heuristics for easy local setup.
- You can swap in advanced transformer models by replacing `ml-service/app.py` internals.
