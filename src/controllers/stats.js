const { ServerError } = require('../helpers/server');
const { stats } = require('../services');
const { findStatsChart } = stats;

module.exports.getStatsChart = async (type, group) => {
  return {
    type,
    group,
    chart_data: await findStatsChart(type, group)
  };
};
