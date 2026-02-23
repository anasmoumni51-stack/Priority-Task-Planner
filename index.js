const express = require('express');      
const mongoose = require('mongoose');  
const config = require('config');
const rateLimit = require('./middleware/ratelimit');
const cors = require('./middleware/cors');
const errorHandler = require('./middleware/error'); 
const helmet = require('helmet');
const stats = require('./routes/stats');
const tasks = require('./routes/tasks'); 
const user = require('./routes/user');           
       



const app = express();


app.use(express.json());
app.use(cors);
app.use(helmet());             
app.use(rateLimit);
app.use(express.static('public'));
app.use('/api/tasks', tasks);
app.use('/api/stats', stats);
app.use('/api/users', user);
app.use(errorHandler);



mongoose.connect(config.get('db'))
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' MongoDB error:', err));



const PORT = config.get('port') || 3000;


app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});