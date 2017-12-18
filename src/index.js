require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');
const routes = require('./routes');
const morgan = require('morgan');
const log = require('./helpers/log');

const databases = require('./databases');


// Database
databases.mongodb();

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging (debug only).
app.use(morgan('combined', { stream: { write: msg => log.info(msg) } }));

// URLs.
app.use('/', routes);

// Server
const port = process.env.PORT || 3000;
let server;
if (process.env.RUN_HTTP === 'true') {
  server = http.createServer(app);
} else {
  if (!process.env.HTTPS_CERT_FILE || !process.env.HTTPS_KEY_FILE) {
    console.log('You need config ssl certificates.');
    return process.exit(1);
  }
  const options = {
    cert: fs.readFileSync(process.env.HTTPS_CERT_FILE),
    key: fs.readFileSync(process.env.HTTPS_KEY_FILE)
  };
  server = https.createServer(options, app);
}

server.listen(port, () => {
  log.info('-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-');
  log.info(`  API listening on port ${server.address().port}`);
  log.info('-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-·-');
});

module.exports = server;
