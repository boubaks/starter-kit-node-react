var conf = {
	'host': 'localhost',
	'port': 9200,
	'twitterCallbackUrl': 'http://localhost:9000/api/auth/twitter/callback',
	'facebookCallbackUrl': 'http://localhost:9000/api/auth/facebook/callback'

};

exports.config = function(opt) {
	return (conf[opt]);
}