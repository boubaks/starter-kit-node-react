'use strict';
var _ = require('underscore'),
    memoryStorage = require('./memory-storage'),
    store = window.localStorage || window.sessionStorage || memoryStorage,
    api = {};

/**
 * localStorage wrapper interface.
 * Simplifies and extends the local/sessionStorage api.
 * Fallbacks to a memory storage if localStorage
 * or sessionStorage are not available.
 */
_.extend(api, {
    serialize: function (value) {
        return JSON.stringify(value);
    },
    deserialize: function (value) {
        if (!_.isString(value)) {
            return undefined;
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    },
    set: function (key, value) {
        try {
            store.setItem(key, api.serialize(value));
        } catch(e) {
            console.warn(e.message);
        }
        return value;
    },
    unset: function (key) {
        return store.removeItem(key);
    },
    get: function (key) {
        var value = store.getItem(key);
        return value === null ? undefined : api.deserialize(value);
    },
    has: function (key) {
        return store.getItem(key) !== null;
    },
    length: function () {
        return store.length;
    },
    keys: function () {
        return _.keys(store);
    },
    values: function () {
        return _.values(store).map(api.deserialize);
    },
    getAll: function () {
        return _.object(api.keys(), api.values());
    },
    forEach: function (callback, context) {
        return _.forEach.call(_, api.getAll(), callback, context);
    },
    clear: function () {
        return store.clear();
    }
});

module.exports = _.extend({}, api); // protect internal api methods calls
