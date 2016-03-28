'use strict';
var Model = require('./default'),
    jq = require('jquery'),
    TweetIntent = require('./sharing/tweet-intent'),
    fbManager = require('../social/facebook-manager'),
    tracking = require('../tracking'),
    conf = require('../conf');

module.exports = Model.extend({
	idAttribute: '_id',
    urlRoot: function () {
        return conf.apiUrlRoot + '/user/';
    },
    fetchUrlRoot: function () {
        return conf.apiUrlRoot + '/public/user';
    },
    fetchUrl: function () {
        return this.fetchUrlRoot() + '/' + this.id;
    },
    fetch: function (attributes, options) {
        options = options || {};
        options.url = this.fetchUrl();
        return Model.prototype.fetch.call(this, options);
    },
    initialize: function (attributes, options) {
        options = options || {};
        // super init
        Model.prototype.initialize.call(this, attributes, options);
        /*
	        // adds a cache layer when fetched
	        offlineManager.includeModel(this);
        */
        return this;
    }
});