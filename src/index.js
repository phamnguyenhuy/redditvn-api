require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');
const morgan = require('morgan');
const log = require('./helpers/log');
const passport = require('passport');
const databases = require('./databases');

const { ServerError } = require('./helpers/server');
const compression = require('compression');

const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const executableSchema = require('./graphql/schema');
const { Engine } = require('apollo-engine');

console.log('NODE_ENV=' + process.env.NODE_ENV);

const GRAPHQL_PATH = process.env.GRAPHQL_PATH || '/graphql';
const GRAPHIQL_PATH = process.env.GRAPHIQL_PATH || '/graphiql';
const PORT = process.env.PORT || 3000;

// Database
databases.mongodb();

// Web API
const app = express();

// Apollo Engine
if (process.env.ENGINE_API_KEY) {
  const engine = new Engine({
    engineConfig: {
      apiKey: process.env.ENGINE_API_KEY,
      stores: [
        {
          name: 'embeddedCache',
          inMemory: {
            cacheSize: 10485760
          }
        }
      ],
      queryCache: {
        publicFullQueryStore: 'embeddedCache'
      },
      reporting: {
        debugReports: true
      },
      logging: {
        level: 'DEBUG' // Engine Proxy logging level. DEBUG, INFO, WARN or ERROR
      }
    },
    graphqlPort: PORT,
    endpoint: GRAPHQL_PATH,
    dumpTraffic: true
  });

  engine.start();
  app.use(engine.expressMiddleware());
}

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(passport.initialize());
app.use(compression());

// Logging (debug only).
app.use(
  morgan(':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
    stream: { write: msg => log.info(msg) }
  })
);

const loaders = require('./graphql/loader');

app.use(
  GRAPHQL_PATH,
  graphqlExpress(req => {
    const dataloaders = Object.keys(loaders).reduce(
      (dataloaders, loaderKey) => ({
        ...dataloaders,
        [loaderKey]: loaders[loaderKey].getLoader()
      }),
      {}
    );

    return {
      context: {
        dataloaders
      },
      schema: executableSchema,
      tracing: true,
      cacheControl: true
    };
  })
);

app.use(
  GRAPHIQL_PATH,
  graphiqlExpress({
    endpointURL: GRAPHQL_PATH,
    query: `query getPost {
  node(id: "UG9zdDo0NDc2MTU5MDU2MzU4MTc=") {
    id
    __typename
    ... on Post {
      _id
      user {
        _id
        name
        profile_pic
      }
      r
      u
      message
      created_time
      attachments {
        edges {
          node {
            url
            src
            type
          }
        }
      }
      comments(first: 10) {
        edges {
          node {
            id
            user {
              _id
              name
            }
            message
          }
        }
      }
    }
  }
}`
  })
);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new ServerError('the page you requested does not exist', 404));
});

// Error-handler.
app.use((err, req, res, next) => {
  // Expected errors always throw ServerError.
  // Unexpected errors will either throw unexpected stuff or crash the application.
  if (Object.prototype.isPrototypeOf.call(ServerError.prototype, err)) {
    return res.status(err.code || 500).json({
      error: {
        message: err.message,
        type: 'ServerError',
        code: err.code
      }
    });
  }

  log.error('~~~ Unexpected error exception start ~~~');
  log.error(req);
  log.error(err);
  log.error('~~~ Unexpected error exception end ~~~');

  return res.status(500).json({
    error: {
      message: err.message || 'something when wrong...',
      type: err.type || 'UnexpectedException',
      code: err.code || 500
    }
  });
});

// Server

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

server.listen(PORT, () => {
  log.info(`API listening on port ${server.address().port}`);
});

process.on('SIGINT', function() {
  db.stop(function(err) {
    process.exit(err ? 1 : 0);
  });
});

module.exports = server;
