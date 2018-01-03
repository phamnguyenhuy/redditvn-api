const Top = `
  # Danh sách top
  type Top @cacheControl(maxAge: 240) {
    # Thành viên viết nhiều bài nhất
    posts_count(
      first: Int
      since: Int
      until: Int
    ): UserConnection
  }
`;

module.exports = () => [Top];
