const merge = require('deepmerge');
const GraphQLDate = require('graphql-date');
const Cursor = require('../scalars/Cursor');
const attachment = require('./attachment');
const comment = require('./comment');
const post = require('./post');
const query = require('./query');
const subreddit = require('./subreddit');
const top = require('./top');
const user = require('./user');

module.exports = {
  Resolvers: merge.all([{ Date: GraphQLDate, Cursor: Cursor }, attachment, comment, post, subreddit, top, user, query])
};
