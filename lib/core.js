'use strict';

const TelegramBot = require('node-telegram-bot-api');

const config = require('../config.json');
const mongoose = require('./db');
const Parser = require('./parser')
const BatchJob = require('./batchJob');

const parser = new Parser();
const bot = new TelegramBot(config.telegram.token, {
  polling: true
});
const batchJob = new BatchJob(bot);
batchJob.run();

bot.on('message', (msg) => {
  parser.parse(bot, msg);
});

bot.on('callback_query', (callbackQuery) => {
  parser.parseCallbackQuery(bot, callbackQuery);
});
