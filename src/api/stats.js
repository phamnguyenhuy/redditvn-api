const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');
const { getStats } = require('../helper/stats');
const { Post, User, Comment } = require('../model');

const router = express.Router();

router.get('/stats/count/posts', async (req, res, next) => {
  try {
    const postCount = await Post.count({ is_deleted: { $eq: false } });
    return res.status(200).json({ count: postCount });
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/count/users', async (req, res, next) => {
  try {
    const userCount = await User.count({ post_count: { $gt: 0 } });
    return res.status(200).json({ count: userCount });
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/count/comments', async (req, res, next) => {
  try {
    const commentCount = await Comment.count();
    return res.status(200).json({ count: commentCount });
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/count/r', async (req, res, next) => {
  try {
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $eq: false },
          r: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$r',
        }
      },
    ];
    const reddits = await Post.aggregate(aggregatorOpts);
    return res.status(200).json({ count: reddits.length });
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/top/users', async (req, res, next) => {
  try {
    const since = moment.unix(req.query.since);
    const until = moment.unix(req.query.until);
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $eq: false },
          created_time: {
            $gte: since.toDate(),
            $lt: until.toDate()
          }
        }
      },
      {
        $unwind: '$from'
      },
      {
        $group: {
          _id: '$from.id',
          name: { $first: '$from.name' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: req.query.limit
      }
    ];
    const topUsers = await Post.aggregate(aggregatorOpts);

    return res.status(200).json({
      since: since.unix(),
      until: until.unix(),
      data: topUsers
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/top/likes', async (req, res, next) => {
  try {
    const since = moment.unix(req.query.since);
    const until = moment.unix(req.query.until);
    const topLikes = await Post.find(
      {
        created_time: {
          $gte: since.toDate(),
          $lt: until.toDate()
        }
      },
      { _id: 1, likes_count: 1, comments_count: 1, from: 1 }
    )
      .sort('-likes_count')
      .limit(req.query.limit);

    return res.status(200).json({
      since: since.unix(),
      until: until.unix(),
      data: topLikes
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/top/comments', async (req, res, next) => {
  try {
    const since = moment.unix(req.query.since);
    const until = moment.unix(req.query.until);
    const topComments = await Post.find(
      {
        created_time: {
          $gte: since.toDate(),
          $lt: until.toDate()
        }
      },
      { _id: 1, likes_count: 1, comments_count: 1, from: 1 }
    )
      .sort('-comments_count')
      .limit(req.query.limit);

    return res.status(200).json({
      since: since.unix(),
      until: until.unix(),
      data: topComments
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/top/r', async (req, res, next) => {
  try {
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $eq: false },
          r: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$r',
          post_count: { $sum: 1 }
        }
      },
      {
        $sort: {
          post_count: -1
        }
      },
      {
        $limit: req.query.limit
      }
    ];
    const reddits = await Post.aggregate(aggregatorOpts);

    return res.status(200).json(reddits);
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/chart', async (req, res, next) => {
  try {
    const type = req.query.type || 'posts';
    const group = req.query.group || 'month';

    const stats = await getStats(type, group);

    return res.status(200).json({
      type,
      group,
      chart_data: stats
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
