import { Router } from 'express';
import {
  getGoals, getGoalById, createGoal, updateGoal, deleteGoal,
  getMilestones, createMilestone, updateMilestone, deleteMilestone,
} from '../controllers/goalController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.get('/', getGoals);
router.get('/:id', getGoalById);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

router.get('/:goalId/milestones', getMilestones);
router.post('/:goalId/milestones', createMilestone);
router.put('/milestones/:id', updateMilestone);
router.delete('/milestones/:id', deleteMilestone);

export default router;
