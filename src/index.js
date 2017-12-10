const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const api = require('./api');

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URI, function (err, res) {
  if (err) {
    console.log('ERROR connecting to database: ' + err);
  } else {
    console.log('Succeeded connected to database');
  }
});

function checkDatabaseConnection(req, res, next) {
  if (mongoose.connection.readyState === mongoose.STATES.connected) {
    return next();
  }
  return next(new Error(`Error establishing a database connection.`));
}

function handlePaginationRequest(req, res, next) {
  req.query.page = (typeof req.query.page === 'string') ? parseInt(req.query.page, 10) || 1 : 1;
  req.query.limit = (typeof req.query.limit === 'string') ? parseInt(req.query.limit, 10) || 0 : 10;
  next();
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', checkDatabaseConnection, handlePaginationRequest, api);

if (process.env.USE_REACT_FRONTEND) {
  const reactFrontendDir = process.env.REACT_FRONTEND_DIR || 'build';

  // Serve static assets
  app.use(express.static(path.resolve(__dirname, '..', reactFrontendDir)));

  // Always return the main index.html, so react-router render the route in the client
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', reactFrontendDir, 'index.html'));
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  const errCode = err.status || 500;
  return res.status(errCode).json(err);
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log('Server API listening on %d', server.address().port);
});
