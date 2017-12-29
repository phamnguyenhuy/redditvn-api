const SubReddit = `
#  Sub-reddit
  type SubRedditConnection {
    edges: [SubRedditEdge]
    pageInfo: PageInfo!
  }

  type SubRedditEdge {
    cursor: String!
    node: SubReddit!
  }

  type SubReddit {
    # Mã sub-reddit
    _id: String,
    # Số lượng bài viết
    posts_count: Int
  }
`;

module.exports = () => [SubReddit];
