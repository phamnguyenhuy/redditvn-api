const Top = `
  # Danh sách top
  type Top @cacheControl(maxAge: 240) {
    # Bài nhiều lượt thích nhất
    likes(
      first: Int = 10
      after: Cursor
      last: Int
      before: Cursor
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
    ): PostConnection

    # Bài nhiều bình luận nhất
    comments(
      first: Int = 10
      after: Cursor
      last: Int
      before: Cursor
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
    ): PostConnection

    # Thành viên viết nhiều bài nhất
    posts_count(
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
      first: Int = 10
    ): UserConnection

    # Sub-reddit nhiều bài nhất
    subreddit(
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
      first: Int = 10
    ): SubRedditConnection
  }
`;

module.exports = () => [Top];
