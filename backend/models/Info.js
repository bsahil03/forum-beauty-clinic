import mongoose from 'mongoose';

const infoSchema = new mongoose.Schema({
  name: String,
  address: String,
  contact: String,
  instagram: String,
  ownerName: String,
}, { timestamps: true });

export default mongoose.model('Info', infoSchema);