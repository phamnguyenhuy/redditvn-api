const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  post_count: { type: Number, default: 0 }
});

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('members', userSchema);
