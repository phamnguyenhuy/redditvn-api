const moment = require('moment');
const git = require('git-last-commit');

const getProjection = require('../getProjection');

const { Post, Comment, User } = require('../../models');

const { post } = require('../../services');
const { findPostsCount, findPostsLikesCount } = post;

const { comment } = require('../../services');
const { findCommentsCount } = comment;

const { user } = require('../../services');
const { findUsersCount } = user;

const { subreddit } = require('../../services');
const { findSubredditsCount, findSubreddits } = subreddit;

const { setting } = require('../../services')
const { findLastUpdated } = setting

const { stats } = require('../../services');
const { findStatsChart } = stats;

const QueryResolver = {
  Query: {
    async count(obj, { type, since, until }, context, info) {
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();

      switch (type) {
        case 'POSTS':
          return findPostsCount(since, until);
        case 'LIKES':
          const likes = await findPostsLikesCount(since, until);
          return likes[0].count;
        case 'COMMENTS':
          return findCommentsCount(since, until);
        case 'USERS':
          return findUsersCount();
        case 'SUBREDDITS':
          const src = await findSubredditsCount(since, until);
          return src.length;
        default:
          return null;
      }
    },
    async subreddits(obj, { since, until }, context, info) {
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();
      return (await findSubreddits(since, until)).map(r => r._id);
    },
    top(obj, { limit, since, until }, context, info) {
      since = moment.unix(since).toDate();
      until = moment.unix(until).toDate();
      const projection = getProjection(info.fieldNodes[0]);
      return { limit, since, until };
    },
    chart(obj, { type, group }, context, info) {
      return findStatsChart(type, group);
    },
    async lastUpdate(obj, args, context, info) {
      return (await findLastUpdated()).value;
    },
    async version(obj, args, context, info) {
      const commit = await new Promise((resolve, reject) => {
        git.getLastCommit(function(err, commit) {
          if (err) {
            return reject(err);
          }
          return resolve(commit);
        });
      });
      return `[${commit.shortHash}] ${commit.subject}`;
    }
  }
}

module.exports = QueryResolver;
