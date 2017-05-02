const mongoose = require('../db'),
  Schema = mongoose.Schema;


let PrayerReq = mongoose.model('PrayerReq', new Schema({
  userId: Number,
  userMongoId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  chatId: Number,
  text: String,
  dateCreated: Date
}));


module.exports = PrayerReq;
