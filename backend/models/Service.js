import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  data: { type: Object, required: true }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);