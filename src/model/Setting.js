const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const settingSchema = new mongoose.Schema({
  _id: String,
  value: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('settings', settingSchema);
