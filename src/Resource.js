const { NotImplementedError } = require('./errors');

class Resource {
  get id() {
    throw new NotImplementedError();
  }
}

module.exports = Resource;
