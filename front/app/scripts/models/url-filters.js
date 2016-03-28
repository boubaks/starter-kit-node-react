'use strict';
var Model = require('./default'),
    _ = require('underscore');

module.exports = Model.extend({
    /**
     * Returns a formatted string of the attributes as GET parameters
     * @method format
     * @return {String} formatted string
     */
    format: function () {
        return _.map(this.attributes, function (value, key) {
            return window.encodeURIComponent(key) + '=' + window.encodeURIComponent(value);
        }).join('&');
    },
    /* 
    // example
    setValue: function (key) {
        day = day || null;
        if (key) {
            this.set('key', key);
            return this;
        } if (this.has('key')) {
            this.unset('key');
        }
        return this;
    },
    */
});
