const Query = `
  # Truy vấn
  type Query {
    # Lấy một thành viên
    user(
      # Mã thành viên
      id: String!
    ): User

    # Lấy danh sách thành viên
    users(
      # Tìm kiếm theo tên thành viên
      q: String
      first: Int
      after: Cursor
      last: Int
      before: Cursor
    ): UserConnection

    # Lấy một bài viết
    post(
      # Mã bài viết
      id: String!
    ): Post

    # Lấy danh sách bài viết
    posts(
      first: Int
      after: Cursor
      last: Int
      before: Cursor
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
      # Bài viết của user nào
      user: String
      # Bài viết có từ khóa
      q: String
      # Bài viết trong sub-reddit
      r: String
      # Bài viết của user-reddit nào
      u: String
    ): PostConnection

    # Lấy bài viết ngẫu nhiên
    random(
      # Bài viết trong subreddit nào
      r: String
      # Bài viết có chứa từ khóa nào
      q: String
    ): Post

    # Lấy một bình luận
    comment(
      # Mã bình luận
      id: String
    ): Comment

    # Thống kê
    count(
      # Loại thống kê
      type: CountType!
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
    ): Int

    # Lấy danh sách các sub-reddit
    subreddits(
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
    ): [String]

    # Lấy danh sách top
    top: Top

    # Lấy dữ liệu để vẽ biểu đồ
    chart(
      # Nhóm theo bài viết hoặc bình luận
      type: ChartType = POSTS
      # Nhóm theo giờ, ngày trong tuần, ngày trong tháng, tháng
      group: ChartGroup = MONTH
    ): ChartResult

    # Lấy thời gian lần cuối cập nhập bài viết
    lastUpdate: Date

    # Lấy commit hiện tại (debug)
    version: String
  }
`;

module.exports = () => [Query];
