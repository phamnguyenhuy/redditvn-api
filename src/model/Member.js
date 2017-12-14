import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const memberSchema = new mongoose.Schema({
  _id: String,
  name: String,
  post_count: { type: Number, default: 0 }
});

memberSchema.plugin(mongoosePaginate);
export default mongoose.model('members', memberSchema);
