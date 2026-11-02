import { Router } from 'express';
import { getReminders, markReminderRead, generateReminders } from '../controllers/reminderController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.get('/', getReminders);
router.put('/:id/read', markReminderRead);
router.post('/generate', generateReminders);

export default router;
