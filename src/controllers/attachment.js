const { ServerError } = require('../helpers/server');
const { facebook } = require('../services');
const { findAttachmentsByPostId } = facebook;

function getAttachmentsByPostId(post_id) {
  return findAttachmentsByPostId(post_id);
}

module.exports = {
  getAttachmentsByPostId
};
