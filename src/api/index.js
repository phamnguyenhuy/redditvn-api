const express = require('express');
const home = require('./home');
const post = require('./post');
const stats = require('./stats');
const user = require('./user');

const router = express.Router();

router.use(home);
router.use(post);
router.use(stats);
router.use(user);

module.exports = router;
