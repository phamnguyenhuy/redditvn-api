const Base64URL = require('base64-url');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

function toCursor({ value }) {
  return Base64URL.encode(value.toString());
}

function fromCursor(string) {
  const value = Base64URL.decode(string);
  if (value) {
    return { value };
  } else {
    return null;
  }
}

const CursorType = new GraphQLScalarType({
  name: 'Cursor',
  serialize(value) {
    if (value.value) {
      return toCursor(value);
    } else {
      return null;
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return fromCursor(ast.value);
    } else {
      return null;
    }
  },
  parseValue(value) {
    return fromCursor(value);
  },
});

module.exports = CursorType;
