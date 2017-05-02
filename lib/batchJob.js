'use strict';

const schedule = require('node-schedule');
const _ = require('lodash');

const db = require('./db');
const PrayerReq = require('./models/prayerReq');
const User = require('./models/user');

class BatchJob {
  constructor(bot) {
    this.bot = bot;
  }

  run() {
    const bot = this.bot;
    const job = schedule.scheduleJob('* * * * *', () => {
      console.log('job ran.');
    });
  }
}

// PrayerReq.distinct('chatId', (err, chatIds) => {
//   if (err) {
//     return;
//   }
//   _.each(chatIds, (chatId) => {
//     PrayerReq
//       .find({
//         chatId: chatId
//       })
//       .sort({
//         userId: 1
//       })
//       .populate('userMongoId')
//       .then((prayerReqs) => {
//         let prayerReqsByUser = _.partition(prayerReqs, (req) => {
//           return req.userId;
//         });
//
//         let output = '';
//         for (let i = 0; i < prayerReqsByUser.length; i++) {
//           let prayerReqs = prayerReqsByUser[i];
//           if (prayerReqs.length > 0) {
//             output += prayerReqs[0].userMongoId.alias + '\n';
//             for (let j = 0; j < prayerReqs.length; j++) {
//               output += (j + 1) + '. ' + prayerReqs[j].text + '\n';
//             }
//             output += '\n';
//           }
//         }
//
//         console.log(output);
//
//       });
//   });
// });

module.exports = BatchJob;
