const Post = `
  type PostConnection {
    edges: [PostEdge]
    pageInfo: PageInfo!
  }

  type PostEdge {
    cursor: Cursor!
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
      first: Int = 10
      after: Cursor
      last: Int
      before: Cursor
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
    ): CommentConnection
  }
`;

module.exports = () => [Post];
