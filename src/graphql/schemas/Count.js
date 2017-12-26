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
    # Đếm sub-reddit
    SUBREDDITS
  }
`;

module.exports = () => [Count];
