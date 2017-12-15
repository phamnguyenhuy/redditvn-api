const subredditRegex = /[r]\/([a-z0-9\-_]+)/i;

regexpEscape = (s) => {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

makeSearchQuery = (subreddit, querystring) => {
  let r = subreddit || '';
  r = r.toLowerCase();

  let q = querystring || '';
  q = q.toLowerCase();
  if (q.startsWith('regex:')) {
    q = q.substr(6);
  } else {
    q = regexpEscape(q);
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

findSubreddit = (s) => {
  if (!s) return null;

  result = s.match(subredditRegex);
  if (result && result.length >= 2) return result[1].toLowerCase();
  return null;
}

module.exports = {
  regexpEscape,
  makeSearchQuery,
  findSubreddit
}
