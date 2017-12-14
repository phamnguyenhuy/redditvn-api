# redditvn-api

## Installing

Install dependencies from npm:

```
npm install
```

Run backend server

```
npm start
```

Run cron to crawl posts

```
node cron.js
```

## Enviroment

Node.js 8.x.x

MongoDB 3.x.x

## Enviroment Variable

Create .env file in project folder

```
FACEBOOK_ACCESS_TOKEN
FACEBOOK_GROUP_ID
DATABASE_URI
PORT
NEWSFEED_LIMIT
NEWSFEED_MAX
```

Example
```
FACEBOOK_ACCESS_TOKEN=************
FACEBOOK_GROUP_ID=366378530426222
DATABASE_URI=mongodb://root:root@localhost:27017/redditvn
PORT=443
NEWSFEED_LIMIT=100
NEWSFEED_MAX=300
```

## API

### GET /stats/count

Response:
```
{
  post_count,
  member_count,
  comment_count
}
```

### GET /stats/top

Query:

```
limit: 10 | 20 | 30
group: today | 7days | 30days | all
```

Response:
```
{
  top_users,
  top_likes,
  top_comments
}
```

### GET /stats/user

Query:

```
page
limit
```

Response:
```
{
  docs: [{
    _id,
    name,
    post_count
  }],
  total,
  limit,
  page,
  pages
}
```

### GET /stats/chart

Query:

```
type: posts | comments
group: hour | dow | dom | month
```

Response:
```
{
  chart_data: {
    label: [],
    data: []
  }
}
```

### GET /post/:post_id

Param:

```
:post_id
```

Response:
```
{
  _id,
  from: {
    id,
    name
  },
  message,
  created_time,
  comments_count,
  likes_count,
  is_deleted,
  prev_post: {
    _id
  },
  next_post: {
    _id
  }
}
```

### GET /post/:post_id/attachments

Param:

```
:post_id
```

Response:
```
[
  {
    url,
    src,
    type: image | gif | video | share
  }
]
```

### GET /post/:post_id/comments

Param:

```
:post_id
```

Response:
```
[{
  _id,
  from: {
    name
    id
  },
  created_time,
  message,
  post_id,
  replies: [{
    _id,
    parent: {
      id
    },
    from: {
      name,
      id
    },
    created_time,
    message,
    post_id
  }]
}]
```

### GET /random

Query:

```
q: query string
```

Response:

```
{
  _id
}
```

### GET /search

Query:

```
q: query string
page
limit
```

Response:
```
{
  docs: [{
    _id,
    from,
    message,
    created_time,
    comments_count,
    likes_count,
    is_deleted
  }],
  total,
  limit,
  page,
  pages
}
```

### GET /user/:user_id

Param:

```
:user_id
```

Response:

```
{
  id,
  name,
  post_count
}
```

### GET /user/:user_id/posts

Param:

```
:user_id
```

Response:

```
{
  docs: [{
    _id,
    from,
    message,
    created_time,
    comments_count,
    likes_count,
    is_deleted
  }],
  total,
  limit,
  page,
  pages
}
```