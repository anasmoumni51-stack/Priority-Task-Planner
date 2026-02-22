const express = require('express');      
const mongoose = require('mongoose');    
const path = require('path');
const stats = require('./routes/stats');
const tasks = require('./routes/tasks');            
const errorHandler = require('./middleware/error');        
const Task = require('./models/Task');
require('dotenv').config();

const app = express();


app.use(express.json());                 
app.use(express.static('public'));
app.use('/api/tasks', tasks);
app.use('/api/stats', stats);
app.use(errorHandler);



mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskplanner')
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' MongoDB error:', err));



const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});