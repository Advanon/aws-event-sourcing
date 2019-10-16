const NotImplementedError = require('./NotImplementedError');

class Resource {
  get id() {
    throw new NotImplementedError();
  }
}

module.exports = Resource;
