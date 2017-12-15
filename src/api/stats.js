const express = require('express');
const { getStats } = require('../helper/stats');

const router = express.Router();

router.get('/stats/chart', async (req, res, next) => {
  try {
    const type = req.query.type || 'posts';
    const group = req.query.group || 'month';

    const stats = await getStats(type, group);

    return res.status(200).json({
      type,
      group,
      chart_data: stats
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
