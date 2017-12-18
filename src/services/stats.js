const { ServerError } = require('../helpers/server');
const { getChart } = require('../helpers/stats');

module.exports.findStatsChart = (type, group) => {
  return getChart(type, group);
}
