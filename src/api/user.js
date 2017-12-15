const mongoose = require('mongoose');
const express = require('express');
const { Post, Member } = require('../model');
const { regexp_escape } = require('../helper/utils')

const router = express.Router();

router.get('/user/:user_id', async (req, res, next) => {
  const user_id = req.params.user_id;

  try {
    const user = await Member.findById(user_id, {
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

router.get('/user/:user_id/posts', async (req, res, next) => {
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

router.get('/user', async (req, res, next) => {
  const q = req.params.q || '';
  q = regexp_escape(q);

  try {
    const query = {
      post_count: { $gt: 0 }
    };
    if (q) {
      query.name = {
        $regex: new RegExp(q),
        $options: 'i'
      };
    }

    const users = await Member.paginate(query, {
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
