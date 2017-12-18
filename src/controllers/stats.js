const { ServerError } = require('../helpers/server');
const { stats } = require('../services');
const { findStatsChart } = stats;

module.exports.getStatsChart = (type, group) => {
  return findStatsChart(type, group);
}
