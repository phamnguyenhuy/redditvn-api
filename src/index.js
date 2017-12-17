const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');
const { config } = require('dotenv');
const api = require('./api');
const { checkDbConnection } = require('./middleware');

config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', checkDbConnection, api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error();
  error.code = 404;
  error.message = 'the page you requested does not exist';
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  const errCode = err.code || 500;
  return res.status(errCode).json({
    error: {
      message: err.message || 'something when wrong...',
      type: err.type || 'Exception',
      code: err.code,
    }
  });
});

const port = process.env.PORT || 3000;
let server;
if (process.env.RUN_HTTP === 'true') {
  server = http.createServer(app);
} else {
  if (!process.env.HTTPS_CERT_FILE || !process.env.HTTPS_KEY_FILE) {
    console.log('You need config ssl certificates.')
    return process.exit(1);
  }
  const options = {
    cert: fs.readFileSync(process.env.HTTPS_CERT_FILE),
    key: fs.readFileSync(process.env.HTTPS_KEY_FILE)
  };
  server = https.createServer(options, app);
}

server.listen(port, () => {
  console.log('Server API listening on %d', server.address().port);

  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.DATABASE_URI, { useMongoClient: true }, (err, res) => {
    if (err) {
      console.log('ERROR connecting to database: ' + err);
    } else {
      console.log('Succeeded connected to database');
    }
  });
});
