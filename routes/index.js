const express = require('express');
const router = express.Router();
const { tasks, fetchSampleUsers, validateTask, mergeTaskUpdate } = require('../utils.js');

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

router.post('/tasks', (req, res) => {
  if (!validateTask(req.body)) {
    return res.status(400).json({ error: 'Invalid task data. Title and dueDate are required.' });
  }

  const newTask = {
    id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
    completed: false,
    ...req.body
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found.` });
  }

  const updatedTask = mergeTaskUpdate(tasks[taskIndex], req.body);
  tasks[taskIndex] = updatedTask;

  res.status(200).json(updatedTask);
});

router.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with id ${req.params.id} not found.` });
  }

  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: `Task with id ${taskId} deleted successfully.` });
});

router.get('/users', (req, res) => {
  res.json(cachedUsers);
});

module.exports = router;