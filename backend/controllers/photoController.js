import { v2 as cloudinary } from 'cloudinary';
import Photo from '../models/Photo.js';
import fs from 'fs/promises';   // ← Fixed: Add this import

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json(photos.map(p => p.url));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'forum-beauty-clinic'
    });

    const newPhoto = new Photo({ url: result.secure_url });
    await newPhoto.save();

    // Delete local temp file
    await fs.unlink(req.file.path);

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ msg: 'Upload failed' });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { filename } = req.params;
    await Photo.deleteOne({ url: { $regex: filename } });
    res.json({ msg: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed' });
  }
};