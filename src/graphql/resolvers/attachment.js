const AttachmentResolver = {
  AttachmentConnection: {},
  AttachmentEdge: {
    cursor(attachment) {
      return { value: attachment.url.toString() };
    },
    node(attachment) {
      return attachment;
    }
  },
  Attachment: {}
};

module.exports = AttachmentResolver;
