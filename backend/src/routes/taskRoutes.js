import express from 'express';
import Joi from 'joi';
import { requireAuth } from '../middleware/auth.js';
import { Task } from '../models/Task.js';

const router = express.Router();
router.use(requireAuth);

const taskSchema = Joi.object({
  caseId: Joi.string().required(),
  assignedTo: Joi.string().required(),
  title: Joi.string().required(),
  dueDate: Joi.date().optional(),
  notes: Joi.string().allow('')
});

router.post('/', async (req, res, next) => {
  try {
    const value = await taskSchema.validateAsync(req.body);
    const task = await Task.create({ ...value, assignedBy: req.user._id });
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
});

router.get('/mine', async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).sort({ dueDate: 1 });
    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
});

export default router;
