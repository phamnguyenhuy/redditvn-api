const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');
const { getStats } = require('../helper/stats');
const { Post, Member, Comment } = require('../model');

const router = express.Router();

router.get('/stats/count', async (req, res, next) => {
  try {
    const postCount = await Post.count({ is_deleted: { $ne: true } });
    const memberCount = await Member.count({ post_count: { $gt: 0 } });
    const commentCount = await Comment.count();

    return res.status(200).json({
      post_count: postCount,
      member_count: memberCount,
      comment_count: commentCount
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/top', async (req, res, next) => {
  let limit = req.query.limit || 10;
  const group = req.query.group || 'today';
  let time = moment();

  switch (group) {
    case 'today':
      time = time.startOf('day');
      break;
    case '7days':
      time = time.add(-7, 'day');
      break;
    case '30days':
      time = time.add(-30, 'day');
      break;
    default:
      time = moment(0);
      break;
  }

  try {
    // top all time
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true },
          created_time: {
            $gte: time.toDate()
          }
        }
      },
      {
        $unwind: '$from'
      },
      {
        $group: {
          _id: '$from.id',
          name: { $first: '$from.name'},
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: limit
      }
    ];
    const topUsers = await Post.aggregate(aggregatorOpts);

    const topLikes = await Post.find({
      created_time: {
        $gte: time.toDate()
      }
    }, { _id: 1, likes_count: 1, comments_count: 1, from: 1 })
      .sort('-likes_count')
      .limit(limit);

    const topComments = await Post.find({
      created_time: {
        $gte: time.toDate()
      }
    }, { _id: 1, likes_count: 1, comments_count: 1, from: 1 })
      .sort('-comments_count')
      .limit(limit);

    return res.status(200).json({
      top_users: topUsers,
      top_likes: topLikes,
      top_comments: topComments
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/user', async (req, res, next) => {
  try {
    const users = await Member.paginate(
      { post_count: { $gt: 0 } },
      {
        select: {
          _id: 1,
          name: 1,
          post_count: 1
        },
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          post_count: -1
        }
      }
    );

    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
});

router.get('/stats/chart', async (req, res, next) => {
  const type = req.query.type || 'posts';
  const group = req.query.group || 'month';

  try {
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
