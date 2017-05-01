'use strict';

const _ = require('lodash');

let User = require('./models/user');
let PrayerReq = require('./models/prayerReq');

let msgOpts = {
  parse_mode: 'Markdown'
}

class Parser {
  constructor() {}

  showHelp(bot, msg) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
*List of commands*
\/help: Launch this help menu
\/setname *<alias>*: Sets name as *alias*
\/pray *<prayer request>*: Issue a *prayer request*
\/show: Display your prayer requests
      `, msgOpts);

  }

  parse(bot, msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const result = /\/help/g.exec(msg.text);
    if (result) {
      this.showHelp(bot, msg);
      return;
    }

    User.findOne({
      id: userId
    }).then((user) => {
      if (user) {
        this.process(user, bot, msg)
      } else {
        this.requestAlias(bot, msg);
      }
    });
  }

  requestAlias(bot, msg) {
    console.log('proceeding to check alias')
    const userId = msg.from.id;
    const firstName = msg.from.first_name;
    const lastName = msg.from.last_name;
    const chatId = msg.chat.id;

    // proceed to find if user is keying in his alias name.  If so, proceed.
    const result = /^(?:\/setname[\s]+)([a-z0-9]+)$/g.exec(msg.text);
    console.log(result);
    if (!result) {
      bot.sendMessage(chatId, `Hello ${firstName}!  I do not know your name as yet.  Please enter an *alias* before proceeding:
\`\/setname <alias>\``, msgOpts);
    } else {
      const alias = result[1];
      let user = new User({
        id: userId,
        alias: alias,
        firstName: firstName,
        lastName: lastName
      });
      user.save().then((user) => {
        bot.sendMessage(chatId, `Welcome *${alias}*, alias successfully saved!`, msgOpts);
      });
    }
  }

  process(user, bot, msg) {
    console.log('@@@@@@@@@@@');
    console.log(msg);
    console.log('@@@@@@@@@@@');
    const chatId = msg.chat.id;
    console.log('proccesing msg.....')

    // check if it is prayer req
    let result;
    if (result = /^(?:\/pray\s+)(.*)$/g.exec(msg.text)) {
      const prayerReqText = result[1];
      const prayerReq = new PrayerReq({
        userId: user.id,
        chatId: chatId,
        text: prayerReqText
      }).save().then(() => {
        bot.sendMessage(chatId, `Hello ${user.alias}, received your prayer request:
*${prayerReqText}*
        `, msgOpts);
      });

    } else if (result = /^(\/show\s*)$/g.exec(msg.text)) {
      PrayerReq.find({
        userId: user.id
      }).then((prayerReqs) => {
        let i = 0;
        let prayerMsg = `Prayer messages for *${user.alias}*:` +
          _.reduce(prayerReqs, (text, prayerReq) => {
            i++;
            return text + `\n${i}. ${prayerReq.text}`;
          }, '');
        bot.sendMessage(chatId, prayerMsg, msgOpts);
      });

    } else if (result = /^(?:\/delete[\s]+)([0-9]+)$/g.exec(msg.text)) {
      const msgIdx = parseInt(result[1]) - 1;


      PrayerReq.find({
        userId: user.id
      }).then((prayerReqs) => {
        if (!prayerReqs) {
          return;
        }
        let prayerReq = prayerReqs[msgIdx];

        // index does not exist.  To re-try:
        if (!prayerReq) {
          bot.sendMessage(chatId, `No such index: *${msgIdx + 1}*  Please retry?`, msgOpts);
          return;
        }

        const opts = {
          reply_markup: {
            inline_keyboard: [
              [{
                callback_data: `delete_y_${prayerReq.id}`, // TODO use a proper UUID here
                text: 'yes'
              }, {
                text: 'no',
                callback_data: 'delete_n'
              }]
            ]
          }
        }
        bot.sendMessage(chatId, `Really delete request: ${prayerReq.text}`, opts).then((bla) => {
          console.log(bla);
        });
      });
      // bot.answerInlineQuery();

    } else {
      bot.sendMessage(chatId, 'Received your message');
    }
  }

  parseCallbackQuery(bot, query) {
    const label = query.data;
    console.log(label);
    let result;
    if (result = /^(?:delete)_(?:y)_([0-9a-f]+)$/g.exec(label)) {
      const id = result[1];
      console.log(id);
      PrayerReq.remove({_id: id}).then((prayerReq) => {
        // console.log(prayerReq);
        bot.answerCallbackQuery(query.id, 'Deleted request!');
      });

    } else if (result = /^(?:delete)_(?:n)$/g.exec(label)) {
        bot.answerCallbackQuery(query.id, 'Ok, not deleting.');
    } else {
      console.log('undefined');
    }
  }

}

module.exports = Parser;
