const express = require('express');
const verifyToken = require('../Middleware/verifyToken.js');
const requireRole = require('../Middleware/requireRole.js');
const {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController.js');

const router = express.Router();

// server.js mounts this router at /api/tasks, so "/" is /api/tasks
router.get('/', listTasks);
router.get('/:id', getTask);
router.post('/', verifyToken, createTask);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, requireRole('admin'), deleteTask);

module.exports = router;