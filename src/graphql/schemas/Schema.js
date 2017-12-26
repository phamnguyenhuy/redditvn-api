const Schema = `
  # declare custom scalars
  scalar Date
  scalar Cursor

  schema {
    # Truy vấn
    query: Query
  }
`;

module.exports = () => [Schema];
