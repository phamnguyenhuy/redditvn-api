const express = require('express');

const router = express.Router();

router.use(require('./post'));
router.use(require('./stats'));
router.use(require('./user'));
router.use(require('./r'));

module.exports = router;
