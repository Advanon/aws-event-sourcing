import { NotImplementedError } from './errors';

export default class Resource {
  get id(): string {
    throw new NotImplementedError();
  }
}
