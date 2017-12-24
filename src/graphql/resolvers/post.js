const moment = require('moment');
const getProjection = require('../getProjection');
const { Post, Comment, User } = require('../../models');
const { regexpEscape } = require('../../helpers/util')

const { post } = require('../../services');
const { findPostByRandom } = post;

const { comment } = require('../../services');
const { findCommentsByPostId } = comment;

const { facebook } = require('../../services');
const { findAttachmentsByPostId } = facebook;

const PostResolver = {
  Query: {
    post(obj, { id }, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return Post.findById(id, projection).exec();
    },
    async posts(obj, { since, until, page, limit, r, q, u, user }, context, info) {
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();

      page = page || 1;
      limit = limit || 10;

      const query = {
        is_deleted: { $ne: true }
      };
      if (since) {
        if (!query.created_time) query.created_time = {};
        query.created_time.$gte = since;
      }
      if (until) {
        if (!query.created_time) query.created_time = {};
        query.created_time.$lt = until;
      }
      if (r) {
        query.r = { $regex: `^${r}$`, $options: 'i' };
      }
      if (u) {
        query.u = { $regex: `^${u}$`, $options: 'i' };
      }
      if (q) {
        q = q || '';
        q = q.toLowerCase();
        if (q.startsWith('regex:')) {
          q = q.substr(6);
        } else {
          q = regexpEscape(q);
        }

        if (q !== '') {
          query.message = {
            $regex: new RegExp(q),
            $options: 'i'
          };
        }
      }
      if (user) {
        query.user = user;
      }

      const projection = getProjection(info.fieldNodes[0]);
      const posts = await Post.paginate(query, {
        sort: { created_time: -1 },
        select: projection,
        page: page,
        limit: limit
      });
      return posts.docs;
    },
    random(obj, { r, q }, context, info) {
      return findPostByRandom(r, q);
    }
  },
  Post: {
    _id(post, args, context, info) {
      return post._id;
    },
    r(post, args, context, info) {
      return post.r;
    },
    u(post, args, context, info) {
      return post.u;
    },
    message(post, args, context, info) {
      return post.message;
    },
    async user(post, args, context, info) {
      const projection = getProjection(info.fieldNodes[0]);
      const user_id = post.user;
      const user = await User.findById(user_id, projection).exec();
      return user;
    },
    created_time(post, args, context, info) {
      return post.created_time;
    },
    comments_count(post, args, context, info) {
      return post.comments_count;
    },
    likes_count(post, args, context, info) {
      return post.likes_count;
    },
    is_deleted(post, args, context, info) {
      return post.is_deleted;
    },
    attachments(post, args, context, info) {
      try {
        return findAttachmentsByPostId(post._id);
      } catch (error) {
        return null;
      }
    },
    comments(post, { since, until, page, limit }, context, info) {
      return findCommentsByPostId(post._id, since, until, page, limit);
    },
  }
}

module.exports = PostResolver;
