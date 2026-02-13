import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getPhotos, uploadPhoto, deletePhoto } from '../controllers/photoController.js';
import auth from '../middleware/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const router = Router();

router.get('/', getPhotos);
router.post('/', auth, upload.single('photo'), uploadPhoto);
router.delete('/:filename', auth, deletePhoto);

export default router;