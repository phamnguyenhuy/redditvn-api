const SubReddit = `
#  Sub-reddit
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

  type R @cacheControl(maxAge: 240) {
    display_name: String
    accounts_active: Int
    icon_img: String
    subscribers: Int
  }
`;

module.exports = () => [SubReddit];
