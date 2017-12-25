const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const commentSchema = new mongoose.Schema({
  _id: String,
  post: {
    type: String,
    ref: 'posts'
  },
  parent: {
    type: String,
    ref: 'comments'
  },
  message: String,
  user: {
    type: String,
    ref: 'users'
  },
  created_time: Date
});

commentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('comments', commentSchema);
