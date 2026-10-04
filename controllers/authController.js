const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models/index.cjs');

const { Task, User } = db;

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required.'
      });
    }

    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'member'
    });

    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    if (!user.password) {
      return res.status(500).json({
        error: 'User account has no password configured.'
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      },
      include: Task,
      order: [['id', 'ASC']]
    });

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  listUsers
};