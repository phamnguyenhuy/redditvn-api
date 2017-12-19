const debug = require('debug');

const prefix = process.env.DEBUG_LOG_PREFIX ? process.env.DEBUG_LOG_PREFIX : '';

const info = debug(`${prefix}info`);
const dev = debug(`${prefix}dev`);
const error = debug(`${prefix}error`);

module.exports = {
  info,
  dev,
  error,
};
