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
    ref: 'members'
  },
  created_time: Date,

  // remove
  post_id: {
    type: String
  },
  from: {
    id: String,
    name: String
  },
});

commentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('comments', commentSchema);
