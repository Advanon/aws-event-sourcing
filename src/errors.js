class IllegalEventError extends Error {
  constructor() {
    super();
    this.name = 'IllegalEventError';
  }
}

class IllegalEventNumberError extends Error {
  constructor(version, number) {
    super();
    this.version = version;
    this.number = number;
    this.name = 'IllegalEventNumberError';
  }
}

class NotImplementedError extends Error {
  constructor() {
    super('NotImplemented');
    this.name = 'NotImplementedError';
  }
}

module.exports = { IllegalEventError, IllegalEventNumberError, NotImplementedError };
