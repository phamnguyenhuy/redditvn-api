const Comment = `
  type CommentConnection {
    edges: [CommentEdge]
    pageInfo: PageInfo!
  }

  type CommentEdge {
    cursor: Cursor!
    node: Comment!
  }

  # Bình luận
  type Comment {
    # Mã bình luận
    _id: String

    # Bình luận trong bài viết
    post: Post

    # Người bình luận
    user: User

    # Bình luận cha
    parent: Comment

    # Nội dung bình luận
    message: String

    # Thời gian bình luận
    created_time: Date

    # Bình luận phản hồi
    replies(
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

module.exports = () => [Comment];