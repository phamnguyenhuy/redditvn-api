const moment = require('moment');
const { Setting } = require('../src/models');

async function getLastCrawl() {
  let lastUpdate = await Setting.findById('last_updated');
  if (lastUpdate) {
    lastUpdate = moment(lastUpdate.value);
  } else {
    lastUpdate = moment().add(-12, 'hours');
  }
  return lastUpdate.add(-10, 'minutes').unix();
}

module.exports = getLastCrawl;
