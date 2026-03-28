import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const router = express.Router();

const issueToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

router.post('/register', async (req, res, next) => {
  try {
    const value = await registerSchema.validateAsync(req.body);
    const existing = await User.findOne({ email: value.email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(value.password, 12);
    const user = await User.create({ ...value, passwordHash });
    const token = issueToken(user);
    return res.status(201).json({ token, user: { id: user._id, fullName: user.fullName, role: user.role } });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const value = await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(value.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = issueToken(user);
    return res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role } });
  } catch (error) {
    return next(error);
  }
});

export default router;
