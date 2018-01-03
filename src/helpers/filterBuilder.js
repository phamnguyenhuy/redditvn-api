function buildUserFilters({ OR = [], q }) {
  const filter = q ? { posts_count: { $gt: 0 } } : null;

  if (filter) {
    if (q) filter.name = { $regex: new RegExp(regexpEscape(q)), $options: 'i' };
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildUserFilters(OR[i]));
  }
  return filters;
}

function buildPostFilters({ OR = [], since, until, r, q, u, user }) {
  const filter = since || until || r || q || u || user ? { is_deleted: { $ne: true } } : null;

  if (filter) {
    if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
    if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
    if (r) filter.r = { $regex: `^${r}$`, $options: 'i' };
    if (u) filter.u = { $regex: `^${u}$`, $options: 'i' };
    if (q) {
      if (q.startsWith('regex:')) q = q.substr(6);
      else q = regexpEscape(q);
      filter.message = { $regex: new RegExp(q), $options: 'i' };
    }
    if (user) filter.user = user;
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildPostFilters(OR[i]));
  }
  return filters;
}

function buildCommentFilters({ OR = [], since, until, q, user }) {
  const filter = since || until || q || user ? { is_deleted: { $ne: true } } : null;

  if (filter) {
    if (since) _.set(filter, 'created_time.$gte', moment.unix(since).toDate());
    if (until) _.set(filter, 'created_time.$lt', moment.unix(until).toDate());
    if (q) {
      if (q.startsWith('regex:')) q = q.substr(6);
      else q = regexpEscape(q);
      filter.message = { $regex: new RegExp(q), $options: 'i' };
    }
    if (user) filter.user = user;
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildCommentFilters(OR[i]));
  }
  return filters;
}

module.exports = {
  buildUserFilters,
  buildPostFilters,
  buildCommentFilters
}
