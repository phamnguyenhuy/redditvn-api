const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const postSchema = new mongoose.Schema({
  _id: String,
  user: {
    type: String,
    ref: 'members'
  },
  message: String,
  created_time: Date,
  updated_time: {
    type: Date,
    select: false
  },
  comments_count: {
    type: Number,
    default: 0
  },
  likes_count: {
    type: Number,
    default: 0
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  comments_time: {
    type: Date,
    default: new Date(2000, 1, 1),
    select: false
  },
  edit_history: {
    type: [String],
    select: false
  },
  r: {
    type: String,
    trim: true
  },
  u: {
    type: String,
    trim: true
  },

  // remove
  from: {
    id: String,
    name: String
  },
  object_id: {
    type: String,
    select: false
  },
});

postSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('posts', postSchema);
