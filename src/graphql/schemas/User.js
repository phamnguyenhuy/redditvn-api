const User = `
  input UserFilter {
    OR: [UserFilter!]
    # Tìm kiếm theo tên thành viên
    q: String
  }

  enum UserOrderBy {
    posts_count_DESC,
    comments_count_DESC
  }

  type UserConnection {
    edges: [UserEdge]
    pageInfo: PageInfo!
    totalCount: Int
  }

  type UserEdge {
    cursor: String!
    node: User!
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

  type U implements Node @cacheControl(maxAge: 240) {
    id: ID!
    comment_karma: Int
    icon_img: String
    link_karma: Int
    name: String
  }
`;

module.exports = () => [User];
