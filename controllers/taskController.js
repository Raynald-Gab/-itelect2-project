const db = require('../models/index.cjs');

const { Task, User } = db;

function stripPassword(task) {
  const plain = task.toJSON();
  if (plain.User) {
    delete plain.User.password;
  }
  return plain;
}

async function listTasks(req, res, next) {
  try {
    const tasks = await Task.findAll({
      include: User,
      order: [['id', 'ASC']]
    });
    const clean = tasks.map(stripPassword);
    return res.status(200).json(clean);
  } catch (error) {
    next(error);
  }
}

async function getTask(req, res, next) {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId, { include: User });

    if (!task) {
      return res.status(404).json({ error: `Task with id ${taskId} not found.` });
    }

    return res.status(200).json(stripPassword(task));
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const newTask = await Task.create(req.body);
    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
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
}

async function deleteTask(req, res, next) {
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
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };