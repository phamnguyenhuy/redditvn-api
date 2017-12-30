const Top = `
  # Danh sách top
  type Top @cacheControl(maxAge: 240) {
    # Bài nhiều lượt thích nhất
    likes(
      first: Int
      after: String
      last: Int
      before: String
      since: Int
      until: Int
    ): PostConnection

    # Bài nhiều bình luận nhất
    comments(
      first: Int
      after: String
      last: Int
      before: String
      since: Int
      until: Int
    ): PostConnection

    # Thành viên viết nhiều bài nhất
    posts_count(
      since: Int
      until: Int
      first: Int
    ): UserConnection

    # Sub-reddit nhiều bài nhất
    subreddit(
      since: Int
      until: Int
      first: Int
    ): SubRedditConnection
  }
`;

module.exports = () => [Top];
