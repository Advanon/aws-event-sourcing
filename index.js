const Aggregate = require('./src/lib/Aggregate');
const Event = require('./src/lib/Event');
const IllegalEventError = require('./src/lib/IllegalEventError');
const IllegalEventNumberError = require('./src/lib/IllegalEventNumberError');
const NotImplementedError = require('./src/lib/NotImplementedError');
const Resource = require('./src/lib/Resource');

module.exports = {
    Aggregate,
    Event,
    IllegalEventError,
    IllegalEventNumberError,
    NotImplementedError,
    Resource
}