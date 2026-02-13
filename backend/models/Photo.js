import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Photo', photoSchema);