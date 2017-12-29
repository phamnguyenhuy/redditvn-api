const User = `
  type UserConnection {
    edges: [UserEdge]
    pageInfo: PageInfo!
  }

  type UserEdge {
    cursor: String!
    node: User!
  }

  # Thành viên
  type User @cacheControl(maxAge: 240) {
    # Mã thành viên
    _id: String # id of user
    # Tên thành viên
    name: String # name of user
    # Ảnh đại diện
    profile_pic(size: Int = 64): String
    # Số lượng bài viết
    posts_count: Int
    # Số lượng bình luận
    comments_count: Int
    # Danh sách bài viết
    posts(
      first: Int
      after: String
      last: Int
      before: String
    ): PostConnection
    # Bình luận của thành viên
    comments(
      first: Int
      after: String
      last: Int
      before: String
    ): CommentConnection
  }
`;

module.exports = () => [User];
