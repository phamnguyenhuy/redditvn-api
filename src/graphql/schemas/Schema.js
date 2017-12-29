const Schema = `
  # declare custom scalars
  scalar Date

  schema {
    # Truy vấn
    query: Query
  }
`;

module.exports = () => [Schema];
