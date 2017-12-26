const User = `
  type UserConnection {
    edges: [UserEdge]
    pageInfo: PageInfo!
  }

  type UserEdge {
    cursor: Cursor!
    node: User!
  }

  # Thành viên
  type User {
    # Mã thành viên
    _id: String # id of user

    # Tên thành viên
    name: String # name of user

    # Ảnh đại diện
    profile_pic(size: Int): String

    # Số lượng bài viết
    posts_count: Int

    # Số lượng bình luận
    comments_count: Int

    # Danh sách bài viết
    posts(
      first: Int = 10
      after: Cursor
      last: Int
      before: Cursor
    ): PostConnection

    # Bình luận của thành viên
    comments(
      first: Int = 10
      after: Cursor
      last: Int
      before: Cursor
    ): CommentConnection
  }
`;

module.exports = () => [User];
