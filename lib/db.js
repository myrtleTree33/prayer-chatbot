'use strict';

const Promise = require("bluebird");

const config = require('../config.json');
let mongoose = require('mongoose');
Promise.promisifyAll(mongoose);
mongoose.connect(config.mongo.uri);

module.exports = mongoose;
