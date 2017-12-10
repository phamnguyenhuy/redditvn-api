const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Post, Member, Comment } = require('../model');
const statsHelper = require('../helper/stats');
const moment = require('moment');

router.get('/stats/top', async (req, res, next) => {
  let limit = req.query.limit;
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
    const topUsers = await Post.aggregate(aggregatorOpts).exec();

    const topLikes = await Post.find({
      created_time: {
        $gte: time.toDate()
      }
    }, { _id: 1, likes_count: 1, comments_count: 1, from: 1 })
      .sort('-likes_count')
      .limit(limit)
      .exec();

    const topComments = await Post.find({
      created_time: {
        $gte: time.toDate()
      }
    }, { _id: 1, likes_count: 1, comments_count: 1, from: 1 })
      .sort('-comments_count')
      .limit(limit)
      .exec();

    return res.status(200).json({
      topUsers,
      topLikes,
      topComments
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

router.get('/stats', async (req, res, next) => {
  const type = req.query.type || 'posts';
  const group = req.query.group || 'month';

  try {
    let dbStats;
    if (type === 'posts') {
      if (group === 'month') {
        dbStats = await statsHelper.getPostMonth();
        dbStats.xLabel = 'Month';
        dbStats.yLabel = 'Posts';
        dbStats.title = 'Posts per Month';
      } else if (group === 'hour') {
        dbStats = await statsHelper.getPostHour();
        dbStats.xLabel = 'Hour';
        dbStats.yLabel = 'Posts';
        dbStats.title = 'Posts per Hour';
      } else if (group === 'dow') {
        dbStats = await statsHelper.getPostDayOfWeek();
        dbStats.xLabel = 'Day of Week';
        dbStats.yLabel = 'Posts';
        dbStats.title = 'Posts per Day of Week';
      } else if (group === 'dom') {
        dbStats = await statsHelper.getPostDayOfMonth();
        dbStats.xLabel = 'Day of Month';
        dbStats.yLabel = 'Posts';
        dbStats.title = 'Posts per Day of Month';
      }
    } else if (type === 'comments') {
      if (group === 'month') {
        dbStats = await statsHelper.getCommentMonth();
        dbStats.xLabel = 'Month';
        dbStats.yLabel = 'Comments';
        dbStats.title = 'Comments per Month';
      } else if (group === 'hour') {
        dbStats = await statsHelper.getCommentHour();
        dbStats.xLabel = 'Hour';
        dbStats.yLabel = 'Comments';
        dbStats.title = 'Comments per Hour';
      } else if (group === 'dow') {
        dbStats = await statsHelper.getCommentDayOfWeek();
        dbStats.xLabel = 'Day of Week';
        dbStats.yLabel = 'Comments';
        dbStats.title = 'Comments per Day of Week';
      } else if (group === 'dom') {
        dbStats = await statsHelper.getCommentDayOfMonth();
        dbStats.xLabel = 'Day of Month';
        dbStats.yLabel = 'Comments';
        dbStats.title = 'Comments per Day of Month';
      }
    }

    return res.status(200).json({
      type,
      group,
      dbStats
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
