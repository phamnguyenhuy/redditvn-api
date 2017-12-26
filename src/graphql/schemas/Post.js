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
  type Post {
    # Mã bài viết
    _id: String

    # Thành viên viết bài
    user: User

    # Sub-reddit
    r: String

    # User-reddit
    u: String

    # Nội dung bài viết
    message: String

    # Thời gian viết bài
    created_time: Date

    # Số lượng bình luận
    comments_count: Int

    # Số lượng lượt thích
    likes_count: Int

    # Bài viết đã bị xóa chưa
    is_deleted: Boolean

    # Đính kèm trong bài viết
    attachments(
      first: Int
      after: Cursor
      last: Int
      before: Cursor
    ): AttachmentConnection

    # Bình luận trong bài viết
    comments(
      first: Int = 10
      after: Cursor
      last: Int
      before: Cursor
    ): CommentConnection
  }
`;

module.exports = () => [Post];
