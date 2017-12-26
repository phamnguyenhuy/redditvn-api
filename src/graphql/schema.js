const { makeExecutableSchema } = require('graphql-tools');
const { Resolvers } = require('./resolvers');
const Schemas = require('./schemas')

const executableSchema = makeExecutableSchema({
  typeDefs: Schemas,
  resolvers: Resolvers,
});

module.exports = executableSchema;
