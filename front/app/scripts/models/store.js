'use strict';
var dispatcher = require('../dispatcher'),
    Model = require('backbone').Model,
    _ = require('underscore');

var Store = Model.extend({
    constructor: function () {
        this.dispatchToken = dispatcher.register(this.onAction.bind(this));
        // super constructor call
        Model.apply(this, arguments);
    },
    // return data that are needed by the views
    getData: function () {
        return {};
    },
    // used to trigger binded views renders
    emitChange: function () {
        this.trigger('change', this.getData());
    },
    addChangeListener: function (callback) {
        this.on('change', callback);
    },
    removeChangeListener: function (callback) {
        this.off('change', callback);
    },
    // action handlers map
    // e.g. :
    // {
    //   'ADD_ITEM': 'addItem',
    //   'RESET': function (action) { ... }
    // }
    // "method" can be a string (a method name of this instance) or a function.
    // the handler is called with an action object as parameter
    actions: {},
    // try to execute an action handler defined in actions object
    onAction: function (action) {
        var type = action.type,
            actionHandler = type && this.actions[type];
        if (!actionHandler) { return; }
        if (_.isString(actionHandler)) {
            return this[actionHandler](action);
        }
        if (_.isFunction(actionHandler)) {
            return actionHandler(action);
        }
    }
});

module.exports = Store;
