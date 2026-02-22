const express = require('express');
const Task = require('../models/Task');
const path = require('path');
const validateTask = require('../models/Task').validateTask;            
require('dotenv').config();              


const router = express.Router();


router.get('/', async (req, res) => {
  try {
    
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
    
   // Calculate tasks by category
    const categoryStats = {};
    allTasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });
    
    
    res.send({
      totalTasks,
      avgPriority: parseFloat(avgPriority),
      highPriorityCount,
      categoryStats
    });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).send({ error: 'Server error getting statistics' });
  }
});

module.exports = router;