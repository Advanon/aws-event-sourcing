const NotImplementedError = require("./NotImplementedError");

class AggregateOptions {
  get id() {
    throw new NotImplementedError();
  }
  get table() {
    throw new NotImplementedError();
  }
}

module.exports = AggregateOptions;
