const Comment = `
  input CommentFilter {
    OR: [CommentFilter!]
    since: Int
    until: Int
    user: String
    q: String
  }

  type CommentConnection {
    edges: [CommentEdge]
    pageInfo: PageInfo!
    totalCount: Int
  }

  type CommentEdge {
    cursor: String!
    node: Comment!
  }

  # Bình luận
  type Comment implements Node @cacheControl(maxAge: 240) {
    id: ID!
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
      since: Int
      until: Int
    ): CommentConnection
  }
`;

module.exports = () => [Comment];
