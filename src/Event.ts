import { NotImplementedError } from './errors';

export default class Event {
  get number(): string | number {
    throw new NotImplementedError();
  }
  get type(): string {
    throw new NotImplementedError();
  }
  get created(): string {
    throw new NotImplementedError();
  }
}
