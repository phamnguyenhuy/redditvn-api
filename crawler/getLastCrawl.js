const moment = require('moment');
const { Setting } = require('../src/models');

async function getLastCrawl() {
  let lastUpdated = await Setting.findById('last_updated');
  if (lastUpdated) {
    lastUpdated = moment(lastUpdated.value);
  } else {
    lastUpdated = moment().add(-12, 'hours');
  }
  return lastUpdated.add(-10, 'minutes').unix();
}

module.exports = getLastCrawl;
