import { Post, Comment } from '../model';

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

export const getStats = async (type, group) => {
  let group;
  let sort = sortAsc;
  switch (group) {
    case 'hour':
      group = groupHour;
      break;
    case 'dow':
      group = groupDow;
      break;
    case 'dom':
      group = groupDom;
      break;
    default:
      group = groupMonth;
      sort = sortMonthAsc;
      break;
  }
  const aggregatorOpts = [matchIsNotDeleted, projectGtm7, group, sort];

  let dbResponse;
  switch (type) {
    case 'comments':
      dbResponse = await Comment.aggregate(aggregatorOpts);
      break;

    default:
      dbResponse = await Post.aggregate(aggregatorOpts);
      break;
  }

  let label = dbResponse.map(value => value._id.toString())
  if (group === 'dow') {
    label = dbResponse.map(value => {
      return dowArray[value._id.dayOfWeek - 1];
    })
  }

  return {
    label,
    data: dbResponse.map(value => value.count)
  };
};
