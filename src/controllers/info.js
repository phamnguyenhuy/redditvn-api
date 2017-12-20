const git = require('git-last-commit');

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

module.exports = {
  getVersion
};
