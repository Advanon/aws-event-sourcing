class IllegalEventError extends Error {
  constructor() {
    super();
    this.name = 'IllegalEventError';
  }
}

module.exports = IllegalEventError;
