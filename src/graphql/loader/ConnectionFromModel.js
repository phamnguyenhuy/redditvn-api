const _ = require('lodash');

const encodeBase64 = (str) => new Buffer(str, 'ascii').toString('base64');
const decodeBase64 = (b64) => new Buffer(b64, 'base64').toString('ascii');

const lazyLoadingCondition = async ({ matchCondition, lastId, orderFieldName, orderLastValue, sortType }) => {
  if (!('$or' in matchCondition) || matchCondition || matchCondition['$or'] === undefined) {
    matchCondition['$or'] = [{}];
  }
  if (orderLastValue !== undefined) {
    if (sortType === 1) {
      matchCondition['$and'] = [
        { $or: matchCondition['$or'] },
        {
          $or: [
            {
              $and: [{ [orderFieldName]: { $gte: orderLastValue } }, { _id: { $gt: lastId } }]
            },
            { [orderFieldName]: { $gt: orderLastValue } }
          ]
        }
      ];
    } else {
      matchCondition['$and'] = [
        { $or: matchCondition['$or'] },
        {
          $or: [
            {
              $and: [{ [orderFieldName]: { $lte: orderLastValue } }, { _id: { $lt: lastId } }]
            },
            { [orderFieldName]: { $lt: orderLastValue } }
          ]
        }
      ];
    }
  } else {
    if (sortType === 1) {
      matchCondition['$and'] = [
        { $or: matchCondition['$or'] },
        { _id: { $gt: lastId } }
      ];
    } else {
      matchCondition['$and'] = [
        { $or: matchCondition['$or'] },
        { _id: { $lt: lastId } }
      ];
    }
  }

  delete matchCondition['$or'];
};

const lazyLoadingResponseFromArray = async ({ result, orderFieldName, hasNextPage, hasPreviousPage, totalCount, context, loader }) => {
  let edges = [];
  let edge;
  let value;
  await Promise.all(
    result.map(async record => {
      value = JSON.stringify({
        id: _.get(record, '_id'),
        order: _.get(record, orderFieldName)
      });
      edge = {
        cursor: encodeBase64(value),
        node: loader(context, record._id)
      };
      edges.push(edge);
    })
  );
  return {
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor: edges[0] ? edges[0].cursor : null,
      endCursor: edges[edges.length - 1] ? edges[edges.length - 1].cursor : null
    },
    edges,
    totalCount
  };
};

const getMatchCondition = async ({ filter, cursor, orderFieldName, sortType }) => {
  let matchCondition = {};

  if (cursor) {
    let unserializedAfter = JSON.parse(decodeBase64(cursor));
    let lastId = unserializedAfter.id;
    let orderLastValue = unserializedAfter.order;
    await lazyLoadingCondition({ matchCondition, lastId, orderFieldName, orderLastValue, sortType });
  }
  if (filter) {
    _.merge(matchCondition, filter);
  }

  return matchCondition;
};

const fetchConnectionFromArray = async ({ dataPromiseFunc, filter, after, before, first, last, orderFieldName = '_id', sortType = 1, context, loader }) => {
  let hasNextPage = false;
  let hasPreviousPage = false;
  let result = [];
  let matchCondition = {};
  let totalCount = 0;

  if (first > 0 && last > 0) {
    throw Error('Can not set both first and last');
  }

  if (!first && !last) {
    first = 10;
  }

  totalCount = await dataPromiseFunc(filter).count();

  if (after) {
    matchCondition = await getMatchCondition({
      filter,
      cursor: after,
      orderFieldName,
      sortType
    });
    result = await dataPromiseFunc(matchCondition)
      .select({_id: 1, [orderFieldName]: 1})
      .sort({
        [orderFieldName]: sortType,
        _id: sortType
      })
      .limit(first + 1)
      .then(data => data);
    sortType *= -1;
    matchCondition = await getMatchCondition({
      filter,
      cursor: after,
      orderFieldName,
      sortType
    });
    hasPreviousPage = Boolean(
      await dataPromiseFunc(matchCondition)
        .sort({
          [orderFieldName]: sortType,
          _id: sortType
        })
        .count()
    );
    if (result.length && result.length > first) {
      hasNextPage = true;
      result.pop();
    }
  } else if (before || last) {
    sortType *= -1;
    matchCondition = await getMatchCondition({
      filter,
      cursor: before,
      orderFieldName,
      sortType
    });
    result = await dataPromiseFunc(matchCondition)
      .select({_id: 1, [orderFieldName]: 1})
      .sort({
        [orderFieldName]: sortType,
        _id: sortType
      })
      .limit(last + 1)
      .then(data => data.reverse());
    if (before) {
      sortType *= -1;
      matchCondition = await getMatchCondition({
        filter,
        cursor: before,
        orderFieldName,
        sortType
      });
      hasNextPage = Boolean(
        await dataPromiseFunc(matchCondition)
          .sort({
            [orderFieldName]: sortType,
            _id: sortType
          })
          .count()
      );
    }
    if (result.length && result.length > last) {
      hasPreviousPage = true;
      result.shift();
    }
  } else {
    matchCondition = await getMatchCondition({
      filter,
      orderFieldName,
      sortType: sortType
    });
    result = await dataPromiseFunc(matchCondition)
      .select({_id: 1, [orderFieldName]: 1})
      .sort({
        [orderFieldName]: sortType,
        _id: sortType
      })
      .limit(first + 1).exec()
      .then(data => data);
    if (result.length && result.length > first) {
      hasNextPage = true;
      result.pop();
    }
  }

  return lazyLoadingResponseFromArray({
    result,
    orderFieldName,
    hasNextPage,
    hasPreviousPage,
    totalCount,
    context,
    loader
  });
};

module.exports = fetchConnectionFromArray;
