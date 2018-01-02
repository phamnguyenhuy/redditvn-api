const Attachment = `
  type AttachmentConnection {
    edges: [AttachmentEdge]
    pageInfo: PageInfo!
    totalCount: Int
  }

  type AttachmentEdge {
    cursor: String!
    node: Attachment!
  }

  # Đính kèm trong bài viết
  type Attachment @cacheControl(maxAge: 240) {
    # Đường dẫn tới tệp đính kèm
    url: String
    # Ảnh nhỏ đại diện
    src: String
    # Loại tập tin (image|animated_image|video|share|album)
    type: String
  }
`;

module.exports = () => [Attachment];
