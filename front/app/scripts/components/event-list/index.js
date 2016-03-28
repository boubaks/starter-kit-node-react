'use strict';
var React = require('react'),
    classNames = require('classnames'),
    template = require('./template.jsx');

module.exports = React.createClass({
    getDefaultProps: function () {
        return {
            authentication: null,
            events: null,
            loadMore: function () {}
        };
    },
    render: function () {
        var helpers = {};
        helpers.classes = classNames({
            'event-list': true
        });
        return this.props.events ? template.call(this, helpers) : null;
    }
});
