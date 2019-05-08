class IllegalEventNumberError extends Error {
  constructor() {
    super();
    this.name = "IllegalEventNumberError";
  }
}

module.exports = IllegalEventNumberError;
