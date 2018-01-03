const { ServerError } = require('../helpers/server');
const { Post } = require('../models');
const moment = require('moment');
const _ = require('lodash');

function findSubredditsCount(since, until) {
  const filter = {
    is_deleted: { $ne: true },
    r: { $ne: null },
  };
  if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
  if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
  return Post.aggregate([
    { $match: filter },
    { $project: { _id: 1, rLower: { $toLower: '$r' } } },
    {
      $group: {
        _id: '$rLower'
      }
    }
  ]).exec();
}

module.exports = {
  findSubredditsCount
};
