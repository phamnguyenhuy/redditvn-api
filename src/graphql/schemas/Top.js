const Top = `
  # Danh sách top
  type Top {
    # Bài nhiều lượt thích nhất
    likes(
      # Thời gian bắt đầu
      since: Int = 0

      # Thời gian kết thúc
      until: Int = 2147483647

      first: Int = 10

      after: Cursor

      last: Int

      before: Cursor
    ): PostConnection

    # Bài nhiều bình luận nhất
    commentes(
      # Thời gian bắt đầu
      since: Int = 0

      # Thời gian kết thúc
      until: Int = 2147483647

      first: Int = 10

      after: Cursor

      last: Int

      before: Cursor
    ): PostConnection

    # Thành viên viết nhiều bài nhất
    user_posts(
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
