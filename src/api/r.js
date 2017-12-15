const mongoose = require('mongoose');
const express = require('express');
const { Post, User } = require('../model');
const moment = require('moment');
const { reqPageLimit, reqSinceUntil} = require('../middleware');

const router = express.Router();

router.get('/r/count', reqSinceUntil, async (req, res, next) => {
  try {
    const since = moment.unix(req.query.since);
    const until = moment.unix(req.query.until);
    const aggregatorOpts = [
      {
        $match: {
          created_time: {
            $gte: since.toDate(),
            $lt: until.toDate()
          },
          is_deleted: { $ne: true },
          r: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$r'
        }
      }
    ];
    const reddits = await Post.aggregate(aggregatorOpts);
    return res.status(200).json({
      since: since.unix(),
      until: until.unix(),
      count: reddits.length
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/r/top', reqSinceUntil, reqPageLimit, async (req, res, next) => {
  try {
    const since = moment.unix(req.query.since);
    const until = moment.unix(req.query.until);
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true },
          r: { $ne: null },
          created_time: {
            $gte: since.toDate(),
            $lt: until.toDate()
          }
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

    return res.status(200).json({
      since: since.unix(),
      until: until.unix(),
      data: reddits
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/r', async (req, res, next) => {
  try {
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true }
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
      }
    ];
    const reddits = await Post.aggregate(aggregatorOpts);
    const redditsArray = reddits
      .filter(r => {
        if (r._id) return true;
        return false;
      })
      .map(r => {
        return r._id;
      });

    return res.status(200).json(redditsArray);
  } catch (error) {
    return next(error);
  }
});

router.get('/r/:subreddit', reqPageLimit, async (req, res, next) => {
  try {
    let r = req.params.subreddit.toLowerCase();
    if (r === '[null]') r = null;

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
