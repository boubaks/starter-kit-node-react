'use strict';
var React = require('react'),
    classNames = require('classnames'),
    template = require('./template.jsx');

module.exports = React.createClass({
    render: function () {
        var helpers = {};
        helpers.classes = classNames({
            'main-header': true
        });
        return template.call(this, helpers);
    }
});
