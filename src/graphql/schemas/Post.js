const Post = `
  input PostFilter {
    OR: [PostFilter!]
    since: Int
    until: Int
    # Bài viết của user nào
    user: String
    # Bài viết có từ khóa
    q: String
    # Bài viết trong sub-reddit
    r: String
    # Bài viết của user-reddit nào
    u: String
  }

  type PostConnection {
    edges: [PostEdge]
    pageInfo: PageInfo!
    totalCount: Int
  }

  type PostEdge {
    cursor: String!
    node: Post!
  }

  # Bài viết
  type Post implements Node @cacheControl(maxAge: 60) {
    id: ID!
    _id: String

    # Thành viên viết bài
    user: User
    # Sub-reddit
    r: String
    # User-reddit
    u: String
    # Nội dung bài viết
    message(limit: Int): String
    # Thời gian viết bài
    created_time: Date
    # Số lượng bình luận
    comments_count: Int
    # Số lượng lượt thích
    likes_count: Int
    # Bài viết đã bị xóa chưa
    is_deleted: Boolean
    # Đính kèm trong bài viết
    attachments: AttachmentConnection
    # Bình luận trong bài viết
    comments(
      first: Int
      after: String
      last: Int
      before: String
      since: Int
      until: Int
    ): CommentConnection
  }
`;

module.exports = () => [Post];
