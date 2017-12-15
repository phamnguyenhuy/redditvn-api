const mongoose = require('mongoose');
const express = require('express');
const { Post, User } = require('../model');

const router = express.Router();

router.get('/r', async (req, res, next) => {
  try {
    var reddits = await Post.distinct('r');
    return res.status(200).json(reddits);
  } catch (error) {
    return next(error);
  }
});

router.get('/r/:subreddit', async (req, res, next) => {
  try {
    const r = req.params.subreddit.toLowerCase();
    const posts = await Post.paginate(
      { r: { $eq: r } },
      {
        select: {
          _id: 1,
          from: 1,
          message: 1,
          created_time: 1,
          comments_count: 1,
          likes_count: 1,
          is_deleted: 1,
          r: 1
        },
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          created_time: -1
        }
      }
    );

    return res.status(200).json(posts);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
