const { ServerError } = require('../helpers/server');
const { stats } = require('../services');
const { findStatsChart } = stats;

async function getStatsChart(type, group) {
  return {
    type,
    group,
    chart_data: await findStatsChart(type, group)
  };
}

module.exports = {
  getStatsChart
};
