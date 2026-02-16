import { v2 as cloudinary } from 'cloudinary';
import Photo from '../models/Photo.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    const urls = photos.map(p => p.url);
    // console.log('[GET PHOTOS] Returning URLs:', urls);
    res.json(urls);
  } catch (err) {
    // console.error('[GET PHOTOS] Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // console.log('[UPLOAD] File received:', req.file.originalname, 'size:', req.file.size);

    // Upload directly from memory buffer (no local file)
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'forum-beauty-clinic', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // console.log('[UPLOAD] Cloudinary success:', result.secure_url);

    const newPhoto = new Photo({ url: result.secure_url });
    await newPhoto.save();

    res.json({ url: result.secure_url });
  } catch (err) {
    // console.error('[UPLOAD ERROR]:', err.message);
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { filename } = req.params;
    // console.log('[DELETE] Attempting to delete:', filename);

    const photo = await Photo.findOne({ url: { $regex: filename } });
    if (!photo) return res.status(404).json({ msg: 'Photo not found' });

    // Extract public_id from Cloudinary URL
    const urlParts = photo.url.split('/');
    const publicId = urlParts.slice(-2).join('/').split('.')[0];

    // console.log('[DELETE] Public ID:', publicId);

    await cloudinary.uploader.destroy(publicId);

    await Photo.deleteOne({ _id: photo._id });

    res.json({ msg: 'Photo deleted successfully' });
  } catch (err) {
    console.error('[DELETE ERROR]:', err.message);
    res.status(500).json({ msg: 'Delete failed', error: err.message });
  }
};
