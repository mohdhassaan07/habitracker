# 🧠 Habitron — AI-Powered Habit Tracker

A full-stack habit tracking application that helps users build and maintain positive habits with AI-powered insights, mood journaling, streak tracking, and real-time analytics.

**🔗 Live Demo:** [habitron-seven.vercel.app](https://habitron-seven.vercel.app)

---

## ✨ Features

- **Habit Management** — Create, edit, and delete habits with configurable frequency (daily / weekly / monthly), unit type (minutes / times), and time-of-day labels
- **Streak Tracking** — Automatic streak calculation with daily reset via cron jobs
- **Mood Journal** — Log daily moods (happy → terrible) with descriptive notes and unique-per-day enforcement
- **AI Assistant** — Real-time chatbot powered by **Gemini 2.5 Flash** that provides personalised motivation and insights based on your habit data (via Socket.IO)
- **Activity Heatmap** — GitHub-style contribution heatmap to visualise habit consistency
- **Analytics Dashboard** — Charts and stats powered by MUI X Charts
- **Focus Timer** — Built-in timer for time-based habits
- **Google OAuth** — Sign in with Google alongside traditional email/password auth
- **Profile & Settings** — Upload profile pictures via Cloudinary, manage account settings
- **Stripe Payments** — Subscription plans with webhook-based payment processing
- **Real-time Updates** — Socket.IO for instant AI chat responses and live typing indicators
- **Responsive Design** — Tailwind CSS + Flowbite + Framer Motion for a polished, animated UI

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling |
| Flowbite React | Pre-built UI components |
| Framer Motion | Animations |
| Redux Toolkit + Persist | Global state management |
| React Router v7 | Client-side routing |
| Axios | HTTP requests |
| Socket.IO Client | Real-time AI chat |
| MUI X Charts | Data visualisation |
| React Heat Map | Activity heatmap |
| Lucide & React Icons | Iconography |
| Google OAuth | Social login |

### Backend

| Technology | Purpose |
|---|---|
| Express 5 | HTTP server |
| TypeScript | Type safety |
| Prisma ORM | Database access & migrations |
| PostgreSQL (Neon) | Relational database |
| Socket.IO | Real-time WebSocket server |
| Google Generative AI | Gemini-powered AI assistant |
| JSON Web Tokens | Authentication |
| bcrypt | Password hashing |
| Cloudinary | Image uploads |
| Stripe | Payment processing |
| node-cron | Scheduled habit resets |
| cookie-parser | Auth cookie handling |

---

## 📁 Project Structure

```
habitracker/
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AiAssistant     # Socket.IO-powered AI chatbot
│   │   │   ├── DayTime         # Time-of-day habit grouping
│   │   │   ├── Habits          # Habit cards & tracking UI
│   │   │   ├── Header          # Top navigation bar
│   │   │   ├── LeftSidebar     # Navigation sidebar
│   │   │   ├── RightSidebar    # Analytics & heatmap panel
│   │   │   ├── Settings        # User settings panel
│   │   │   ├── EditHabit       # Habit edit form
│   │   │   ├── ManageHabits    # Habit list management
│   │   │   ├── Mood            # Mood logging widget
│   │   │   ├── TimerClock      # Focus timer display
│   │   │   └── Modal           # Generic modal wrapper
│   │   ├── pages/              # Route-level page components
│   │   │   ├── Home            # Main dashboard
│   │   │   ├── Journal         # Mood journaling page
│   │   │   ├── Timer           # Focus timer page
│   │   │   ├── Plans           # Subscription plans
│   │   │   ├── Signin / Signup # Auth pages
│   │   │   └── Logout          # Logout handler
│   │   ├── redux/              # Redux slices
│   │   ├── store/              # Redux store config
│   │   └── utils/              # Helper functions
│   ├── vercel.json             # Vercel SPA rewrite rules
│   └── package.json
│
├── backend/                    # Express + Prisma API
│   ├── src/
│   │   ├── app.ts              # Entry point — Express + Socket.IO server
│   │   ├── controllers/
│   │   │   ├── authController    # Login, signup, Google OAuth, Stripe webhook
│   │   │   ├── habitController   # CRUD habits, logging, streaks
│   │   │   ├── userController    # Profile management
│   │   │   └── chatbotController # AI assistant logic
│   │   ├── routes/
│   │   │   ├── habit             # /api/habit/* endpoints
│   │   │   └── user              # /api/user/* endpoints
│   │   ├── middlewares/          # Auth middleware (JWT verification)
│   │   ├── lib/                  # Prisma client instance
│   │   ├── config/               # Cloudinary & service configs
│   │   └── utils/                # Cron-based habit reset utilities
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Migration history
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** database (or a [Neon](https://neon.tech) serverless instance)

### 1. Clone the repository

```bash
git clone https://github.com/mohdhassaan07/habitracker.git
cd habitracker
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Auth
JWT_SECRET="your-jwt-secret"

# Cloudinary (image uploads)
CLODINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Run Prisma migrations and start the dev server:

```bash
npx prisma migrate dev
npm run dev
```

The backend runs on **http://localhost:3000** by default.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` with:

```env
VITE_CLIENT_ID=your_google_client_id
```

Start the dev server:

```bash
npm run dev
```

The frontend runs on **http://localhost:5173** by default.

---

## 🗄️ Database Schema

The app uses **Prisma ORM** with PostgreSQL. Key models:

| Model | Description |
|---|---|
| `User` | Accounts with email/password auth and profile pictures |
| `Habit` | Trackable habits with frequency, unit type, and streak data |
| `HabitLog` | Daily log entries per habit (completed / failed / skipped / pending) |
| `MoodLog` | Daily mood entries with descriptions (one per user per day) |
| `TimeOfDay` | Labels for habit scheduling (morning, afternoon, evening) |

### Enums

- **UnitType** — `minutes` · `times`
- **Frequency** — `daily` · `weekly` · `monthly`
- **HabitStatus** — `completed` · `failed` · `skipped` · `pending`
- **Mood** — `happy` · `good` · `okay` · `bad` · `terrible`

---

## 🔌 API Routes

### Auth & User — `/api/user`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/signin` | Login with email/password |
| POST | `/google` | Google OAuth login |
| POST | `/webhook` | Stripe payment webhook |
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile / upload picture |

### Habits — `/api/habit`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create` | Create a new habit |
| GET | `/` | Get all habits for the authenticated user |
| PUT | `/:id` | Update a habit |
| DELETE | `/:id` | Delete a habit |
| POST | `/:id/log` | Log habit completion for a day |
| GET | `/streaks` | Get streak data |

### Utilities

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reset` | Trigger habit reset (used by cron) |

### WebSocket Events (Socket.IO)

| Event | Direction | Description |
|---|---|---|
| `userMessage` | Client → Server | Send a message to the AI assistant |
| `aiReply` | Server → Client | Receive the AI's response |
| `typing` | Server → Client | Typing indicator (true/false) |

---

## 📦 Scripts

### Backend

```bash
npm run dev       # Start dev server with ts-node-dev
npm run build     # Compile TypeScript
npm start         # Run compiled JS (production)
```

### Frontend

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check + production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

---

## 🌐 Deployment

- **Frontend** — Deployed on [Vercel](https://vercel.com) with SPA rewrites (`vercel.json`)
- **Backend** — Can be deployed to any Node.js hosting platform (Render, Railway, Fly.io, etc.)
- **Database** — Hosted on [Neon](https://neon.tech) (serverless PostgreSQL)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/mohdhassaan07">mohdhassaan07</a>
</p>