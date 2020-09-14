export class IllegalEventError extends Error {
  constructor() {
    super();
    this.name = 'IllegalEventError';
  }
}

export class IllegalEventNumberError extends Error {
  version: string | number;
  number: string | number;

  constructor(version: string | number, number: string | number) {
    super();
    this.version = version;
    this.number = number;
    this.name = 'IllegalEventNumberError';
  }
}

export class NotImplementedError extends Error {
  constructor() {
    super('NotImplemented');
    this.name = 'NotImplementedError';
  }
}
