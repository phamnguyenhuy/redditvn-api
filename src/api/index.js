const express = require('express');
const router = express.Router();

router.use(require('./home'));
router.use(require('./post'));
router.use(require('./stats'));
router.use(require('./user'));

module.exports = router;