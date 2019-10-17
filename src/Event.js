const { NotImplementedError } = require('./errors');

class Event {
  get number() {
    throw new NotImplementedError();
  }
  get type() {
    throw new NotImplementedError();
  }
  get created() {
    throw new NotImplementedError();
  }
}

module.exports = Event;
