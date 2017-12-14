import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

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
export default mongoose.model('comments', commentSchema);
