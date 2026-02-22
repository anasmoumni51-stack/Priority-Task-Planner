# 📝 Task Planner with MongoDB

A task planner web application built with **Node.js, Express, and MongoDB**. Features a modular architecture with separated routes, middleware, input validation (Joi), and Docker support.

## Features

- **Complete CRUD Operations**: Create, Read, Update, Delete tasks
- **Input Validation**: Joi schema validation for all task inputs
- **Category Selector**: Dropdown with predefined categories (work, personal, shopping, health, education, home, other)
- **Deadline Tracking**: Required deadline date with remaining days urgency indicator
- **Advanced Filtering**: Search by title, filter by category and priority
- **Statistics Dashboard**: Task counts, average priority, category breakdowns
- **Error Handling Middleware**: Centralized error handling
- **Dockerized**: Full Docker + Docker Compose setup for easy deployment
- **Responsive UI**: Bootstrap-based interface

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Validation** | Joi |
| **Frontend** | Vanilla JavaScript + HTML + Bootstrap |
| **Environment** | dotenv |
| **Containerization** | Docker + Docker Compose |
| **Dev Tools** | Nodemon | config

## Project Architecture

```
task-planner/
├── models/
│   ├── Task.js              # Mongoose Task schema
│   └── User.js              # Mongoose User schema (WIP)
├── routes/
│   ├── tasks.js             # Task CRUD routes
│   └── stats.js             # Statistics routes
├── middleware/
│   └── error.js             # Error handling middleware
├── validators/
│   └── TaskValidator.js     # Joi validation for tasks
├── public/
│   ├── index.html           # Main UI
│   └── app.js               # Frontend logic
├── index.js                 # Express server entry point
├── package.json             # Dependencies & scripts
├── Dockerfile               # Docker image blueprint
├── docker-compose.yml       # Docker orchestration (app + MongoDB)
├── .dockerignore            # Files excluded from Docker
├── .env                     # Environment variables
└── .gitignore               # Files excluded from Git
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v7 or higher) **or** Docker Desktop
- npm

## Installation & Setup

### Option 1: Local Setup

**1. Clone and install dependencies**
```bash
git clone https://github.com/anasmoumni51-stack/Priority-Task-Planner
cd Priority-Task-Planner
npm install
```

**2. Environment configuration**

Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/taskplanner
PORT=3000
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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with optional filtering) |
| POST | `/api/tasks` | Create a new task (Joi validated) |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/stats` | Get task statistics |

### Query Parameters for GET /api/tasks

| Parameter | Description |
|-----------|-------------|
| `search` | Search in title (case-insensitive) |
| `category` | Filter by category |
| `priority` | Filter by priority level (1-5) |

## Database Schema

### Task Model
```javascript
{
  title:       String    (required, trimmed),
  description: String    (trimmed),
  priority:    Number    (1-5, default: 2),
  category:    String    (trimmed),
  deadline:    Date      (required),
  taskType:    String    (enum: work|personal|shopping|health|education|home|other),
  createdAt:   Date,
  updatedAt:   Date
}
```

### Joi Validation (TaskValidator)
```javascript
{
  title:       string().min(3).max(50).required(),
  description: string().max(500).allow(''),
  priority:    number().integer().min(1).max(5),
  category:    string().allow(''),
  deadline:    date(),
  taskType:    string().valid('work','personal','shopping','health','education','home','other').lowercase()
}
```

## Middleware

- **Error Handler** (`middleware/error.js`): Catches all unhandled errors and returns a 500 response
- Routes are mounted as Express middleware in `index.js`:
```javascript
app.use('/api/tasks', tasks);
app.use('/api/stats', stats);
app.use(errorHandler);
```

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

- [ ] User authentication (bcrypt + JWT)
- [ ] User model with generateToken() schema method
- [ ] Protected routes with auth middleware
- [ ] Login page frontend
- [ ] Task consequence field
- [ ] Task completion tracking

## License

ISC
