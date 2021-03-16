class ResponseHandlerInterface {
  respondOK(data) {
    this.data = data;
    throw new Error('not implemented');
  }

  respondFailure(statusCode, statusMessage) {
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    throw new Error('not implemented');
  }

}

module.exports = {ResponseHandlerInterface};
