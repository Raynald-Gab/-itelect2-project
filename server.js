require('dotenv').config();
const express = require('express');
const router = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running! Visit http://localhost:3000/api/tasks or http://localhost:3000/api/users');
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});