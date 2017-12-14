import mongoose from 'mongoose';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { config } from 'dotenv'

config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URI, { useMongoClient: true }, (err, res) => {
  if (err) {
    console.log('ERROR connecting to database: ' + err);
  } else {
    console.log('Succeeded connected to database');
  }
});

checkDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState === mongoose.STATES.connected) {
    return next();
  }
  return next(new Error(`Error establishing a database connection.`));
}

handlePaginationRequest = (req, res, next) => {
  req.query.page = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) || 1 : 1;
  req.query.limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) || 0 : 10;
  if (req.query.limit < 0 || 50 < req.query.limit) {
    req.query.limit = 10;
  }
  next();
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', checkDatabaseConnection, handlePaginationRequest, import('./api'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  const errCode = err.status || 500;
  return res.status(errCode).json({
    message: err.message ? err.message : 'Something when wrong...'
  });
});

const port = process.env.PORT || 3000;
let server;
if (process.env.RUN_HTTP) {
  server = http.createServer(app);
} else {
  const options = {
    cert: fs.readFileSync(process.env.HTTPS_CERT_FILE),
    key: fs.readFileSync(process.env.HTTPS_KEY_FILE)
  };
  server = https.createServer(options, app);
}

server.listen(port, () => {
  console.log('Server API listening on %d', server.address().port);
});
