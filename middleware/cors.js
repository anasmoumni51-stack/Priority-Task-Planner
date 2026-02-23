const cors = require('cors');


const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true, // Allow cookies if needed 
};

module.exports = cors(corsOptions);