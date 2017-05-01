const mongoose = require('../db'),
  Schema = mongoose.Schema;


let User = mongoose.model('User', new Schema({
  alias: String,
  id: Number,
  firstName: String,
  lastName: String
}));


module.exports = User;
