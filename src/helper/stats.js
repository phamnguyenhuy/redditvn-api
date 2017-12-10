const { Post, Member, Comment } = require('../model');

module.exports.getPostHour = async function getPostHour() {
  try {
    const millisecondsFromUTC = 7 * 60 * 60 * 1000; //PST is +7 hours from UTC
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true }
        }
      },
      {
        $project: {
          gmt7time: {
            $add: ['$created_time', millisecondsFromUTC]
          }
        }
      },
      {
        $group: {
          _id: { hour: { $hour: '$gmt7time' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.hour': 1
        }
      }
    ];

    const dbResponse = await Post.aggregate(aggregatorOpts).exec();
    const labels = dbResponse.map(function(value, index) {
      return `${value._id.hour}`;
    });
    const data = dbResponse.map(function(value, index) {
      return value.count;
    });

    return {
      labels: labels,
      data: data
    };
  } catch (error) {
    return {
      labels: [],
      data: []
    };
  }
}

module.exports.getPostDayOfWeek = async function getPostDayOfWeek() {
  try {
    const millisecondsFromUTC = 7 * 60 * 60 * 1000; //PST is +7 hours from UTC
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true }
        }
      },
      {
        $project: {
          gmt7time: {
            $add: ['$created_time', millisecondsFromUTC]
          }
        }
      },
      {
        $group: {
          _id: { dayOfWeek: { $dayOfWeek: '$gmt7time' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.dayOfWeek': 1
        }
      }
    ];

    const dbResponse = await Post.aggregate(aggregatorOpts).exec();
    const labels = dbResponse.map(function(value, index) {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][value._id.dayOfWeek - 1];
    });
    const data = dbResponse.map(function(value, index) {
      return value.count;
    });

    return {
      labels: labels,
      data: data
    };
  } catch (error) {
    return {
      labels: [],
      data: []
    };
  }
}

module.exports.getPostDayOfMonth = async function getPostDayOfMonth() {
  try {
    const millisecondsFromUTC = 7 * 60 * 60 * 1000; //PST is +7 hours from UTC
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true }
        }
      },
      {
        $project: {
          gmt7time: {
            $add: ['$created_time', millisecondsFromUTC]
          }
        }
      },
      {
        $group: {
          _id: { dayOfMonth: { $dayOfMonth: '$gmt7time' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.dayOfMonth': 1
        }
      }
    ];

    const dbResponse = await Post.aggregate(aggregatorOpts).exec();
    const labels = dbResponse.map(function(value, index) {
      return `${value._id.dayOfMonth}`;
    });
    const data = dbResponse.map(function(value, index) {
      return value.count;
    });

    return {
      labels: labels,
      data: data
    };
  } catch (error) {
    return {
      labels: [],
      data: []
    };
  }
}

module.exports.getPostMonth = async function getPostMonth() {
  try {
    const millisecondsFromUTC = 7 * 60 * 60 * 1000; //PST is +7 hours from UTC
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true }
        }
      },
      {
        $project: {
          gmt7time: {
            $add: ['$created_time', millisecondsFromUTC]
          }
        }
      },
      {
        $group: {
          _id: { year: { $year: '$gmt7time' }, month: { $month: '$gmt7time' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ];

    const dbResponse = await Post.aggregate(aggregatorOpts).exec();
    const labels = dbResponse.map(function(value, index) {
      return `${value._id.month}/${value._id.year}`;
    });
    const data = dbResponse.map(function(value, index) {
      return value.count;
    });

    return {
      labels: labels,
      data: data
    };
  } catch (error) {
    return {
      labels: [],
      data: []
    };
  }
}

module.exports.getCommentHour = async function getCommentHour() {
  try {
    const millisecondsFromUTC = 7 * 60 * 60 * 1000; //PST is +7 hours from UTC
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true }
        }
      },
      {
        $project: {
          gmt7time: {
            $add: ['$created_time', millisecondsFromUTC]
          }
        }
      },
      {
        $group: {
          _id: { hour: { $hour: '$gmt7time' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.hour': 1
        }
      }
    ];

    const dbResponse = await Comment.aggregate(aggregatorOpts).exec();
    const labels = dbResponse.map(function(value, index) {
      return `${value._id.hour}`;
    });
    const data = dbResponse.map(function(value, index) {
      return value.count;
    });

    return {
      labels: labels,
      data: data
    };
  } catch (error) {
    return {
      labels: [],
      data: []
    };
  }
}

module.exports.getCommentDayOfWeek = async function getCommentDayOfWeek() {
  try {
    const millisecondsFromUTC = 7 * 60 * 60 * 1000; //PST is +7 hours from UTC
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true }
        }
      },
      {
        $project: {
          gmt7time: {
            $add: ['$created_time', millisecondsFromUTC]
          }
        }
      },
      {
        $group: {
          _id: { dayOfWeek: { $dayOfWeek: '$gmt7time' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.dayOfWeek': 1
        }
      }
    ];

    const dbResponse = await Comment.aggregate(aggregatorOpts).exec();
    const labels = dbResponse.map(function(value, index) {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][value._id.dayOfWeek - 1];
    });
    const data = dbResponse.map(function(value, index) {
      return value.count;
    });

    return {
      labels: labels,
      data: data
    };
  } catch (error) {
    return {
      labels: [],
      data: []
    };
  }
}

module.exports.getCommentDayOfMonth = async function getCommentDayOfMonth() {
  try {
    const millisecondsFromUTC = 7 * 60 * 60 * 1000; //PST is +7 hours from UTC
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true }
        }
      },
      {
        $project: {
          gmt7time: {
            $add: ['$created_time', millisecondsFromUTC]
          }
        }
      },
      {
        $group: {
          _id: { dayOfMonth: { $dayOfMonth: '$gmt7time' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.dayOfMonth': 1
        }
      }
    ];

    const dbResponse = await Comment.aggregate(aggregatorOpts).exec();
    const labels = dbResponse.map(function(value, index) {
      return `${value._id.dayOfMonth}`;
    });
    const data = dbResponse.map(function(value, index) {
      return value.count;
    });

    return {
      labels: labels,
      data: data
    };
  } catch (error) {
    return {
      labels: [],
      data: []
    };
  }
}

module.exports.getCommentMonth = async function getCommentMonth() {
  try {
    const millisecondsFromUTC = 7 * 60 * 60 * 1000; //PST is +7 hours from UTC
    const aggregatorOpts = [
      {
        $match: {
          is_deleted: { $ne: true }
        }
      },
      {
        $project: {
          gmt7time: {
            $add: ['$created_time', millisecondsFromUTC]
          }
        }
      },
      {
        $group: {
          _id: { year: { $year: '$gmt7time' }, month: { $month: '$gmt7time' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ];

    const dbResponse = await Comment.aggregate(aggregatorOpts).exec();
    const labels = dbResponse.map(function(value, index) {
      return `${value._id.month}/${value._id.year}`;
    });
    const data = dbResponse.map(function(value, index) {
      return value.count;
    });

    return {
      labels: labels,
      data: data
    };
  } catch (error) {
    return {
      labels: [],
      data: []
    };
  }
}
