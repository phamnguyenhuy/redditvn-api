
const PREFIX = 'mongo:';

const base64 = (str) => new Buffer(str, 'ascii').toString('base64');
const unbase64 = (b64) => new Buffer(b64, 'base64').toString('ascii');

/**
 * Rederives the offset from the cursor string
 */
const cursorToOffset = (cursor) =>
  parseInt(unbase64(cursor).substring(PREFIX.length), 10);

/**
 * Given an optional cursor and a default offset, returns the offset to use;
 * if the cursor contains a valid offset, that will be used, otherwise it will
 * be the default.
 */
const getOffsetWithDefault = (cursor, defaultOffset) => {
  if (cursor === undefined || cursor === null) {
    return defaultOffset;
  }
  const offset = cursorToOffset(cursor);
  return isNaN(offset) ? defaultOffset : offset;
};

/**
 * Creates the cursor string from an offset.
 */
const offsetToCursor = (offset) => base64(PREFIX + offset);

const getTotalCount = async ({ cursor }) => {
  const clonedCursor = cursor.model.find().merge(cursor);

  return await clonedCursor.count();
};

const calculateOffsets = ({ args, totalCount }) => {
  const { after, before } = args;
  let { first, last } = args;

  // Limit the maximum number of elements in a query
  if (!first && !last) first = 10;
  if (first > 1000) first = 1000;
  if (last > 1000) last = 1000;

  const beforeOffset = getOffsetWithDefault(before, totalCount);
  const afterOffset = getOffsetWithDefault(after, -1);

  let startOffset = Math.max(-1, afterOffset) + 1;
  let endOffset = Math.min(totalCount, beforeOffset);

  if (first !== undefined) {
    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (last !== undefined) {
    startOffset = Math.max(startOffset, endOffset - last);
  }

  const skip = Math.max(startOffset, 0);

  const limit = endOffset - startOffset;

  return {
    first,
    last,
    before,
    after,
    skip,
    limit,
    beforeOffset,
    afterOffset,
    startOffset,
    endOffset,
  };
};

const getPageInfo = ({
  edges,
  before,
  after,
  first,
  last,
  afterOffset,
  beforeOffset,
  startOffset,
  endOffset,
  totalCount,
}) => {
  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const lowerBound = after ? afterOffset + 1 : 0;
  const upperBound = before ? Math.min(beforeOffset, totalCount) : totalCount;

  return {
    startCursor: firstEdge ? firstEdge.cursor : null,
    endCursor: lastEdge ? lastEdge.cursor : null,
    hasPreviousPage: last !== null ? startOffset > lowerBound : false,
    hasNextPage: first !== null ? endOffset < upperBound : false,
  };
};

const connectionFromMongoCursor = async ({
  cursor,
  context,
  args = {},
  loader,
}) => {
  const clonedCursor = cursor.model.find().merge(cursor);

  const totalCount = await getTotalCount({
    cursor: clonedCursor,
  });

  const {
    first,
    last,
    before,
    after,
    skip,
    limit,
    beforeOffset,
    afterOffset,
    startOffset,
    endOffset,
  } = calculateOffsets({ args, totalCount });

  // If supplied slice is too large, trim it down before mapping over it.
  clonedCursor.skip(skip);
  clonedCursor.limit(limit);

  //avoid large objects retrieval from collection
  const slice = await clonedCursor.select({ _id: 1 }).exec();

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: loader(context, value._id),
  }));

  return {
    edges,
    totalCount: totalCount,
    pageInfo: getPageInfo({
      edges,
      before,
      after,
      first,
      last,
      afterOffset,
      beforeOffset,
      startOffset,
      endOffset,
      totalCount,
    }),
  };
};

module.exports = connectionFromMongoCursor;
