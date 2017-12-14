import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  _id: String,
  value: mongoose.Schema.Types.Mixed
});

export default mongoose.model('settings', settingSchema);
