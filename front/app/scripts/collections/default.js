'use strict';
var Backbone = require('backbone');

// default collection
module.exports = Backbone.Collection.extend({
    pendingCount: 0,
    isPending: function () {
        return !!this.pendingCount;
    },
    initialize: function () {
        this.on('request', function () { this.pendingCount += 1; });
        this.on('sync error', function () { this.pendingCount -= 1; });
    }
});
