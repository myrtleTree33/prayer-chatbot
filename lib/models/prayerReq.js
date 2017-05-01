const mongoose = require('../db'),
  Schema = mongoose.Schema;


let PrayerReq = mongoose.model('PrayerReq', new Schema({
  userId: Number,
  chatId: Number,
  text: String,
  dateCreated: Date
}));


module.exports = PrayerReq;
