const Query = `
  # Truy vấn
  type Query {
    node(id: ID!): Node

    nodes(ids: [ID!]!): [Node]!

    # Lấy danh sách thành viên
    users(
      filter: UserFilter
      first: Int
      after: String
      last: Int
      before: String
    ): UserConnection

    # Lấy danh sách bài viết
    posts(
      filter: PostFilter
      first: Int
      after: String
      last: Int
      before: String
    ): PostConnection

    # Lấy bài viết ngẫu nhiên
    random(
      filter: PostFilter
    ): Post

    # Thống kê
    count(
      # Loại thống kê
      type: CountType!
      since: Int
      until: Int
    ): Int

    # Lấy danh sách các sub-reddit
    subreddits(
      since: Int
      until: Int
    ): [String]

    # Lấy danh sách top
    top: Top

    # Lấy dữ liệu để vẽ biểu đồ
    chart(
      # Nhóm theo bài viết hoặc bình luận
      type: ChartType! = POSTS
      # Nhóm theo giờ, ngày trong tuần, ngày trong tháng, tháng
      group: ChartGroup! = MONTH
    ): ChartResult

    # Lấy thông tin subreddit
    r(displayName: String!): R

    # Lấy thông tin user
    u(name: String!): U

    # Lấy thời gian lần cuối cập nhập bài viết
    lastUpdated: Date

    # Lấy commit hiện tại (debug)
    version: String
  }
`;

module.exports = () => [Query];
