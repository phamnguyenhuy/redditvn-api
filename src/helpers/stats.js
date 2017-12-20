const { Post, Comment } = require('../models');

const millisecondsFromUTC = 7 * 60 * 60 * 1000; //PST is +7 hours from UTC
const matchIsNotDeleted = {
  $match: {
    is_deleted: { $ne: true }
  }
};
const projectGtm7 = {
  $project: {
    created_time_gmt7: {
      $add: ['$created_time', millisecondsFromUTC]
    }
  }
};
const groupHour = {
  $group: {
    _id: { $hour: '$created_time_gmt7' },
    count: { $sum: 1 }
  }
};
const groupDow = {
  $group: {
    _id: { $dayOfWeek: '$created_time_gmt7' },
    count: { $sum: 1 }
  }
};
const groupDom = {
  $group: {
    _id: { $dayOfMonth: '$created_time_gmt7' },
    count: { $sum: 1 }
  }
};
const groupMonth = {
  $group: {
    _id: { year: { $year: '$created_time_gmt7' }, month: { $month: '$created_time_gmt7' } },
    count: { $sum: 1 }
  }
};
const sortAsc = {
  $sort: {
    _id: 1
  }
};
const sortMonthAsc = {
  $sort: {
    '_id.year': 1,
    '_id.month': 1
  }
};
const dowArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function getChart(type, group) {
  type = type || 'posts';
  group = group || 'month';

  let groupDb;
  let sort = sortAsc;
  switch (group) {
    case 'hour':
      groupDb = groupHour;
      break;
    case 'dow':
      groupDb = groupDow;
      break;
    case 'dom':
      groupDb = groupDom;
      break;
    default:
      groupDb = groupMonth;
      sort = sortMonthAsc;
      break;
  }
  const aggregatorOpts = [matchIsNotDeleted, projectGtm7, groupDb, sort];

  let dbResponse;
  switch (type) {
    case 'comments':
      dbResponse = await Comment.aggregate(aggregatorOpts);
      break;

    default:
      dbResponse = await Post.aggregate(aggregatorOpts);
      break;
  }

  let label;
  switch (group) {
    case 'dow':
      label = dbResponse.map(value => {
        return dowArray[value._id - 1];
      });
      break;
    case 'month':
      label = dbResponse.map(value => {
        return `${value._id.month}/${value._id.year}`;
      });
      break;
    default:
      label = dbResponse.map(value => value._id.toString());
      break;
  }

  return {
    label,
    data: dbResponse.map(value => value.count)
  };
}

module.exports = {
  getChart
};
