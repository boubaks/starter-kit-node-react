'use strict';
var conf = require('./conf'),
    _ = require('underscore'),
    blurService;

blurService = {
    encode: window.encodeURIComponent,
    format: function (src) {
        var url;
        // ensure src is a non empty string
        if (!(_.isString(src) && src)) { return ''; }
        // base new url
        url = conf.apiBlurRoot + '/' + blurService.encode(src) + '/';
        // width
        return url;
    }
};

// public api
module.exports = {
    format: blurService.format
};