const { ServerError } = require('../helpers/server');
const { facebook } = require('../services');
const { findAttachmentsByPostId } = facebook;

module.exports.getAttachmentsByPostId = (post_id) => {
  return findAttachmentsByPostId(post_id);
}
