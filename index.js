const Aggregate = require('./src/lib/Aggregate');
const Event = require('./src/lib/Event');
const { IllegalEventError, IllegalEventNumberError, NotImplementedError } = require('./src/lib/errors');
const Resource = require('./src/lib/Resource');

module.exports = {
  Aggregate,
  Event,
  IllegalEventError,
  IllegalEventNumberError,
  NotImplementedError,
  Resource
};
