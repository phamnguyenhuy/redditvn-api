const moment = require('moment');
const { Setting } = require('../models');

module.exports = async () => {
  let lastUpdate = await Setting.findById('last_updated');
  if (lastUpdate) {
    lastUpdate = moment(lastUpdate.value);
  } else {
    lastUpdate = moment().add(-6, 'hours');
  }
  return lastUpdate.add(-30, 'minutes').unix();
};
