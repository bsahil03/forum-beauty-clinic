import { Router } from 'express';
import { getServices, updateServices } from '../controllers/serviceController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', getServices);
router.put('/', auth, updateServices);

export default router;