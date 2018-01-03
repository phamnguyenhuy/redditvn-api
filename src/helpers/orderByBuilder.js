function orderByUserBuilder(orderBy, orderFieldName = 'posts_count', sortType = -1) {
  if (orderBy) {
    const lastDash = orderBy.lastIndexOf('_');
    orderFieldName = orderBy.substr(0, lastDash);
    sortType = orderBy.substr(lastDash + 1) === 'ASC' ? 1 : -1;
  }

  return {
    orderFieldName,
    sortType
  }
}

function orderByPostBuilder(orderBy, orderFieldName = 'created_time', sortType = -1) {
  if (orderBy) {
    const lastDash = orderBy.lastIndexOf('_');
    orderFieldName = orderBy.substr(0, lastDash);
    sortType = orderBy.substr(lastDash + 1) === 'ASC' ? 1 : -1;
  }

  return {
    orderFieldName,
    sortType
  }
}

module.exports = {
  orderByUserBuilder,
  orderByPostBuilder
}
