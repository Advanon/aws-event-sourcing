class NotImplementedError extends Error {
  constructor() {
    super('NotImplemented');
    this.name = 'NotImplementedError';
  }
}

module.exports = NotImplementedError;
