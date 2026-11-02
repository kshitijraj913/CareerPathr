# CareerPathr

A goal-oriented career planning platform for students. Set career goals, break them into milestones and tasks, track progress, and stay organized.

## Features

- **Goal Planning** — Create and manage career goals with categories, priorities, and deadlines
- **Milestones** — Break goals into smaller, trackable milestones
- **Task Management** — Create, filter, and complete tasks linked to goals
- **Calendar** — Visualize tasks and deadlines on a monthly calendar
- **Progress Analytics** — Charts showing goal completion, task stats, and category breakdown
- **Profile** — Manage your academic and career information
- **Reminders** — In-app reminders for upcoming deadlines
- **Responsive UI** — Works on desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |

## Architecture

```
ppl/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Sidebar, Layout
│       ├── pages/        # Dashboard, Goals, Tasks, Calendar, Analytics, Profile, Settings, Landing
│       ├── context/      # AuthContext
│       ├── services/     # API service
│       └── types/        # TypeScript types
├── server/          # Express backend
│   └── src/
│       ├── config/       # Database connection
│       ├── controllers/  # Route handlers
│       ├── middleware/    # JWT auth
│       ├── models/       # Mongoose schemas
│       ├── routes/       # Express routes
│       ├── seeds/        # Demo data seeder
│       └── utils/        # Token generation
├── .env.example
├── .gitignore
└── README.md
```

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

### Setup

1. **Clone and install:**
   ```bash
   cd ppl
   cd server && npm install
   cd ../client && npm install
   ```

2. **Configure environment:**
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` with your MongoDB URI and JWT secret.

3. **Seed demo data (optional):**
   ```bash
   cd server && npm run seed
   ```

4. **Start the backend:**
   ```bash
   cd server && npm run dev
   ```

5. **Start the frontend:**
   ```bash
   cd client && npm run dev
   ```

6. Open `http://localhost:3000`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/careerpathr` |
| `JWT_SECRET` | Secret for JWT signing | — |
| `PORT` | Backend server port | `5000` |

## Demo Credentials

| Field | Value |
|-------|-------|
| Email | `demo@careerpathr.com` |
| Password | `Demo@123` |

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET/POST | `/api/goals` | List / Create goals |
| GET/PUT/DELETE | `/api/goals/:id` | Get / Update / Delete goal |
| GET/POST | `/api/goals/:goalId/milestones` | List / Create milestones |
| PUT/DELETE | `/api/goals/milestones/:id` | Update / Delete milestone |
| GET/POST | `/api/tasks` | List / Create tasks |
| GET/PUT/DELETE | `/api/tasks/:id` | Get / Update / Delete task |
| GET/PUT | `/api/profile` | Get / Update profile |
| GET | `/api/profile/analytics` | Get analytics data |
| GET | `/api/reminders` | Get reminders |
| POST | `/api/reminders/generate` | Generate reminders |

All endpoints except auth require a Bearer token in the Authorization header.

## Future Improvements

- Export goals and progress as PDF
- Team collaboration and shared goals
- AI-powered goal suggestions
- Email/push notifications
- Dark mode
- Mobile app (React Native)
