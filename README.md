# redditvn-api

## Installing

Install dependencies from npm:

```
npm install
```

Run backend server

```
npm run start
```

Run cron to crawl posts

```
npm run crawl
```

## Enviroment

Node.js 8.9.x

MongoDB 3.x.x

Npm 4.x.x

## Enviroment Variable

Create .env file in project folder

```
FACEBOOK_ACCESS_TOKEN
FACEBOOK_GROUP_ID
DATABASE_URI
PORT
NEWSFEED_LIMIT
NEWSFEED_MAX
RUN_HTTP
```

Example
```
FACEBOOK_ACCESS_TOKEN=************
FACEBOOK_GROUP_ID=366378530426222
DATABASE_URI=mongodb://root:root@localhost:27017/redditvn
PORT=443
NEWSFEED_LIMIT=100
NEWSFEED_MAX=300
RUN_HTTP=true
```

## API

[In apiary](https://redditvn.docs.apiary.io)
