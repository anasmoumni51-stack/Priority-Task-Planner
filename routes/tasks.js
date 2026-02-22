const express = require('express');
const mongoose = require('mongoose');
const validateTask = require('../validators/TaskValidator');
require('dotenv').config();
const path = require('path');            
const Task = require('../models/Task');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    
    let filter = {};
    
    // If user provided category filter, add to filter
    if (req.query.category) return filter.category = req.query.category;
    
    
    // If user provided priority filter, add to filter
    if (req.query.priority) return filter.priority = parseInt(req.query.priority);
    
    
    
    // Search by title (if search query provided)
    if (req.query.search) return filter.title = { $regex: req.query.search, $options: 'i' }; // Case-insensitive search
    
    
    // Get tasks from database using the filter
    const tasks = await Task.find(filter);
    
    
    res.send(tasks);
    
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Server error getting tasks' });
  }
});


router.post('/', async (req, res) => {
  try {
    
    const task = new Task(req.body);
    
    const { error } = validateTask(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    
   
    task.createdAt = new Date();
    
    
    await task.save();
    
  
    res.status(201).send(task);
    
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ error: 'Bad request - check your data' });
  }
});


router.put('/:id', async (req, res) => {
  try {

    const taskId = req.params.id;
    
    
    const { error } = validateTask(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    
    
    const task = await Task.findByIdAndUpdate(taskId, req.body, { 
      new: true, // Return updated document
      runValidators: true // Run validation on update
    });
    
    
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    
    res.json(task);
    
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ error: 'Bad request - check your data' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    
    const taskId = req.params.id;
    
    const task = await Task.findByIdAndDelete(taskId);
    
    if (!task) return res.status(404).send({ error: 'Task not found' });
    
    res.json({ message: 'Task deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error deleting task' });
  }
});

module.exports = router;