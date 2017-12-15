const mongoose = require('mongoose');
const express = require('express');
const { Post, User } = require('../model');
const { regexpEscape } = require('../helper/utils')
const moment = require('moment');

const router = express.Router();

router.get('/users/count', async (req, res, next) => {
  try {
    const userCount = await User.count({ post_count: { $gt: 0 } });
    return res.status(200).json({ count: userCount });
  } catch (error) {
    return next(error);
  }
});

router.get('/users/top', async (req, res, next) => {
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

router.get('/users/:user_id', async (req, res, next) => {
  const user_id = req.params.user_id;
  try {
    const user = await User.findById(user_id, {
      _id: 1,
      name: 1,
      post_count: 1
    });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `Not found user_id ${user_id}`
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});

router.get('/users/:user_id/posts', async (req, res, next) => {
  const user_id = req.params.user_id;
  try {
    const posts = await Post.paginate(
      { 'from.id': user_id },
      {
        select: {
          _id: 1,
          from: 1,
          message: 1,
          created_time: 1,
          comments_count: 1,
          likes_count: 1,
          is_deleted: 1,
          r
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

router.get('/users', async (req, res, next) => {
  try {
    let q = req.params.q || '';
    q = regexpEscape(q);

    const query = {
      post_count: { $gt: 0 }
    };
    if (q) {
      query.name = {
        $regex: new RegExp(q),
        $options: 'i'
      };
    }

    const users = await User.paginate(query, {
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
    });

    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
