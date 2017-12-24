const merge = require('deepmerge');
const GraphQLDate = require('graphql-date');
const comment = require('./comment');
const post = require('./post');
const query = require('./query');
const top = require('./top');
const user = require('./user');

module.exports = {
  Resolvers: merge.all([{ Date: GraphQLDate }, comment, post, top, user, query])
};
