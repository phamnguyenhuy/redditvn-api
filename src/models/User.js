const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  post_count: { type: Number, default: 0 },
  token: {
    type: [
      {
        jwt_token: String,
        fb_access_token: String
      }
    ],
    select: false
  }
});

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('members', userSchema);
