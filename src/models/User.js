const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  posts_count: { type: Number, default: 0 },
  comments_count: { type: Number, default: 0 },
  saved: mongoose.Schema.Types.Mixed,
});

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('users', userSchema);
