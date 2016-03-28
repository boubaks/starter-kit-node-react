'use strict';
var Backbone = require('backbone'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    HomeLayout = require('./components/home-layout'),
    tracking = require('./tracking'),
    dispatcher = require('./dispatcher');

module.exports = Backbone.Router.extend({
    /**
     * Backbone initialize function
     * @param  {Object} options
     * @return {Object}         router instance
     */
    initialize: function (options) {
        this.root = options.root;
        return this;
    },
    render: function (Element, data) {
        ReactDOM.render(React.createElement(Element, data), this.root);
        return this;
    },
    /**
     * Routing Map
     * @type {Object}
     */
    routes: {
        '': 'home'
    },
    home: function () {
        dispatcher.dispatch({ type: 'TEST_AUTHENTICATION' });
        dispatcher.dispatch({ type: 'LOAD_EVENTS' });
        this.render(HomeLayout);
        tracking.ga('send', 'pageview', '/');
    }
});
