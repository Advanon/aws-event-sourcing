const Aggregate = require('./src/Aggregate');
const Event = require('./src/Event');
const { IllegalEventError, IllegalEventNumberError, NotImplementedError } = require('./src/errors');
const Resource = require('./src/Resource');

module.exports = {
  Aggregate,
  Event,
  IllegalEventError,
  IllegalEventNumberError,
  NotImplementedError,
  Resource
};
