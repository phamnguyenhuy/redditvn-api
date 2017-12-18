const debug = require('debug');

const prefix = process.env.LOG_PREFIX ? process.env.LOG_PREFIX : '';

const info = debug(`${prefix}info`);
const dev = debug(`${prefix}dev`);
const error = debug(`${prefix}error`);

module.exports = {
  info,
  dev,
  error,
};
