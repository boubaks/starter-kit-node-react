'use strict';
var Collection = require('./default'),
    UrlFilters = require('../models/url-filters'),
    _ = require('underscore'),
    jq = require('jquery'),
    conf = require('../conf'),
    offlineManager = require('../offline-manager');

module.exports = Collection.extend({
    apiUrlRoot: conf.apiUrlRoot,
    filters: {
        $page: 1,
        $limit: 20
    },
    isFull: false,
    getPage: function () {
        return this.urlFilters.get('$page');
    },
    setPage: function (num) {
        this.urlFilters.set('$page', Number(num));
        return this;
    },
    getLimit: function () {
        return this.urlFilters.get('$limit');
    },
    setLimit: function (num) {
        this.urlFilters.set('$limit', Number(num));
        return this;
    },
    loadMore: function () {
        var limit = this.getLimit(),
            length = this.length;

        // useless if already fully loaded or waiting for a server response
        if (this.isFull || this.isPending()) { return new jq.Deferred().reject(); }
        this.setPage(((length - (length % limit)) / limit) + 1); // adapt page number to length & limit
        return this.fetch({ remove: false, merge: false });
    },
    reload: function (options) {
        this.reset();
        return this.fetch(options);
    },
    reset: function (models) {
        models = models || [];
        this.setPage(1);
        this.isFull = _.isNumber(this.count) ? this.count <= models.length : models.length < this.urlFilters.get('$limit');
        return Collection.prototype.reset.apply(this, arguments);
    },
    parse: function (resp) {
        // check if it is a $count call
        if (_.isNumber(resp.count) && _.isArray(resp.datas)) {
            this.count = resp.count;
            resp = resp.datas;
        } else {
            this.count = null;
        }
        resp = resp || [];
        // check if has reach limit
        this.isFull = _.isNumber(this.count) ? this.count <= (this.length + resp.length) : resp.length < this.urlFilters.get('$limit');
        return resp;
    },
    initialize: function (models, options) {
        options = options || {};
        // super init
        Collection.prototype.initialize.call(this, models, options);
        // adds a cache layer when fetched
        offlineManager.includeModel(this);
        // create url filters
        this.filters = _.extend({}, this.filters, options.filters);
        this.urlFilters = new UrlFilters(this.filters);
        return this;
    }
});
