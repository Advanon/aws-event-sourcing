import { IllegalEventNumberError, IllegalEventError } from './errors';
import { v4 } from 'uuid';

import { query, add, create } from './repository';
import Resource from './Resource';
import Event from './Event';

const UNDEFINED_TABLE_NAME = 'undefined';

export default class Aggregate extends Resource {
  _id: string;
  version: number;
  table: string;

  constructor(options?: { id: string, table: string }) {
    super();
    this._id = (options && options.id) || v4();
    this.version = 0;
    this.table = (options && options.table) || UNDEFINED_TABLE_NAME;
  }

  get id(): string {
    return this._id;
  }

  async events(): Promise<Array<Event>> {
    return query(this.table, this.id);
  }

  async hydrate(fromEvents?: Array<Event>): Promise<void> {
    const events = fromEvents || (await this.events());
    this.apply(events.filter((event) => event.number > this.version));
  }

  async commit(event: Event): Promise<void> {
    await this.hydrate();

    this.apply([event]);

    if (this.version === 1 && event.number === 1) {
      return create(this.table, this.id, event);
    }
    if (this.version === event.number) {
      return add(this.table, this.id, event);
    }
    throw new IllegalEventNumberError(this.version, event.number);
  }

  apply(events: Array<Event>): void {
    events.forEach((event) => {
      const methodName = `on${event.type}`;
      if (this[methodName]) {
        this[methodName](event);
        this.version++;
      } else {
        throw new IllegalEventError();
      }
    });
  }
}
