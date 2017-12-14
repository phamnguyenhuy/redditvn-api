import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const postSchema = new mongoose.Schema({
  _id: String,
  from: {
    id: String,
    name: String
  },
  message: String,
  object_id: String,
  created_time: Date,
  updated_time: Date,
  comments_count: { type: Number, default: 0 },
  likes_count: { type: Number, default: 0 },
  is_deleted: { type: Boolean, default: false },
  comments_time: { type: Date, default: new Date(2000, 1, 1) },
  edit_history: [String]
});

postSchema.plugin(mongoosePaginate);
export default mongoose.model('posts', postSchema);
