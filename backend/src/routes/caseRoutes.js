import express from 'express';
import { Case } from '../models/Case.js';
import { caseSchema } from '../utils/validators.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';
import { analyzeCase, recommendCases } from '../services/mlService.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', allowRoles('court_clerk', 'police_clerk', 'advocate'), async (req, res, next) => {
  try {
    const value = await caseSchema.validateAsync(req.body);
    const analysis = await analyzeCase({
      title: value.title,
      description: value.description,
      caseType: value.caseType
    });

    const caseDoc = await Case.create({
      ...value,
      ...analysis,
      createdBy: req.user._id,
      timeline: [{ note: 'Case filed into system.', actor: req.user._id }]
    });

    return res.status(201).json(caseDoc);
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { q, priority, caseType, status, from, to } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { summary: { $regex: q, $options: 'i' } }
      ];
    }
    if (priority) filter.priority = priority;
    if (caseType) filter.caseType = caseType;
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const cases = await Case.find(filter).sort({ createdAt: -1 }).populate('assignedTo', 'fullName role');
    return res.json(cases);
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({ message: 'Case not found.' });
    }

    caseDoc.status = status;
    caseDoc.timeline.push({ note: `Status changed to ${status}.`, actor: req.user._id });
    await caseDoc.save();
    return res.json(caseDoc);
  } catch (error) {
    return next(error);
  }
});

router.get('/recommend/urgent', async (req, res, next) => {
  try {
    const cases = await Case.find({ status: { $ne: 'Closed' } }).lean();
    const recommendations = await recommendCases(cases);
    return res.json(recommendations);
  } catch (error) {
    return next(error);
  }
});

export default router;
