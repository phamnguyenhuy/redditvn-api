const Count = `
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
    # Đếm thành viên viết bài
    USERS_POSTS
    # Đếm thành viên bình luận
    USERS_COMMENTS
    # Đếm sub-reddit
    SUBREDDITS
  }

  input CountFilter {
    since: Int
    until: Int
  }
`;

module.exports = () => [Count];
