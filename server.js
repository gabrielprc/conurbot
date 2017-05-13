var token = process.env.TELEGRAM_TOKEN || 'el token loco';
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(token, {polling: true});
var Messenger = require('./messaging/messenger');
var SubredditConsumer = require('./reddit/consumer');

var messenger = new Messenger(bot);
messenger.bind();

var consumer = new SubredditConsumer('conurban', messenger);

