'use strict';
var Default = require('../models/store.js'),
    Events = require('../collections/events');

var Store = Default.extend({
    initialize: function () {
        this.events = new Events([], {});
    },
    getData: function () {
        return this.events;
    },
    actions: {
        'LOAD_EVENTS': 'load',
        'LOAD_MORE_EVENTS': 'loadMore'
    },
    load: function (action) {
        if (action && action.filters) {
            this.events = new Events([], {
                filters: action.filters
            });
        }
        this.events.fetch({ reset: true }).then(function () {
            this.emitChange();
        }.bind(this));
    },
    loadMore: function () {
        this.events.loadMore().then(function () {
            this.emitChange();
        }.bind(this));
    }
});

// event list store application singleton
module.exports = new Store();
