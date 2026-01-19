# Task Planner with MongoDB

A flexible task management web application built with Node.js, Express, and MongoDB. This project demonstrates CRUD operations, flexible document schemas, and MongoDB aggregation pipelines.

## Features

-  **Complete CRUD Operations**: Create, Read, Update, Delete tasks
-  **Flexible Task Types**: Different fields based on task categories (work, personal, shopping, etc.)
-  **Advanced Filtering**: Search by title, filter by category and priority
-  **Statistics Dashboard**: Task counts, average priority, category breakdowns
-  **Responsive UI**: Bootstrap-based interface
-  **MongoDB Aggregation**: Statistics using MongoDB aggregation pipelines

## 🛠️ Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: Vanilla JavaScript + HTML + CSS + Bootstrap
- **Environment**: dotenv for configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd task-planner
npm install
```

### 2. MongoDB Setup
```bash
# Install MongoDB (macOS with Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Or start manually
sudo mongod --dbpath /usr/local/var/mongodb
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/taskplanner
PORT=3000
```

### 4. Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Access the Application
Open your browser and navigate to: `http://localhost:3000`

## 📊 Database Schema & Structure

### Tasks Collection
The application uses a flexible MongoDB document schema that allows different fields based on task type:

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  priority: Number (1-5),
  category: String,
  project: String,
  deadline: Date,
  taskType: String (enum: work|personal|shopping|health|education),
  createdAt: Date,
  updatedAt: Date,
  // Additional flexible fields based on task type:
  // - Work tasks: assignedTo, estimatedHours, tags
  // - Shopping: items[], store, budget
  // - Health: doctorName, appointmentTime, symptoms
  // etc.
}
```

### Indexes
- Default MongoDB `_id` index
- Compound index on `category` and `priority` for efficient filtering
- Text index on `title` and `description` for search functionality

## 🔍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with optional filtering) |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/stats` | Get task statistics |

### Query Parameters for GET /api/tasks
- `search`: Search in title/description
- `category`: Filter by category
- `priority`: Filter by priority level

## 📈 Aggregation Examples

The statistics endpoint uses MongoDB aggregation pipelines:

```javascript
// Total tasks and average priority
db.tasks.aggregate([
  {
    $group: {
      _id: null,
      totalTasks: { $sum: 1 },
      avgPriority: { $avg: "$priority" }
    }
  }
])

// Tasks by category
db.tasks.aggregate([
  {
    $group: {
      _id: "$category",
      count: { $sum: 1 }
    }
  }
])
```

## 🧪 Sample Data

Run this to seed your database with sample tasks:

```javascript
// In MongoDB shell or via your application
const sampleTasks = [
  {
    title: "Complete project proposal",
    description: "Write and submit Q1 project proposal",
    priority: 4,
    category: "work",
    taskType: "work",
    project: "Q1 Planning",
    deadline: new Date("2026-02-01"),
    assignedTo: "John Doe",
    estimatedHours: 8,
    tags: ["urgent", "planning"]
  },
  {
    title: "Buy groceries",
    description: "Weekly grocery shopping",
    priority: 2,
    category: "personal",
    taskType: "shopping",
    items: ["milk", "bread", "eggs"],
    store: "Whole Foods",
    budget: 50
  },
  {
    title: "Doctor appointment",
    description: "Annual checkup",
    priority: 3,
    category: "health",
    taskType: "health",
    doctorName: "Dr. Smith",
    appointmentTime: "10:00 AM",
    symptoms: []
  }
];
```

## 🏗️ Project Architecture

```
task-planner/
├── models/
│   └── Task.js          # Mongoose schema definition
├── public/
│   ├── index.html       # Main UI
│   └── app.js           # Frontend logic
├── index.js             # Express server & API routes
├── package.json         # Dependencies & scripts
├── .env                 # Environment variables
└── README.md           # This file
```

### Architecture Decisions
- **Separation of Concerns**: Backend API, database models, and frontend logic are clearly separated
- **RESTful API**: Standard HTTP methods for CRUD operations
- **Flexible Schema**: MongoDB's document model allows different task types with varying fields
- **Error Handling**: Comprehensive error handling in both backend and frontend
- **Responsive Design**: Bootstrap ensures the app works on all devices

## Security Considerations

- Input validation using Mongoose schemas
- CORS enabled for local development
- No authentication implemented (add as needed for production)
- Environment variables for sensitive configuration

## Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance (MongoDB Atlas, etc.)
3. Configure proper environment variables
4. Consider adding authentication and authorization
5. Set up proper logging and monitoring

## Development Notes

- Uses `strict: false` in Mongoose schema to allow flexible fields
- Implements MongoDB aggregation for statistics
- Follows Express.js best practices
- Includes comprehensive error handling
- Uses modern JavaScript (ES6+)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
