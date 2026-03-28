import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Case } from '../models/Case.js';
import { Task } from '../models/Task.js';

const router = express.Router();
router.use(requireAuth);

router.get('/overview', async (req, res, next) => {
  try {
    const [totalCases, openCases, highPriority, tasksPending] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ status: { $ne: 'Closed' } }),
      Case.countDocuments({ priority: 'High' }),
      Task.countDocuments({ assignedTo: req.user._id, status: { $ne: 'Done' } })
    ]);

    const statusBreakdown = await Case.aggregate([
      { $group: { _id: '$status', total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    return res.json({
      userRole: req.user.role,
      metrics: { totalCases, openCases, highPriority, tasksPending },
      statusBreakdown
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
