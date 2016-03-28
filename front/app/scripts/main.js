'use strict';
var Starter = require('./starter'),
    app = new Starter().start(); // instantiation & start

if (process.env.NODE_ENV !== 'production') {
    window.app = app;
}
