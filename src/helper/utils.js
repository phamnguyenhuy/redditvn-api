module.exports.regexp_escape = (s) => {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports.makeSearchQuery = (subreddit, querystring) => {
  let r = subreddit || '';
  r = r.toLowerCase();

  let q = querystring || '';
  q = q.toLowerCase();
  if (q.startsWith('regex:')) {
    q = q.substr(6);
  } else {
    q = regexp_escape(q);
  }

  let query = {};
  if (q) {
    query.message = {
      $regex: new RegExp(q),
      $options: 'i'
    };
  }
  if (r) {
    query.r = {
      $in: [r]
    };
  }

  return query;
}
