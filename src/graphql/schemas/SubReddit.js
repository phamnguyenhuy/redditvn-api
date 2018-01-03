const SubReddit = `
  input SubRedditFilter {
    OR: [UserFilter!]
    since: Int
    until: Int
  }

  type SubRedditConnection {
    edges: [SubRedditEdge]
    pageInfo: PageInfo!
    totalCount: Int
  }

  type SubRedditEdge {
    cursor: String!
    node: SubReddit!
  }

  type SubReddit @cacheControl(maxAge: 240) {
    # Mã sub-reddit
    _id: String,
    # Số lượng bài viết
    posts_count: Int
  }

  type R implements Node @cacheControl(maxAge: 240) {
    id: ID!
    display_name: String
    accounts_active: Int
    icon_img: String
    subscribers: Int
  }
`;

module.exports = () => [SubReddit];
