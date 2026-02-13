import Photo from '../models/Photo.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json(photos.map(p => p.url));
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    const photo = new Photo({ url });
    await photo.save();
    res.json({ url });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { filename } = req.params;
    const url = `/uploads/${filename}`;
    await Photo.deleteOne({ url });
    await fs.unlink(path.join(__dirname, '..', 'uploads', filename));
    res.json({ msg: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};