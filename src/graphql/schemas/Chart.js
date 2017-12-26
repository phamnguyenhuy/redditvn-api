const Chart = `
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
`;

module.exports = () => [Chart];
