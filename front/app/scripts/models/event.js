'use strict';
var _ = require('underscore'),
    conf = require('../conf'),
    Model = require('./default'),
    UrlFilters = require('./url-filters'),
    offlineManager = require('../offline-manager'),
    tracking = require('../tracking');

module.exports = Model.extend({
    idAttribute: '_id',
    filters: {
        $limit: 15,
        $page: 1
    },
    urlRoot: conf.apiUrlRoot + '/event',
    fetchUrlRoot: conf.apiUrlRoot + '/public/event',
    fetchUrl: function () {
        var filters = this.urlFilters.format();
        return this.fetchUrlRoot + params + (filters ? '?' + filters : '');
    },
    fetch: function (options) {
        options = options || {};
        options.url = this.fetchUrl();
        return Model.prototype.fetch.call(this, options)
            .then(function (data) {
                return data;
            }.bind(this));
    },
    toJSON: function () {
        return _.pick(this.attributes, '_id', 'title', 'description', 'cover');
    },
    isLive: function () {
        var now = Date.now(),
            start = this.getStart(),
            end = this.getFinish();
        return now >= start && now <= end;
    },
    getCover: function () {
        return this.get('cover');
    },
    getTitle: function () {
        return this.get('title');
    },
    initialize: function (attributes, options) {
        options = options || {};
        // super init
        Model.prototype.initialize.call(this, attributes, options);
        // create url filters
        this.filters = _.extend({}, this.filters, options.filters);
        this.urlFilters = new UrlFilters(this.filters);
        // adds a cache layer when fetched
        offlineManager.includeModel(this);
        return this;
    }
});
