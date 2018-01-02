const User = `
  input UserFilter {
    OR: [UserFilter!]
    # Tìm kiếm theo tên thành viên
    q: String
  }

  type UserConnection {
    edges: [UserEdge]
    pageInfo: PageInfo!
  }

  type UserEdge {
    cursor: String!
    node: User!
    totalCount: Int
  }

  # Thành viên
  type User implements Node @cacheControl(maxAge: 60) {
    id: ID!
    _id: String

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

  type U @cacheControl(maxAge: 240) {
    comment_karma: Int
    icon_img: String
    link_karma: Int
    name: String
  }
`;

module.exports = () => [User];
