const { ServerError } = require('../helpers/server');
const { getChart } = require('../helpers/stats');

function findStatsChart(type, group) {
  return getChart(type, group);
}

module.exports = {
  findStatsChart
};
