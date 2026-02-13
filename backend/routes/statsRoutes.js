import { Router } from 'express';
import { getStats, incrementVisits } from '../controllers/statsController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, getStats);
router.post('/increment', incrementVisits);

export default router;