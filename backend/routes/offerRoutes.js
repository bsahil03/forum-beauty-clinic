import { Router } from 'express';
import { getOffers, createOffer, updateOffer, deleteOffer } from '../controllers/offerController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', getOffers);
router.post('/', auth, createOffer);
router.put('/:id', auth, updateOffer);
router.delete('/:id', auth, deleteOffer);

export default router;