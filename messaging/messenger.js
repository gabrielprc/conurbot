var messages = require('./messages');

module.exports = function Messenger(telegramBot) {
	const bot = telegramBot;

	this.bind = function() {
		for (var i = 0; i < messages.length; i++) {
			bindText(messages[i].expression, messages[i].messages);
		}

		// bot.on('message', function (msg) {
		// 	var chatId = msg.chat.id;
		// 	// photo can be: a file path, a stream or a Telegram file_id
		// 	var photo = 'cats.png';
		// 	bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
		// });
	}

	function bindText(expression, responses) {
		bot.onText(expression, function (msg) {
			var messenger = sendMessage(msg.from.id, responses[0].text, responses[0].delay);

			if (responses.length > 1) {
				for (var j = 1; j < responses.length; j++) {
					messenger.then(responses[j].text, responses[j].delay)
				}
			}
		});	
	}

	function sendMessage(fromId, message, timeout) {
		if (timeout) {
			setTimeout(function() {
				bot.sendMessage(fromId, message);
			}, timeout);
		} else {
			bot.sendMessage(fromId, message);
		}

		return {
			then: function(m, t) {
				return sendMessage(fromId, m, t);
			}
		}
	}
}