const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Post, Member, Comment } = require('../model');

router.get('/info', async (req, res, next) => {
  try {
    let postCount = 0;
    let memberCount = 0;
    let commentCount = 0;

    if (mongoose.connection.readyState === mongoose.STATES.connected) {
      postCount = await Post.count({ is_deleted: { $ne: true } });
      memberCount = await Member.count({ post_count: { $gt: 0 } });
      commentCount = await Comment.count();
    }

    return res.status(200).json({
      postCount,
      memberCount,
      commentCount
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
