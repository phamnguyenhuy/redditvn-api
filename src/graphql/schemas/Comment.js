const Comment = `
  type CommentConnection {
    edges: [CommentEdge]
    pageInfo: PageInfo!
  }

  type CommentEdge {
    cursor: String!
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
      first: Int
      after: String
      last: Int
      before: String
      # Thời gian bắt đầu
      since: Int
      # Thời gian kết thúc
      until: Int
    ): CommentConnection
  }
`;

module.exports = () => [Comment];
