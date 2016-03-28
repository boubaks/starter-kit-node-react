'use strict';
var store = require('./lib/store'),
    jq = require('jquery'),
    _ = require('underscore'),
    offlineManager;

var P = function () { return new jq.Deferred(); }, // return promise
    MAX_COUNT = 100,
    LIFETIME = 604800000; // 7 days (ms)

offlineManager = {
    /**
     * Hash of all the keys stored associated with a timestamp of the last update
     * @type {Object}
     */
    updateTable: {},
    /**
     * Saves the content of updateTable in the store.
     * The function is debounced to avoid closed calls.
     * @method
     */
    saveUpdateTable: _.debounce(function () {
        store.set('offline-manager:update-table', offlineManager.updateTable);
    }, 1000),
    /**
     * Loads updateTable from store
     * @method loadUpdateTable
     */
    loadUpdateTable: function () {
        offlineManager.updateTable = store.get('offline-manager:update-table') || {};
    },
    /**
     * Updates the timestamp of a saved item in the store
     * @method setTime
     * @param  {String} key saved item key
     */
    setTime: function (key) {
        offlineManager.updateTable[key] = Date.now();
        if (_.size(offlineManager.updateTable) > MAX_COUNT) {
            return this.pruneStore(MAX_COUNT);
        }
        offlineManager.saveUpdateTable();
    },
    /**
     * Store an item
     * @method store
     * @param  {String} key  item key for the store
     * @param  {*} data item
     */
    store: function (key, data) {
        store.set(key, data);
        offlineManager.setTime(key);
    },
    /**
     * Removes all items stored by offlineManager that are outdated.
     * An item is outdated if the last time it was updated is longer than duration.
     * @method cleanStore
     * @param  {Number}   duration amount of time (in milliseconds) to consider an item outdated
     */
    cleanStore: function (duration) {
        var now = Date.now(),
            partition = _.partition(_.pairs(offlineManager.updateTable), function (item) {
                var timestamp = item[1];
                return now - timestamp > duration;
            }),
            outdated = partition[0],
            alive = partition[1];
        outdated.forEach(function (item) {
            var key = item[0];
            store.unset(key);
        });
        offlineManager.updateTable = _.object(alive);
        offlineManager.saveUpdateTable();
    },
    /**
     * Removes all items stored by offlineManager that exceed the max count.
     * @method pruneStore
     * @param  {Number}   max max items count
     */
    pruneStore: function (max) {
        var partition = _.partition(_.pairs(offlineManager.updateTable), function (item, index) {
                return index < max;
            }),
            inside = partition[0],
            outside = partition[1];
        outside.forEach(function (item) {
            var key = item[0];
            store.unset(key);
        });
        offlineManager.updateTable = _.object(inside);
        offlineManager.saveUpdateTable();
    },
    /**
     * Watch ajax function returned promise resolution.
     * If the promise is resolved, store the response.
     * If the promise is rejected, serve a cached response if previously saved.
     * @method cacheProxy
     * @param  {Function}   ajax    function that returns a promise like object (Deferred, jqXHR, ...)
     * @param  {String}     key     key for the response that should be saved/retrieved
     * @return {Object}             Promise like object for chaining
     */
    cacheProxy: function (ajax, key) {
        return ajax().then(
            // success
            function (data) {
                offlineManager.store(key, data);
                return new P().resolve(data, false); // false => not from cache
            },
            // error
            function () {
                if (store.has(key)) {
                    return new P().resolve(store.get(key), true); // true => from cache
                }
                return new P().reject();
            }
        );
    },
    /**
     * Returns an identifier for a Backbone Model or Collection fetched data
     * @method formatModelKey
     * @param  {Object}       model Backbone Model or Collection
     * @return {String}
     */
    formatModelKey: function (model) {
        return ['offline-manager', 'get', _.result(model, 'url')].join(':');
    },
    /**
     * Overrides default sync method to add an intermediate cache layer
     * @method modelCacheProxy
     * @chainable
     * @param  {Object}        model Backbone Model or Collection
     */
    modelCacheProxy: function (model) {
        var sync = model.constructor.prototype.sync; // default sync function
        // overrides sync method with a new one that adds a cache layer
        model.sync = function (method, model, options) {
            var success = options.success,
                key = offlineManager.formatModelKey(model),
                ajax;
            options.success = null; // change success execution order after modelCacheProxy work
            ajax = sync.bind(model, method, model, options);
            return offlineManager.cacheProxy(ajax, key).done(success);
        };
        return model;
    }
};

// init
offlineManager.loadUpdateTable();
offlineManager.cleanStore(LIFETIME);

// public api
module.exports = {
    includeModel: offlineManager.modelCacheProxy
};
