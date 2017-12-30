const Post = `
  type PostConnection {
    edges: [PostEdge]
    pageInfo: PageInfo!
  }

  type PostEdge {
    cursor: String!
    node: Post!
  }

  # Bài viết
  type Post @cacheControl(maxAge: 60) {
    # Mã bài viết
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
