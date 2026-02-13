import { Router } from 'express';
import { getInfo, updateInfo } from '../controllers/infoController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', getInfo);
router.put('/', auth, updateInfo);

export default router;