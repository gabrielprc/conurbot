var messages = require('./messages');
var commands = require('./commands');

module.exports = function Messenger(telegramBot) {
	const bot = telegramBot;
	var _self = this;
	var chatIds = [];
	var lastReply = null;

	function bind() {
		for (var i = 0; i < messages.length; i++) {
			bindText(messages[i].expression, messages[i].messages);
		}

		for (var i = 0; i < commands.length; i++) {
			bindCommand(commands[i]);
		}

		bindAdminTools();

		bot.on('message', function(msg) {
			storeChatId(msg.chat.id);
			checkReplies(msg);
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

	function sendPicture(path, timeout, fromId, options) {
		if (!fromId) {
			var ids = chatIds;
		} else {
			var ids = [fromId];
		}

		for (var i = 0; i < ids.length; i++) {
			if (timeout) {
				var id = ids[i];
				setTimeout(function() {
					bot.sendPhoto(id, path, options);
				}, timeout);
			} else {
				bot.sendPhoto(id, path, options);
			}
		}

		return {
			then: function(p, t, o) {
				return sendPicture(p, t, fromId, o);
			}
		}
	}

	function bindText(expression, responses) {
		bot.onText(expression, function (msg) {
			doSometimes(function() {
				var messenger = sendMessage(responses[0].text, responses[0].delay, msg.chat.id);

				if (responses.length > 1) {
					for (var j = 1; j < responses.length; j++) {
						messenger.then(responses[j].text, responses[j].delay)
					}
				}
			});
		});
	}

	function bindCommand(command) {
		bot.onText(new RegExp('\/' + command.command + ' (.+)', 'ig'), function (msg, match) {
			sendMessage(command.getMessage(match), null, msg.chat.id);
		});
	}

	function bindAdminTools() {
		bot.onText(/\/echo (.+)/, (msg, match) => {
			if (msg.from.username === 'conurban') {
				sendMessage(match[1]);
			}
		});
	}

	function checkReplies(msg) {
		doSometimes(function() {
			replyPicture('../resources/images/pepe.png', msg.chat.id, msg.message_id);
		});
	}

	function doSometimes(callback) {
		var chance = Math.random();
		var now = new Date().getTime();
		if (chance <= 0.05 && (!lastReply || (now - lastReply) >= 60000)) {
			lastReply = now;
			callback();
		}
	}

	function reply(text, chatId, messageId) {
		sendMessage(text, null, chatId, {reply_to_message_id: messageId});
	}

	function replyPicture(path, chatId, messageId) {
		sendPicture(path, null, chatId, {reply_to_message_id: messageId});
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