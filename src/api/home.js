import mongoose from 'mongoose';
import express from 'express';
import { Post, Member, Comment } from '../model';

const router = express.Router();

router.get('/info', async (req, res, next) => {
  try {
    const postCount = await Post.count({ is_deleted: { $ne: true } });
    const memberCount = await Member.count({ post_count: { $gt: 0 } });
    const commentCount = await Comment.count();

    return res.status(200).json({
      postCount,
      memberCount,
      commentCount
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
