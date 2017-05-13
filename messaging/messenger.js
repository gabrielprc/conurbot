var messages = require('./messages');

module.exports = function Messenger(telegramBot) {
	const bot = telegramBot;
	var _self = this;
	var chatIds = [];

	function bind() {
		for (var i = 0; i < messages.length; i++) {
			bindText(messages[i].expression, messages[i].messages);
		}

		bot.on('message', function(msg) {
			storeChatId(msg.chat.id);
		});
	}

	function sendMessage(message, timeout, fromId) {
		if (!fromId) {
			var ids = chatIds;
		} else {
			var ids = [fromId];
		}

		for (var i = 0; i < ids.length; i++) {
			if (timeout) {
				var id = ids[i];
				setTimeout(function() {
					bot.sendMessage(id, message);
				}, timeout);
			} else {
				bot.sendMessage(ids[i], message);
			}
		}

		return {
			then: function(m, t) {
				return sendMessage(m, t, fromId);
			}
		}
	}

	function bindText(expression, responses) {
		bot.onText(expression, function (msg) {
			var messenger = sendMessage(responses[0].text, responses[0].delay, msg.from.id);

			if (responses.length > 1) {
				for (var j = 1; j < responses.length; j++) {
					messenger.then(responses[j].text, responses[j].delay)
				}
			}
		});	
	}

	function storeChatId(id) {
		var exists = false;

		for (var i = 0; i < chatIds.length; i++) {
			if (chatIds[i] == id) {
				exists = true;
				break;
			}
		}

		if (!exists) {
			chatIds.push(id);
		}
	}

	return {
		send: sendMessage,
		bind: bind
	}
}