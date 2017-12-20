const { ServerError } = require('../helpers/server');
const { Setting } = require('../models');

function findLastUpdated() {
  return Setting.findById('last_updated', { _id: 1, value: 1 }, { lean: 1 }).exec();
}

module.exports = {
  findLastUpdated
};
