const { Post, Comment, User } = require('../../models');
const moment = require('moment');
const { toGlobalId, connectionFromArray, connectionFromPromisedArray } = require('graphql-relay');
const snoowrap = require('snoowrap');

function buildSubRedditFilters({ OR = [], q }) {
  const filter = q ? { is_deleted: { $ne: true }, r: { $ne: null }, } : null;

  if (filter) {
    if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
    if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildSubRedditFilters(OR[i]));
  }
  return filters;
}

const SubRedditResolver = {
  Query: {
    subreddits(root, { filter, first, last, before, after }, context, info) {
      const buildFilters = filter ? buildSubRedditFilters(filter) : []
      const subredditFilters = buildFilters.length > 0 ? { $or: buildFilters } : { is_deleted: { $ne: true }, r: { $ne: null } };

      const subredditArray = Post.aggregate([
        { $match: subredditFilters },
        { $project: { _id: 1, rLower: { $toLower: '$r' } } },
        {
          $group: {
            _id: '$rLower',
            posts_count: { $sum: 1 }
          }
        },
        { $sort: { posts_count: -1 } }
      ]).exec();

      return connectionFromPromisedArray(subredditArray, { first, last, before, after });
    }
  },
  R: {
    __isTypeOf(r, args, context, info) {
      return r instanceof snoowrap.objects.Subreddit;
    },
    id(r, args, context, info) {
      return toGlobalId('U', r.display_name);
    }
  }
};

module.exports = SubRedditResolver;
