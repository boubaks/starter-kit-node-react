'use strict';
var Model = require('./default'),
    User = require('./user'),
    conf = require('../conf');

module.exports = Model.extend({
    urlRoot: conf.apiUrlRoot + '/auth/info',
    isAuthenticated: function () {
        return !!this.get('isAuthenticated');
    },
    getAuthUrls: function () {
        return ({
            facebook: conf.apiUrlRoot + '/auth/facebook',
            twitter: conf.apiUrlRoot + '/auth/twitter'
        });
    },
    initialize: function (attributes, options) {
        options = options || {};
        // super init
        Model.prototype.initialize.call(this, attributes, options);
        // user model
        this.user = this.reflectModel(new User(), 'user');
    }
});
