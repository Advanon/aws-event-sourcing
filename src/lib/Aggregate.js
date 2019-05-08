const NotImplementedError = require("./NotImplementedError");
const IllegalEventNumberError = require("./IllegalEventNumberError");
const { v4 } = require("uuid");
const { query, add, create } = require("./Repository");
const Resource = require("./Resource");

class Aggregate extends Resource {
  constructor(options) {
    super();
    this._id = (options && options.id) || v4();
    this.version = 0;
    this.table = options && options.table;
  }

  get id() {
    return this._id;
  }

  async events() {
    return query(this.table, this.id);
  }

  async hydrate(fromEvents) {
    const events = fromEvents || (await this.events());
    this.apply(events.filter(event => event.number > this.version));
  }

  async commit(event) {
    await this.hydrate();
    await this.apply([event]);
    if (this.version === 1 && event.number === 1) {
      return create(this.table, this.id, event);
    }
    if (this.version === event.number) {
      return add(this.table, this.id, event);
    }
    throw new IllegalEventNumberError();
  }

  apply(events) {
    events.forEach(event => {
      const methodName = `on${event.type}`;
      if (this[methodName]) {
        this[methodName](event);
        this.version++;
      } else {
        throw new IllegalEventArgument(event);
      }
    });
  }
}

module.exports = Aggregate;
