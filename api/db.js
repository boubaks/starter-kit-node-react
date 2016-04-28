var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var config = require('./config').config;

var defaultHost = config('mongoDBHost');
var defaultPort = config('mongoDBPort');
var defaultName = config('mongoDBName');
var defaultUrl = 'mongodb://' + defaultHost + ':' + defaultPort + '/' + defaultName;

function db() {
    this.database = null;
    this.url = null;
    return (this);
}

db.prototype.connect = function (host, port, name) {
	var url = host && port && name ? 'mongodb://' + host + ':' + port + '/' + name : defaultUrl;
	this.url = url;
	MongoClient.connect(url, function(err, client) {
		if (err) {
			console.log(err)
		    this.error = err;
		} else {
			console.log('mongoDB -> Connected to', url);
			this.database = client;
		}
    }.bind(this));
}

var db = module.exports = exports = new db;
