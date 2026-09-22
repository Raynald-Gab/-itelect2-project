const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models/index.cjs');

const verifyToken = require('../middleware/verifyToken.js').default || require('../middleware/verifyToken.js');
const requireRole = require('../middleware/requireRole.js').default || require('../middleware/requireRole.js');

const { Task, User } = db;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

router.post('/auth/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashedPassword = bcrypt.hashSync ? bcrypt.hashSync(password, 10) : password;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'member'
    });

    return res.status(201).json({
      message: 'User registered successfully.',
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = bcrypt.compareSync 
      ? bcrypt.compareSync(password, user.password) 
      : password === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

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

router.post('/tasks', verifyToken, async (req, res, next) => {
  try {
    const newTask = await Task.create(req.body);
    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

router.put('/tasks/:id', verifyToken, async (req, res, next) => {
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

router.delete('/tasks/:id', verifyToken, requireRole('admin'), async (req, res, next) => {
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