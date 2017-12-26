const mongoose = require('mongoose');

async function connectionFromModel(model, filter = {}, { first, last, before, after }, orderField, order) {
  let query = model.collection;
  if (orderField === 'id') {
    query = limitQueryWithId(query, filter, before, after, order);
  } else {
    query = await limitQuery(query, filter, orderField, order, before, after);
  }
  const pageInfo = await applyPagination(query, first, last);
  return {
    query,
    pageInfo
  };
}

function limitQueryWithId(query, filter, before, after, order) {
  if (before) {
    const op = order === 1 ? '$lt' : '$gt';
    if (!filter._id) filter._id = {};
    filter._id[op] = before.value;
  }

  if (after) {
    const op = order === 1 ? '$gt' : '$lt';
    if (!filter._id) filter._id = {};
    filter._id[op] = after.value;
  }

  return query.find(filter).sort([['_id', order]]);
}

async function limitQuery(query, filter, field, order, before, after) {
  const limits = {};
  const ors = [];
  if (before) {
    const op = order === 1 ? '$lt' : '$gt';
    const beforeObject = await query.findOne(
      {
        _id: before.value
      },
      {
        fields: {
          [field]: 1
        }
      }
    );
    limits[op] = beforeObject[field];
    ors.push({
      [field]: beforeObject[field],
      _id: { [op]: before.value }
    });
  }

  if (after) {
    const op = order === 1 ? '$gt' : '$lt';
    const afterObject = await query.findOne(
      {
        _id: after.value
      },
      {
        fields: {
          [field]: 1
        }
      }
    );
    limits[op] = afterObject[field];
    ors.push({
      [field]: afterObject[field],
      _id: { [op]: after.value }
    });
  }

  if (before || after) {
    filter = {
      $or: [
        {
          [field]: limits
        },
        ...ors
      ]
    };
  }

  return query.find(filter).sort([[field, order], ['_id', order]]);
}

async function applyPagination(query, first, last) {
  let count;

  if (first || last) {
    count = await query.clone().count();
    let limit;
    let skip;

    if (first && count > first) {
      limit = first;
    }

    if (last) {
      if (limit && limit > last) {
        skip = limit - last;
        limit = limit - skip;
      } else if (!limit && count > last) {
        skip = count - last;
      }
    }

    if (skip) {
      query.skip(skip);
    }

    if (limit) {
      query.limit(limit);
    }
  }

  return {
    hasNextPage: Boolean(first && count > first),
    hasPreviousPage: Boolean(last && count > last)
  };
}

module.exports = connectionFromModel;
