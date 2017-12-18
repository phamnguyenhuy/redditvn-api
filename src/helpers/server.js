class ServerError {
  constructor(message, code = 500) {
    this.message = message;
    this.code = code;
    this.type = 'ServerError';
  }
}

module.exports = {
  ServerError,
};
