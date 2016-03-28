'use strict';
var _ = require('underscore'),
    jq = require('jquery'),
    defaultOptions = {
        limit: 0, // Number or function returning Number
        container: null, // DOM Element or function returning DOM Element
        above: function () {}, // callback
        under: function () {} // callback
    };

module.exports = function (options) {
    var opts = _.extend({}, defaultOptions, options),
        scroll = 0,
        container;

    // helper
    var result = function (value, context) {
        if (_.isFunction(value)) {
            return value.call(context);
        }
        return value;
    };

    return {
        scrollLimitTest: _.throttle(function () {
            var limit = result(opts.limit, this),
                newScroll;
            // no event header
            if (!_.isNumber(limit)) {
                return;
            }
            // check if scroll is crossing the limit
            newScroll = container.scrollTop;
            // pass above
            if (scroll < limit && newScroll >= limit) {
                opts.above.call(this);
            }
            // pass under
            if (scroll >= limit && newScroll < limit) {
                opts.under.call(this);
            }
            // remember the scroll
            scroll = newScroll;
        }, 200),
        componentDidMount: function () {
            container = result(opts.container, this);
            jq(container).on('scroll', this.scrollLimitTest);
        },
        componentWillUnmount: function () {
            jq(container).off('scroll', this.scrollLimitTest);
        }
    };
};
