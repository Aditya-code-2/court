import Joi from 'joi';
import { roles } from '../models/User.js';

export const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string()
    .valid(...roles)
    .required(),
  department: Joi.string().allow('')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const caseSchema = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().min(20).required(),
  caseType: Joi.string().default('General'),
  status: Joi.string(),
  dueDate: Joi.date().optional(),
  tags: Joi.array().items(Joi.string()).default([])
});
