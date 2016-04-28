var conf = {
	'mongoDBHost': 'localhost',
	'mongoDBPort': '27017',
	'mongoDBName': 'starter',
	'elasticHost': 'localhost',
	'elasticPort': 9200,
	'twitterCallbackUrl': 'http://localhost:9000/api/auth/twitter/callback',
	'facebookCallbackUrl': 'http://localhost:9000/api/auth/facebook/callback'
};

exports.config = function(opt) {
	return (conf[opt]);
}