const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const commentSchema = new mongoose.Schema({
  _id: String,
  post_id: {
    type: String,
    select: false
  },
  parent: {
    id: String
  },
  message: String,
  from: {
    id: String,
    name: String
  },
  created_time: Date
});

commentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('comments', commentSchema);
