require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.js');
const taskRoutes = require('./routes/tasks.js');
const userRoutes = require('./routes/users.js');
const errorHandler = require('./Middleware/errorHandler.js');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running! Visit http://localhost:3000/api/tasks or http://localhost:3000/api/users');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});