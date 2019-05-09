class IllegalEventNumberError extends Error {
  constructor(version, number) {
    super();
    this.version = version;
    this.number = number;
    this.name = "IllegalEventNumberError";
  }
}

module.exports = IllegalEventNumberError;
