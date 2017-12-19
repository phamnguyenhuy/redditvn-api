const { ServerError } = require('../helpers/server');
const FB = require('fb');

const fb = new FB.Facebook();
fb.options({ Promise: Promise });

module.exports.findAttachmentsByPostId = async post_id => {
  const images = [];
  const post = await fb.api(post_id, {
    fields: ['id', 'message', 'object_id', 'likes', 'attachments'],
    access_token: process.env.FACEBOOK_ACCESS_TOKEN
  });

  // attachment
  if (post.attachments && post.attachments.data) {
    for (const attachment of post.attachments.data) {
      if (attachment.type === 'photo' && attachment.media) {
        images.push({
          url: attachment.url,
          src: attachment.media.image.src,
          type: 'image'
        });
      } else if (attachment.type.includes('animated_image') && attachment.media) {
        images.push({
          url: attachment.url,
          src: attachment.media.image.src,
          type: 'gif'
        });
      } else if (attachment.type.includes('video') && attachment.media) {
        images.push({
          url: attachment.url,
          src: attachment.media.image.src,
          type: 'video'
        });
      } else if (attachment.type === 'share' && attachment.media) {
        images.push({
          url: attachment.url,
          src: attachment.media.image.src,
          type: 'share'
        });
      } else if (attachment.type === 'album' && attachment.subattachments && attachment.subattachments.data) {
        for (const subattachment of attachment.subattachments.data) {
          images.push({
            url: subattachment.url,
            src: subattachment.media.image.src,
            type: 'image'
          });
        }
      }
    }
  }

  return images;
}

module.exports.findUserPicture = (user_id, size = 64) => {
  if (user_id.startsWith('fb-')) {
    user_id = user_id.substr(3);
  }

  return `https://graph.facebook.com/${user_id}/picture?type=square&redirect=true&width=${size}&height=${size}`
}
