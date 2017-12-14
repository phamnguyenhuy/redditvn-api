const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const memberSchema = new mongoose.Schema({
  _id: String,
  name: String,
  post_count: { type: Number, default: 0 }
});

memberSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('members', memberSchema);
