const { makeExecutableSchema } = require('graphql-tools');

const { Resolvers } = require('./resolvers/index');

const Schema = [`

  # declare custom scalars
  scalar Date

  # Loại đếm
  enum CountType {
    # Đếm bài viết
    POSTS
    # Đếm lượt thích
    LIKES
    # Đếm bình luận
    COMMENTS
    # Đếm thành viên
    USERS
    # Đếm sub-reddit
    SUBREDDITS
  }

  # Loại biểu đồ
  enum ChartType {
    # Bài viết
    POSTS
    # Bình luận
    COMMENTS
  }

  # Loại nhóm biểu đồ
  enum ChartGroup {
    # Theo giờ
    HOUR
    # Theo thứ
    DAY_OF_WEEK
    # Theo ngày
    DAY_OF_MONTH
    # Theo tháng
    MONTH
  }

  # Kết quả biểu đồ
  type ChartResult {
    # Nhãn
    label: [String]
    # Số liệu
    data: [Int]
  }

  input ConnectionInput {
    first: Int = 10
    after: String
    last: Int
    before: String
  }

  type PostConnection {
    edges: [PostEdge]
    pageInfo: PageInfo!
  }

  type PostEdge {
    cursor: String!
    node: Post!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # Đính kèm trong bài viết
  type Attachment {
    # Đường dẫn tới tệp đính kèm
    url: String
    # Ảnh nhỏ đại diện
    src: String
    # Loại tập tin (image|gif|video|share)
    type: String
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
    posts(limit: Int): [Post]
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
    attachments: [Attachment]
    # Bình luận
    comments: [Comment]
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
  }

  # Sub-reddit
  type SubReddit {
    # Mã sub-reddit
    _id: String,
    # Số lượng bài viết
    posts_count: Int
  }

  # Kết quả thành viên nhiều bình luận nhất
  type UserTopResult {
    # Thành viên
    user: User,
    # Số lượng bài viết
    posts_count: Int
  }

  # Danh sách top
  type Top {
    # Bài nhiều lượt thích nhất
    likes: [Post]
    # Bài nhiều bình luận nhất
    commentes: [Post]
    # Thành viên viết nhiều bài nhất
    user_posts: [UserTopResult]
    # Sub-reddit nhiều bài nhất
    subreddit: [SubReddit]
  }

  # Truy vấn
  type Query {
    # Lấy một thành viên
    user(
      # Mã thành viên
      id: String!
    ): User

    # Lấy danh sách thành viên
    users(
      # Tìm kiếm theo tên thành viên
      q: String
      # Trang hiện tại
      page: Int = 1
      # Giới hạn trên một trang
      limit: Int = 10
    ): [User]

    # Lấy một bài viết
    post(
      # Mã bài viết
      id: String!
    ): Post

    # Lấy danh sách bài viết
    posts(
      postConnection: ConnectionInput
      # Bài viết của user nào
      user: String
      # Bài viết có từ khóa
      q: String
      # Bài viết trong sub-reddit
      r: String
      # Bài viết của user-reddit nào
      u: String
    ): PostConnection

    # Lấy bài viết ngẫu nhiên
    random(
      # Bài viết trong subreddit nào
      r: String
      # Bài viết có chứa từ khóa nào
      q: String
    ): Post

    # Lấy một bình luận
    comment(
      # Mã bình luận
      id: String
    ): Comment

    # Lấy bình luận trong bài viết
    comments(
      # Mã bài viết
      post_id: String
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
      # Trang hiện tại
      page: Int = 1
      # Giới hạn trên một trang
      limit: Int = 10
    ): [Comment]

    # Thống kê
    count(
      # Loại thống kê
      type: CountType!
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
    ): Int

    # Lấy danh sách các sub-reddit
    subreddits(
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
    ): [String]

    # Lấy danh sách top
    top(
      # Thời gian bắt đầu
      since: Int = 0
      # Thời gian kết thúc
      until: Int = 2147483647
      # Giới hạn trên một trang
      limit: Int = 10
    ): Top

    # Lấy dữ liệu để vẽ biểu đồ
    chart(
      # Nhóm theo bài viết hoặc bình luận
      type: ChartType = POSTS
      # Nhóm theo giờ, ngày trong tuần, ngày trong tháng, tháng
      group: ChartGroup = MONTH
    ): ChartResult

    # Lấy thời gian lần cuối cập nhập bài viết
    lastUpdate: Date

    # Lấy commit hiện tại (debug)
    version: String
  }

  schema {
    # Truy vấn
    query: Query
  }
`];

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

module.exports = executableSchema;
