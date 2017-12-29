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

  type R {
    display_name: String
    accounts_active: Int
    icon_img: String
    subscribers: Int
  }
`;

module.exports = () => [SubReddit];
