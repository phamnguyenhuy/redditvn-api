const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const commentSchema = new mongoose.Schema({
  _id: String,
  post_id: String,
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
