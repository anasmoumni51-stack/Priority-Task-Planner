# Priority Task Project with MongoDB

A priority task project web application built with **Node.js, Express, and MongoDB**. Features a modular architecture with separated routes, middlewares, input validation for each route (Joi), user authentication (bcrypt + JWT), security hardening, and Docker Containers.

## Features

- **Complete CRUD Operations**: Create, Read, Update, Delete tasks
- **User Authentication**: Registration with bcrypt password hashing and JsonWebTokens tokens
- **Protected Routes**: Auth middleware verifying JWT on protected endpoints
- **Input Validation**: Joi schema validation for tasks and users
- **Security Middleware**: Helmet (HTTP headers), CORS (cross-origin), rate limiting (100 req/min)
- **Category Selector**: Dropdown with predefined categories (work, personal, shopping, health, education, home, other)
- **Deadline Tracking**: Required deadline date with remaining days urgency indicator
- **Advanced Filtering**: Search by title, filter by category and priority
- **Statistics Dashboard**: Task counts, average priority, category breakdowns
- **Error Handling Middleware**: Centralized error handling
- **Configuration Management**: `config` package with environment-specific settings
- **Dockerized**: Full Docker + Docker Compose setup for easy deployment
- **Responsive UI**: Bootstrap-based interface

## Technology Stack

| Layer                | Technology                            |
| -------------------- | ------------------------------------- |
| **Backend**          | Node.js + Express.js                  |
| **Database**         | MongoDB + Mongoose                    |
| **Authentication**   | bcrypt + JSON Web Tokens (JWT)        |
| **Validation**       | Joi                                   |
| **Security**         | Helmet, CORS, express-rate-limit      |
| **Configuration**    | config (environment-based)            |
| **Frontend**         | Vanilla JavaScript + HTML + Bootstrap |
| **Containerization** | Docker + Docker Compose               |
| **Dev Tools**        | Nodemon                               |

## Project Architecture

```
priority-task-project/
├── config/
│   ├── default.json                    # Default configuration
│   ├── test.json                       # Test environment config
│   └── custom-environment-variables.json # Env var mapping
├── models/
│   ├── Task.js                         # Mongoose Task schema
│   └── User.js                         # Mongoose User schema + JWT generation
├── routes/
│   ├── tasks.js                        # Task CRUD routes
│   ├── stats.js                        # Statistics routes
│   └── user.js                         # User registration & profile routes
├── middleware/
│   ├── auth.js                         # JWT authentication middleware
│   ├── cors.js                         # CORS configuration
│   ├── error.js                        # Error handling middleware
│   └── ratelimit.js                    # Rate limiting middleware
├── validators/
│   ├── TaskValidator.js                # Joi validation for tasks
│   └── userValidator.js                # Joi validation for users
├── public/
│   ├── index.html                      # Main UI
│   └── app.js                          # Frontend logic
├── index.js                            # Express server entry point
├── seed.js                             # Database seeder script
├── package.json                        # Dependencies & scripts
├── Dockerfile                          # Docker image blueprint
├── docker-compose.yml                  # Docker orchestration (app + MongoDB)
├── .dockerignore                       # Files excluded from Docker
└── .gitignore                          # Files excluded from Git
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v7 or higher) **or** Docker Desktop
- npm

## Installation & Setup

### Option 1: Local Setup

**1. Clone and install dependencies**

```bash
git clone https://github.com/anasmoumni51-stack/priority-task-project
cd priority-task-project
npm install
```

**2. Configuration**

The app uses the `config` package. Default settings are in `config/default.json`:

```json
{
  "jwtPrivateKey": "developpementenvironement",
  "db": "mongodb://localhost:27017/taskplanner",
  "port": "3000"
}
```

Test environment settings are in `config/test.json`:

```json
{
  "jwtPrivateKey": "testenvironement",
  "db": "mongodb://localhost/taskplanner-test",
  "port": "3001"
}
```

To override with environment variables, set them as mapped in `config/custom-environment-variables.json`:

```bash
export TODO_jwtPrivateKey=yourSecretKey
export MONGODB_URI=mongodb://localhost:27017/taskplanner
export PORT=3000
```

**3. Start the application**

```bash
# Development mode (auto-restart with Nodemon)
npm run dev

# Production mode
npm start
```

### Option 2: Docker Setup

Make sure Docker Desktop is running, then:

```bash
# Build and start containers
docker compose up --build

# Run in background
docker compose up -d --build

# Stop containers
docker compose down

# Stop and delete data
docker compose down -v
```

**4. Access the application**

Open your browser: `http://localhost:3000`

## API Endpoints

### Tasks

| Method | Endpoint         | Description                             |
| ------ | ---------------- | --------------------------------------- |
| GET    | `/api/tasks`     | Get all tasks (with optional filtering) |
| POST   | `/api/tasks`     | Create a new task (Joi validated)       |
| PUT    | `/api/tasks/:id` | Update an existing task                 |
| DELETE | `/api/tasks/:id` | Delete a task                           |

### Statistics

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | `/api/stats` | Get task statistics |

### Users

| Method | Endpoint        | Auth | Description              |
| ------ | --------------- | ---- | ------------------------ |
| POST   | `/api/users`    | No   | Register a new user      |
| GET    | `/api/users/me` | Yes  | Get current user profile |

### Query Parameters for GET /api/tasks

| Parameter  | Description                        |
| ---------- | ---------------------------------- |
| `search`   | Search in title (case-insensitive) |
| `category` | Filter by category                 |
| `priority` | Filter by priority level (1-5)     |

## Authentication

The app uses **bcrypt** for password hashing and **JWT** for token-based authentication.

### Register a user

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Name", "email": "email@email.com", "password": "passwordToBeEncrypted"}'
```

The JWT token is returned in the `x-auth-token` response header.

### Access a protected route

```bash
curl http://localhost:3000/api/users/me \
  -H "x-auth-token: <your-token>"
```

## Database Schemas

### Task Model

```javascript
{
  title:       String    (required, trimmed),
  description: String    (trimmed),
  priority:    Number    (1-5, default: 2),
  category:    String    (trimmed),
  deadline:    Date      (required),
  taskType:    String    (enum: work|personal|shopping|health|education|home|other),
  createdAt:   Date
}
```

### User Model

```javascript
{
  name:        String    (required, 2-50 chars),
  email:       String    (required, unique, 5-255 chars),
  password:    String    (required, hashed, 5-1024 chars),
  isAdmin:     Boolean
}
```

## Middleware Stack

| Middleware        | File                      | Description                                                 |
| ----------------- | ------------------------- | ----------------------------------------------------------- |
| **JSON Parser**   | built-in                  | `express.json()` — parses request bodies                    |
| **CORS**          | `middleware/cors.js`      | Configured for localhost:3000, allows `x-auth-token` header |
| **Helmet**        | built-in                  | Sets secure HTTP headers                                    |
| **Rate Limiter**  | `middleware/ratelimit.js` | 100 requests per minute per IP                              |
| **Auth**          | `middleware/auth.js`      | Verifies JWT token, sets `req.user`                         |
| **Error Handler** | `middleware/error.js`     | Catches unhandled errors, returns 500                       |

## Frontend Features

- **Urgency Indicator**: Color-coded badges showing remaining days
  - 🔴 Red: Overdue / Today / 3 days or less
  - 🟡 Yellow: 4-7 days
  - 🟢 Green: 8+ days
- **Category Dropdown**: Mapped to schema enum values
- **Priority Selector**: 5 levels (Low to Critical)
- **Deadline Date Picker**: Required field

## Scripts

```bash
npm start      # Start the server
npm run dev    # Start with Nodemon (auto-reload)
npm run seed   # Seed database with sample data
```

## Upcoming Features

- [ ] Login endpoint
- [ ] Login page frontend
- [ ] Auth-protected task routes (per-user tasks)
- [ ] Task completion tracking
