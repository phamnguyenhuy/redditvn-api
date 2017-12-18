const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  _id: String,
  value: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('settings', settingSchema);
