# 🏋️ Fitness Planner

**Personalized Workout & Diet Planner — powered by a built-in AI engine.**

Fitness Planner generates custom workout routines and meal plans tailored to your body metrics, fitness goals, cultural food preferences, and budget — all without requiring any external API keys.

---

## ✨ Features

| Area | Details |
|------|---------|
| **AI Health Analysis** | BMR (Mifflin-St Jeor), TDEE, BMI, caloric targets, and macro splits computed in real-time |
| **Workout Generator** | Personalized exercise plans based on fitness level, goal, and available equipment |
| **Diet Generator** | Meal plans aligned with your calorie/macro needs, food preferences, and budget |
| **User Dashboard** | At-a-glance health stats, progress overview, and daily recommendations |
| **Profile System** | Detailed user profiles with age, weight, height, activity level, and goal tracking |
| **Auth System** | JWT-based registration & login with bcrypt password hashing |
| **Responsive UI** | Mobile-first design with sidebar navigation, toast notifications, and loading transitions |

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** / **CSS3** — single-page app served as static files
- **Vanilla JavaScript** — modular JS (app, auth, dashboard, diet, workout, profile, api)
- **Google Fonts** — Inter & Outfit typefaces

### Backend
- **Node.js** + **Express** — REST API server
- **better-sqlite3** — lightweight embedded SQLite database
- **jsonwebtoken** — JWT authentication
- **bcryptjs** — password hashing
- **dotenv** — environment variable management

---

## 📁 Project Structure

```
fitness/
├── public/                  # Frontend (served as static files)
│   ├── index.html           # SPA entry point
│   ├── css/
│   │   └── style.css        # All styles
│   └── js/
│       ├── app.js           # App shell, routing, navigation
│       ├── api.js           # HTTP client for backend API
│       ├── auth.js          # Login / Register UI & logic
│       ├── dashboard.js     # Dashboard charts & stats
│       ├── workout.js       # Workout plan UI
│       ├── diet.js          # Diet plan UI
│       └── profile.js       # User profile management
│
├── server/                  # Backend
│   ├── index.js             # Express server entry point
│   ├── config.js            # Port, JWT secret, DB path
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── models/
│   │   └── database.js      # SQLite schema & queries
│   ├── routes/
│   │   ├── auth.js          # POST /api/auth/register & /login
│   │   ├── user.js          # GET/PUT /api/user/profile
│   │   ├── workout.js       # GET /api/workout/generate
│   │   └── diet.js          # GET /api/diet/generate
│   └── ai/
│       ├── engine.js        # Core AI — BMR, TDEE, BMI, macros
│       ├── workoutGen.js    # Workout plan generation logic
│       ├── dietGen.js       # Diet plan generation logic
│       └── data.js          # Exercise & food databases
│
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/fitness-planner.git
cd fitness-planner

# 2. Install dependencies
npm install

# 3. (Optional) Create a .env file for custom config
echo "PORT=3000" > .env
echo "JWT_SECRET=your_secret_key" >> .env

# 4. Start the development server (auto-restarts on file changes)
npm run dev
```

The app will be available at **http://localhost:3000**.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with file watching (`node --watch`) |
| `npm start` | Start production server |

---

## 🔌 API Reference

All API endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Authenticate & receive JWT |

### User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/user/profile` | 🔒 | Get current user profile |
| `PUT` | `/api/user/profile` | 🔒 | Update profile (age, weight, height, goals, etc.) |

### Workout

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/workout/generate` | 🔒 | Generate a personalized workout plan |

### Diet

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/diet/generate` | 🔒 | Generate a personalized meal plan |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |

> 🔒 Protected routes require an `Authorization: Bearer <token>` header.

---

## 🧠 AI Engine

The AI engine runs **entirely on the server** with no external API calls. It uses established sports-science formulas:

| Calculation | Method |
|-------------|--------|
| **BMR** | Mifflin-St Jeor Equation |
| **TDEE** | Activity-level multipliers (1.2 – 1.9) |
| **Caloric Target** | Goal-based adjustments (−750 to +500 kcal) |
| **Macros** | Goal-specific protein/carb/fat ratios with minimum protein floor (1.6 g/kg) |
| **BMI** | Standard formula with category classification |
| **Water Intake** | 35 ml per kg body weight |
| **Fitness Level** | Derived from activity level and age |

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `JWT_SECRET` | *(built-in fallback)* | Secret key for signing JWTs |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
