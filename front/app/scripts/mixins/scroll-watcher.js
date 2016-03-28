'use strict';
var ScrollWatcher = require('../lib/scroll-watcher'),
    ReactDom = require('react-dom'),
    _ = require('underscore'),
    defaultOptions = {
        horizontal: false,
        vertical: false,
        events: {},
        updateDim: false
    };

module.exports = function (refName, options) {
    var scrollWatcher,
        interval,
        opts = _.extend({}, defaultOptions, options);
    return {
        componentDidMount: function () {
            var container = this.refs && this.refs[refName] && ReactDom.findDOMNode(this.refs[refName]);
            container = container || document.createElement('div');
            scrollWatcher = new ScrollWatcher(container, {
                vertical: opts.vertical,
                horizontal: opts.horizontal
            });

            // event bindings
            _.forEach(opts.events, function (handler, eventName) {
                // call function
                if (_.isFunction(handler)) {
                    return scrollWatcher.events.on(eventName, handler);
                }
                // call instance method
                if (_.isString(handler) && _.isFunction(this[handler])) {
                    return scrollWatcher.events.on(eventName, this[handler]);
                }
            }, this);

            if (_.isNumber(opts.autoUpdate) && opts.autoUpdate > 0) {
                interval = window.setInterval(function () {
                    scrollWatcher.updateDim();
                }, opts.autoUpdate);
            }

            scrollWatcher.start();
        },
        componentWillUnmount: function () {
            window.clearInterval(interval);
            scrollWatcher.events.off();
            scrollWatcher.stop();
        }
    };
};
