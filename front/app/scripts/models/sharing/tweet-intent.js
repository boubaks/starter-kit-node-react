'use strict';
var Popup = require('../popup'),
    _ = require('underscore');

module.exports = Popup.extend({
    /**
     * Default attributes.
     * Extends Popup default attributes
     * with tweet intent own attributes.
     * @method defaults
     * @return {Object} default attributes hash
     */
    defaults: function () {
        var defaults = _.result(Popup.prototype, 'defaults');
        return _.extend({}, defaults, {
            url: 'https://twitter.com/intent/', // Twitter intent base sharing url
            action: 'tweet', // Twitter intent action. 'tweet' / 'retweet' / 'favorite'
            // Twitter intent parameters hash (see https://dev.twitter.com/docs/intents#tweet-intent)
            parameters: {}
        });
    },
    /**
     * @method formatUrl
     * @protected
     * @return {String} formatted sharing url string
     */
    formatUrl: function () {
        return this.get('url') + this.get('action') + '?' + this.joinParams(this.get('parameters'), '&', '=');
    },
    /**
     * Overrides popup open method
     * @method open
     * @return {Object} created window
     */
    open: function () {
        return Popup.prototype.open.call(this, this.formatUrl());
    }
});
