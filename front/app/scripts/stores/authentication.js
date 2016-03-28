'use strict';
var Default = require('../models/store.js'),
    Authentication = require('../models/authentication');

var Store = Default.extend({
    initialize: function () {
        this.authentication = new Authentication();
    },
    getData: function () {
        return this.authentication;
    },
    actions: {
        'TEST_AUTHENTICATION': 'test'
    },
    test: function () {
        this.authentication.fetch().then(function () {
            this.emitChange();
        }.bind(this));
    }
});

// event list store application singleton
module.exports = new Store();
