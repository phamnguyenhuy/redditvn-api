const git = require('git-last-commit');

module.exports.getVersion = () => {
  return new Promise((resolve, reject) => {
    git.getLastCommit(function(err, commit) {
      resolve(commit);
    });
  });
}
