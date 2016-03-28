'use strict';
var jq = require('jquery'),
    Backbone = require('backbone'),
    Router = require('./router');

// use jQuery as Backbone DOM/Ajax library
Backbone.$ = jq;

module.exports = Backbone.View.extend({
    el: document.getElementById('main-root'),
    /**
     * Backbone initialize function
     * @param  {Object} options
     * @return {Object}         view instance
     */
    initialize: function () {
        this.router = new Router({ root: this.el });
        return this;
    },
    /**
     * Starts up the application
     * It can be fired after the instantiation (e.g. after dom ready)
     * @return {Object} view instance
     */
    start: function () {
        Backbone.history.start({ pushState: true });
        return this;
    }
});
