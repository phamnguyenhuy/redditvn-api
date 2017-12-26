const Attachment = `
  type AttachmentConnection {
    edges: [AttachmentEdge]
    pageInfo: PageInfo!
  }

  type AttachmentEdge {
    cursor: Cursor!
    node: Attachment!
  }

  # Đính kèm trong bài viết
  type Attachment {
    # Đường dẫn tới tệp đính kèm
    url: String
    # Ảnh nhỏ đại diện
    src: String
    # Loại tập tin (image|animated_image|video|share|album)
    type: String
  }
`;

module.exports = () => [Attachment];
