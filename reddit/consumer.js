var snoowrap = require('snoowrap');

var r = new snoowrap({
  userAgent: 'conurbot',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

module.exports = function SubredditConsumer(subreddit, messenger) {

	var lastThread = null;

	this.get = function() {
		r.getSubreddit(subreddit).getNew({limit: 1}).then(function(thead) {
			if (!lastThread || thread.created_utc) {
				lastThread = thread.created_utc;
				sendMessage(thread.url):
			}
		});
	}

	function sendMessage(url) {
		messenger
			.sendMessage('Chicos, postearon algo en el sub ;)')
			.then(url);
	}
}