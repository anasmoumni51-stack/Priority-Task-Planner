const { required } = require('joi');
const mongoose = require('mongoose');

// Define a schema for tasks (like a blueprint)
// Using strict: false to allow flexible fields for different task types
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 2
  },
  category: {
    type: String,
    trim: true
  },
  deadline: {
    type: Date,
    required: true
  },
  taskType: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'health', 'education', 'home', 'other'],
    default: 'personal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  strict: false, // Allow additional fields for flexibility
  timestamps: true // Adds createdAt and updatedAt automatically
});



// Create a Task model based on the schema
// This represents a collection in MongoDB called 'tasks'
const Task = mongoose.model('Task', TaskSchema);

// Export the model so we can use it in other files
module.exports = Task;
