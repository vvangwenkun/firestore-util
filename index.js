const db = require('./lib/db');
const triggerV1 = require('./lib/triggers/v1');
const triggerV2 = require('./lib/triggers/v1');

exports.db = db;

exports.triggers = {
    v1: triggerV1,
    v2: triggerV2,
}
