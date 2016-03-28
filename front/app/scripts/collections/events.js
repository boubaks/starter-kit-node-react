'use strict';
var Collection = require('./api-collection'),
    EventModel = require('../models/event');

module.exports = Collection.extend({
    model: EventModel,
    filters: {
        $limit: 12,
        $page: 1
    },
    url: function () {
        var filters = this.urlFilters.format();
        return this.apiUrlRoot + '/public/event' + (filters ?  '?' + filters : '');
    },
    initialize: function (models, options) {
        options = options || {};
        // super init
        Collection.prototype.initialize.call(this, models, options);
        return this;
    }
});
