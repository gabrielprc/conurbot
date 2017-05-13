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

	function sendMessage(message, timeout, fromId, options) {
		if (!fromId) {
			var ids = chatIds;
		} else {
			var ids = [fromId];
		}

		for (var i = 0; i < ids.length; i++) {
			if (timeout) {
				var id = ids[i];
				setTimeout(function() {
					bot.sendMessage(id, message, options);
				}, timeout);
			} else {
				bot.sendMessage(ids[i], message, options);
			}
		}

		return {
			then: function(m, t, o) {
				return sendMessage(m, t, fromId, o);
			}
		}
	}

	function bindText(expression, responses) {
		bot.onText(expression, function (msg) {
			var messenger = sendMessage(responses[0].text, responses[0].delay, msg.chat.id);

			reply_to_message_id

			if (responses.length > 1) {
				for (var j = 1; j < responses.length; j++) {
					messenger.then(responses[j].text, responses[j].delay)
				}
			}
		});	
	}

	function checkReplies(msg) {
		var chance = Math.random();
		if (chance <= 0.1) {
			switch(msg.from.username) {
				case 'lukeovalle':
					reply('Aprendé a programar.', msg.chat.id, msg.message_id)
					break;
				case 'ElMenduko':
					reply('Andá a pisar uvas.', msg.chat.id, msg.message_id)
					break;
				case 'Lucas_93':
					reply('Ehhhh.......... dame una birra.', msg.chat.id, msg.message_id)
					break;
				case 'conurban':
					reply('Me caés bien', msg.chat.id, msg.message_id)
					break;
				case 'patyconprovoleta':
					reply('Hola, rekkardo', msg.chat.id, msg.message_id)
					break;
			}
		}
	}

	function reply(text, chatId, messageId) {
		sendMessage(text, null, chatId, message_id);
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