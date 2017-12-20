const git = require('git-last-commit');
const { setting } = require('../services')

function getVersion() {
  return new Promise((resolve, reject) => {
    git.getLastCommit(function(err, commit) {
      if (err) {
        return reject(err);
      }
      return resolve(commit);
    });
  });
}

function getLastUpdated() {
  return setting.findLastUpdated();
}

module.exports = {
  getVersion,
  getLastUpdated
};
