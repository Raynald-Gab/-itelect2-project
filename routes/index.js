const express = require('express');
const router = express.Router();
const { tasks, fetchSampleUsers } = require('../utils.js');

let cachedUsers = [];

fetchSampleUsers()
  .then((users) => {
    cachedUsers = users;
    console.log('Sample users successfully cached.');
  })
  .catch((err) => {
    console.error('Error fetching users:', err.message);
  });

router.get('/tasks', (req, res) => {
  res.json(tasks);
});

router.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found.` });
  }

  res.json(task);
});

router.get('/users', (req, res) => {
  res.json(cachedUsers);
});

module.exports = router;