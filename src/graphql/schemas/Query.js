const Query = `
  # Truy vấn
  type Query {
    # Lấy dữ liệu để vẽ biểu đồ
    chart(
      # Nhóm theo bài viết hoặc bình luận
      type: ChartType!
      # Nhóm theo giờ, ngày trong tuần, ngày trong tháng, tháng
      group: ChartGroup!
    ): ChartResult

    # Thống kê
    count(
      # Loại thống kê
      type: CountType!
      since: Int
      until: Int
    ): Int

    # Lấy thời gian lần cuối cập nhập bài viết
    lastUpdated: Date

    node(id: ID!): Node

    nodes(ids: [ID!]!): [Node]!

    # Lấy danh sách bài viết
    posts(
      filter: PostFilter
      orderBy: PostOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): PostConnection

    # Lấy bài viết ngẫu nhiên
    random(
      filter: PostFilter
    ): Post

    # Lấy danh sách các sub-reddit
    subreddits(
      since: Int
      until: Int
    ): [String]

    # Lấy danh sách top
    top: Top

    # Lấy danh sách thành viên
    users(
      filter: UserFilter
      orderBy: UserOrderBy
      first: Int
      after: String
      last: Int
      before: String
    ): UserConnection

    # Lấy commit hiện tại (debug)
    version: String @deprecated
  }
`;

module.exports = () => [Query];
