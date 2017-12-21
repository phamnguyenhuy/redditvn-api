const debug = require('debug');

const prefix = process.env.DEBUG_LOG_PREFIX ? process.env.DEBUG_LOG_PREFIX : '';

const info = debug(`${prefix}info`);
info.log = console.info.bind(console);

const dev = debug(`${prefix}dev`);
dev.log = console.log.bind(console);

const error = debug(`${prefix}error`);

module.exports = {
  info,
  dev,
  error,
};
