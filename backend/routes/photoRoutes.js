import { Router } from 'express';
import multer from 'multer';
import { getPhotos, uploadPhoto, deletePhoto } from '../controllers/photoController.js';
import auth from '../middleware/auth.js';

// Use MEMORY storage → no disk, direct to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = Router();

router.get('/', getPhotos);
router.post('/', auth, upload.single('photo'), uploadPhoto);
router.delete('/:filename', auth, deletePhoto);

export default router;
