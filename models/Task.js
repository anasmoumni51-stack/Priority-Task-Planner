const mongoose = require('mongoose');

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
  timestamps: true // Adds createdAt and updatedAt
});



const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
