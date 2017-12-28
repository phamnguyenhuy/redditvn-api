const Top = `
  # Danh sách top
  type Top @cacheControl(maxAge: 240) {
    # Bài nhiều lượt thích nhất
    likes(
      first: Int
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
      first: Int
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
      since: Int
      # Thời gian kết thúc
      until: Int = 2147483647
      first: Int
    ): UserConnection

    # Sub-reddit nhiều bài nhất
    subreddit(
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
      first: Int
    ): SubRedditConnection
  }
`;

module.exports = () => [Top];
