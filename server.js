var http = require('http');
var TelegramBot = require('node-telegram-bot-api');
var Messenger = require('./messaging/messenger');
var SubredditConsumer = require('./reddit/consumer');
var port = process.env.PORT || 8080;
var token = process.env.TELEGRAM_TOKEN;
var bot = new TelegramBot(token, {polling: true});

var server = http.createServer(function(request, response) {
	console.log(request.url)
	response.end('Hello Node.js Server!')
});

server.listen(port, function(err){  
	if (err) {
	    return console.log('ufff, se rompió todo', err);
	}

	start()

	console.log('conurbot has risen');
});

function start() {
	var messenger = new Messenger(bot);
	messenger.bind();

	var consumer = new SubredditConsumer('conurban', messenger);
	setInterval(consumer.get, 10000);
}