require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('API is running! Visit http://localhost:3000/api/tasks or http://localhost:3000/api/users');
});

app.use('/api', router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});