'use strict';
var tracking = {};

if (process.env.NODE_ENV === 'production') {
    // Google Analytics
    // ga loading script
    (function (i, s, o, g, r, a, m) {
        i.GoogleAnalyticsObject = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        };
        i[r].l = 1 * new Date();
        a = s.createElement(o);
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    // ga setup
    window.ga('create', 'key', 'auto');
} else {
    window.ga = function () {
        console.log('tracking', 'ga', arguments);
    };
}
// window.ga is replaced after script is loaded
// be sure to directly call window.ga
tracking.ga = function () {
    window.ga.apply(null, arguments);
};

module.exports = tracking;
