const express = require('express');
const router = express.Router();
const db = require('../models/index.cjs');

const { Task, User } = db;

router.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      include: User,
      order: [['id', 'ASC']]
    });
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get('/tasks/:id', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId, { include: User });

    if (!task) {
      return res.status(404).json({ error: `Task with id ${taskId} not found.` });
    }

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

router.post('/tasks', async (req, res, next) => {
  try {
    const newTask = await Task.create(req.body);
    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

router.put('/tasks/:id', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: `Task with id ${taskId} not found.` });
    }

    await task.update(req.body);
    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

router.delete('/tasks/:id', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: `Task with id ${taskId} not found.` });
    }

    await task.destroy();
    return res.status(200).json({ 
      message: `Task with id ${taskId} deleted successfully.`, 
      task 
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: Task,
      order: [['id', 'ASC']]
    });
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;