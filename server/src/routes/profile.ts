import { Router } from 'express';
import { getProfile, updateProfile, getAnalytics } from '../controllers/profileController';
import { auth } from '../middleware/auth';

const router = Router();

router.use(auth);

router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/analytics', getAnalytics);

export default router;
