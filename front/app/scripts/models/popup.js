'use strict';
var Model = require('./default'),
    _ = require('underscore');

module.exports = Model.extend({
    /**
     * Default attributes
     * @property defaults
     * @type {Object}
     */
    defaults: {
        url: '',
        name: '',
        features: {
            width: 550,
            height: 420,
            scrollbars: 'yes',
            resizable: 'yes',
            toolbar: 'no',
            location: 'yes'
        },
        centered: true
    },
    /**
     * Encodes a value using encodeURIComponent.
     * If value is an array, encodes the children and join them with ','.
     * @method encode
     * @protected
     * @param  {Any} value the value to be encoded
     * @return {String}
     */
    encode: function (value) {
        return Array.isArray(value) ? value.map(this.encode).join(',') : window.encodeURIComponent(value);
    },
    /**
     * Returns a string from an object map by connecting keys and values
     * with a connector character and joining items with a separator character
     * @method joinParams
     * @param  {Object}   params
     * @param  {String}   separator
     * @param  {String}   connector
     * @return {String}
     */
    joinParams: function (params, separator, connector) {
        separator = separator || '&';
        connector = connector || '=';
        return _.map(params, function (value, key) {
            return key + connector + value;
        }).join(separator);
    },
    /**
     * Join window features (https://developer.mozilla.org/en-US/docs/Web/API/Window.open)
     * @method joinFeatures
     * @protected
     * @return {String}
     */
    joinFeatures: function () {
        return this.joinParams(this.get('features'), ',', '=');
    },
    /**
     * Adds left and top to window features in order to center the new window
     * @method setCenterPositions
     * @protected
     */
    setCenterPositions: function () {
        var features = this.get('features');
        features.left = Math.round(screen.width / 2 - features.width / 2);
        features.top = screen.height > features.height ? Math.round(screen.height / 2 - features.height / 2) : 0;
    },
    /**
     * Creates a new window using attributes
     * @method open
     * @param {String} [url]
     * @return {Object} new created window instance
     */
    open: function (url) {
        url = url || this.get('url');
        if (this.get('centered')) {
            this.setCenterPositions();
        }
        this.window = window.open(url, this.get('name'), this.joinFeatures());
        return this.window;
    }
});
