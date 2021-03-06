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

	function get() {
		r.getSubreddit(subreddit).getNew({limit: 1}).then(function(threads) {
			var thread = threads[0];
			if (!lastThread || lastThread != thread.created_utc) {
				lastThread = thread.created_utc;
				sendMessage(thread.url);
			}
		});
	}

	function sendMessage(url) {
		messenger
			.send('Chicos, postearon algo en el sub ;)')
			.then(url);
	}

	return {
		get: get
	}
}