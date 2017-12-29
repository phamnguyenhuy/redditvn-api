const PageInfo = `
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
    totalCount: Int
  }
`;

module.exports = () => [PageInfo];
