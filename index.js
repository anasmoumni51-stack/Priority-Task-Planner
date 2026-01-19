// =====================================================
// TASK PLANNER - NODE.JS BACKEND SERVER
// Simple version for students with comments
// =====================================================

// Import required libraries
const express = require('express');      // Web framework for Node.js
const mongoose = require('mongoose');    // MongoDB library
const path = require('path');            // To work with file paths
require('dotenv').config();              // Load environment variables from .env file
const Task = require('./models/Task');   // Import our Task model

// Create Express application
const app = express();

// =========== MIDDLEWARE ===========
// Middleware are functions that run for every request
app.use(express.json());                 // Parse JSON data from requests
app.use(express.static('public'));       // Serve static files from 'public' folder

// =========== DATABASE CONNECTION ===========
// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskplanner')
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' MongoDB error:', err));

// =========== API ROUTES ===========
// These endpoints allow frontend to interact with database

// 1. GET ALL TASKS (with optional filtering)
app.get('/api/tasks', async (req, res) => {
  try {
    // Start with empty filter
    let filter = {};
    
    // If user provided category filter, add to filter
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // If user provided priority filter, add to filter
    if (req.query.priority) {
      filter.priority = parseInt(req.query.priority);
    }
    
    // Search by title (if search query provided)
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' }; // Case-insensitive search
    }
    
    // Get tasks from database using the filter
    const tasks = await Task.find(filter);
    
    // Send tasks as JSON response
    res.json(tasks);
    
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Server error getting tasks' });
  }
});

// 2. CREATE NEW TASK
app.post('/api/tasks', async (req, res) => {
  try {
    // Create new task from request body
    const task = new Task(req.body);
    
    // Add creation date
    task.createdAt = new Date();
    
    // Save to database
    await task.save();
    
    // Send created task as response (status 201 = created)
    res.status(201).json(task);
    
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ error: 'Bad request - check your data' });
  }
});

// 3. UPDATE TASK
app.put('/api/tasks/:id', async (req, res) => {
  try {
    // Get task ID from URL parameter
    const taskId = req.params.id;
    
    // Find and update task by ID
    const task = await Task.findByIdAndUpdate(taskId, req.body, { 
      new: true, // Return updated document
      runValidators: true // Run validation on update
    });
    
    // If task not found, return 404 error
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Send updated task as response
    res.json(task);
    
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ error: 'Bad request - check your data' });
  }
});

// 4. DELETE TASK
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    // Get task ID from URL parameter
    const taskId = req.params.id;
    
    // Find and delete task by ID
    const task = await Task.findByIdAndDelete(taskId);
    
    // If task not found, return 404 error
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Send success message
    res.json({ message: 'Task deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error deleting task' });
  }
});

// 4. GET STATISTICS
app.get('/api/stats', async (req, res) => {
  try {
    // Get all tasks
    const allTasks = await Task.find({});
    
    // Calculate total tasks
    const totalTasks = allTasks.length;
    
    // Calculate average priority
    let totalPriority = 0;
    let highPriorityCount = 0;
    
    allTasks.forEach(task => {
      if (task.priority) {
        totalPriority += task.priority;
        if (task.priority >= 4) {
          highPriorityCount++;
        }
      }
    });
    
    const avgPriority = totalTasks > 0 ? (totalPriority / totalTasks).toFixed(1) : 0;
    
    // Get tasks by category
    const categoryStats = {};
    allTasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });
    
    // Send all statistics
    res.json({
      totalTasks,
      avgPriority: parseFloat(avgPriority),
      highPriorityCount,
      categoryStats
    });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Server error getting statistics' });
  }
});

// =========== START SERVER ===========
// Set port number (use environment variable or default to 3000)
const PORT = process.env.PORT || 3000;

// Start listening for requests
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});