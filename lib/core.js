'use strict';

const Parser = require('./parser')
const config = require('../config.json');

let mongoose = require('./db');

const TelegramBot = require('node-telegram-bot-api');
const token = config.telegram.token;
const bot = new TelegramBot(token, {
  polling: true
});

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
// 'msg' is the received Message from Telegram
// 'match' is the result of executing the regexp above on the text content
// of the message
// const chatId = msg.chat.id;
// const resp = match[1]; // the captured "whatever"
// send back the matched "whatever" to the chat
// bot.sendMessage(chatId, resp);
// });

// Listen for any kind of message. There are different kinds of
// messages.


let parser = new Parser();

bot.on('message', (msg) => {
  console.log(msg);
  parser.parse(bot, msg);
});


bot.on('callback_query', (callbackQuery) => {
  parser.parseCallbackQuery(bot, callbackQuery);
});



// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//
// });
