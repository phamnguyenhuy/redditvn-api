const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Post, Member, Comment } = require('../model');
const FB = require('fb');

const fb = new FB.Facebook();
fb.options({ Promise: Promise });

router.get('/post/:post_id', async (req, res, next) => {
  try {
    const post_id = req.params.post_id;
    let post = await Post.findById(post_id, {
      _id: 1,
      from: 1,
      message: 1,
      created_time: 1,
      comments_count: 1,
      likes_count: 1,
      is_deleted: 1
    });

    if (!post) {
      return res.status(404).json({
        status: 404,
        message: `Not found post_id = ${post_id}`
      });
    }

    post = post.toObject();

    // get next post
    const next_post = await Post.findOne({ created_time: { $gt: post.created_time } }, { _id: 1 })
      .sort('created_time')
      .limit(1);

    // get prev post
    const prev_post = await Post.findOne({ created_time: { $lt: post.created_time } }, { _id: 1 })
      .sort('-created_time')
      .limit(1);

    var result = {
      ...post,
      prev_post: prev_post,
      next_post: next_post
    };
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

router.get('/post/:post_id/attachments', async (req, res, next) => {
  try {
    const post_id = req.params.post_id;

    // check fb post
    let images = [];
    try {
      const fbPost = await fb.api(post_id, {
        fields: ['id', 'message', 'object_id', 'likes', 'attachments'],
        access_token: process.env.FACEBOOK_ACCESS_TOKEN
      });

      // attachment
      if (fbPost.attachments && fbPost.attachments.data) {
        for (const attachment of fbPost.attachments.data) {
          if (attachment.type === 'photo' && attachment.media) {
            images.push({
              url: attachment.url,
              src: attachment.media.image.src,
              type: 'image'
            });
          } else if (attachment.type.includes('animated_image') && attachment.media) {
            images.push({
              url: attachment.url,
              src: attachment.media.image.src,
              type: 'gif'
            });
          } else if (attachment.type.includes('video') && attachment.media) {
            images.push({
              url: attachment.url,
              src: attachment.media.image.src,
              type: 'video'
            });
          } else if (attachment.type === 'share' && attachment.media) {
            images.push({
              url: attachment.url,
              src: attachment.media.image.src,
              type: 'share'
            });
          } else if (attachment.type === 'album' && attachment.subattachments && attachment.subattachments.data) {
            for (const subattachment of attachment.subattachments.data) {
              images.push({
                url: subattachment.url,
                src: subattachment.media.image.src,
                type: 'image'
              });
            }
          }
        }
      }

      const updateObj = {
        likes_count: fbPost.likes.count,
        $unset: { is_deleted: 1 }
      };

      // check post is edit
      if (fbPost.message !== post.message) {
        updateObj.message = fbPost.message; // save new
        updateObj.$push = { edit_history: post.message };
        post.message = fbPost.message;
      }

      // check new object id
      if (fbPost.object_id !== post.object_id) {
        updateObj.object_id = fbPost.object_id;
      }

      Post.update({ _id: post._id }, updateObj);
    } catch (error) {
      if (error.name === 'FacebookApiException') {
        const errorObj = JSON.parse(error.message);
        if (errorObj.error.code === 100 && errorObj.error.error_subcode === 33) {
          Post.update({ _id: post._id }, { is_deleted: true });
          post.is_deleted = true;
        }
      }
    }

    return res.status(200).json(images);
  } catch (error) {
    return next(error);
  }
});

router.get('/post/:post_id/comments', async (req, res, next) => {
  try {
    const post_id = req.params.post_id;
    // get root comment
    const root_comments = await Comment.find({ post_id: post_id, parent: { $eq: null } }, undefined, { lean: true }).sort('created_time');

    // get reply comment
    const reply_comments = await Comment.find({ post_id: post_id, parent: { $ne: null } }, undefined, { lean: true }).sort('created_time');

    // merge 2 type comment
    reply_comments.forEach((value, index) => {
      const idx = root_comments.findIndex(x => x._id === value.parent.id);
      if (root_comments[idx]) {
        if (root_comments[idx].replies === undefined) {
          root_comments[idx].replies = [];
        }
        root_comments[idx].replies.push(value);
      }
    });

    return res.status(200).json(root_comments);
  } catch (error) {
    return next(error);
  }
});

router.get('/random', async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const query = {
      message: {
        $regex: new RegExp(q),
        $options: 'i'
      }
    };

    const dbQuery = q === '' ? {} : query;

    const count = await Post.count(dbQuery);
    const random = Math.floor(Math.random() * count);
    const randomPost = await Post.findOne(dbQuery, { _id: 1 }).skip(random);
    return res.status(200).json({
      _id: randomPost._id
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/search', async (req, res, next) => {
  let q = req.query.q || '';
  q = q.toLowerCase();
  if (q.startsWith('regex:')) {
    q = q.substr(6);
  }
  else {
    q = q.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  let dbQuery =
    q === ''
      ? {}
      : {
          message: {
            $regex: new RegExp(q),
            $options: 'i'
          }
        };

  try {
    const posts = await Post.paginate(dbQuery, {
      select: {
        _id: 1,
        from: 1,
        message: 1,
        created_time: 1,
        comments_count: 1,
        likes_count: 1,
        is_deleted: 1
      },
      page: req.query.page,
      limit: req.query.limit,
      sort: {
        created_time: -1
      }
    });

    return res.status(200).json(posts);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
