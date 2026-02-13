import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  expiry: { type: Date }
}, { timestamps: true });

export default mongoose.model('Offer', offerSchema);